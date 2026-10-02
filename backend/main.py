import logging
import os
from pathlib import Path
from threading import Lock
from typing import Annotated

import fitz
import httpx
from chromadb import PersistentClient
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ValidationError


BACKEND_DIR = Path(__file__).resolve().parent
KNOWLEDGE_DIR = BACKEND_DIR / "knowledge"
DATABASE_DIR = BACKEND_DIR / "chroma_db"
MAX_UPLOAD_BYTES = 10 * 1024 * 1024
MAX_RESUME_CHARS = 50_000
MAX_JOB_DESCRIPTION_CHARS = 20_000
RETRIEVAL_COUNT = 5

load_dotenv(BACKEND_DIR.parent / ".env")
load_dotenv(BACKEND_DIR / ".env", override=True)

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger(__name__)

app = FastAPI(
    title="CareerLens Resume Analyzer API",
    description="Analyzes an uploaded resume against a job description using RAG.",
    version="1.0.0",
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_vector_store_lock = Lock()
_vector_collection = None
_vector_client = None


class ResumeAnalysis(BaseModel):
    ats_match_score: int = Field(ge=0, le=100)
    matching_skills: list[str]
    missing_skills: list[str]
    skill_gaps: list[str]
    resume_improvement_suggestions: list[str]
    relevant_job_roles: list[str]


def _split_into_chunks(text: str, max_chars: int = 1_000) -> list[str]:
    chunks: list[str] = []
    current = ""
    for paragraph in text.splitlines():
        paragraph = paragraph.strip()
        if not paragraph:
            continue
        while len(paragraph) > max_chars:
            if current:
                chunks.append(current)
                current = ""
            chunks.append(paragraph[:max_chars])
            paragraph = paragraph[max_chars:]
        if current and len(current) + len(paragraph) + 1 > max_chars:
            chunks.append(current)
            current = paragraph
        else:
            current = f"{current}\n{paragraph}".strip()
    if current:
        chunks.append(current)
    return chunks


def _get_vector_collection():
    global _vector_client, _vector_collection

    with _vector_store_lock:
        if _vector_collection is not None:
            return _vector_collection

        knowledge_files = sorted(KNOWLEDGE_DIR.glob("*.md"))
        if not knowledge_files:
            raise RuntimeError(f"No Markdown knowledge documents found in {KNOWLEDGE_DIR}.")

        embedding_function = SentenceTransformerEmbeddingFunction(
            model_name=os.getenv(
                "EMBEDDING_MODEL",
                "sentence-transformers/all-MiniLM-L6-v2",
            )
        )
        _vector_client = PersistentClient(path=str(DATABASE_DIR))
        _vector_collection = _vector_client.get_or_create_collection(
            name="resume_job_knowledge",
            embedding_function=embedding_function,
            metadata={"description": "Resume and job-search guidance documents"},
        )

        documents: list[str] = []
        identifiers: list[str] = []
        metadatas: list[dict[str, str | int]] = []
        for knowledge_file in knowledge_files:
            chunks = _split_into_chunks(
                knowledge_file.read_text(encoding="utf-8")
            )
            for chunk_index, chunk in enumerate(chunks):
                documents.append(chunk)
                identifiers.append(
                    f"{knowledge_file.stem}-{chunk_index}"
                )
                metadatas.append(
                    {"source": knowledge_file.name, "chunk": chunk_index}
                )

        if not documents:
            raise RuntimeError("The knowledge documents contain no readable text.")
        _vector_collection.upsert(
            ids=identifiers,
            documents=documents,
            metadatas=metadatas,
        )
        logger.info("Indexed %d knowledge chunks for retrieval.", len(documents))
        return _vector_collection


def _retrieve_knowledge(resume_text: str, job_description: str) -> str:
    collection = _get_vector_collection()
    query = f"Job description:\n{job_description}\n\nResume:\n{resume_text}"
    results = collection.query(
        query_texts=[query[:12_000]],
        n_results=min(RETRIEVAL_COUNT, collection.count()),
        include=["documents", "metadatas"],
    )
    documents = results.get("documents")
    metadatas = results.get("metadatas")
    if not documents or not documents[0]:
        raise RuntimeError("The knowledge base returned no relevant documents.")

    context_parts = []
    for document, metadata in zip(documents[0], (metadatas or [[]])[0]):
        source = metadata.get("source", "knowledge base") if metadata else "knowledge base"
        context_parts.append(f"[Source: {source}]\n{document}")
    return "\n\n".join(context_parts)


def _request_analysis(
    resume_text: str,
    job_description: str,
    retrieved_context: str,
) -> ResumeAnalysis:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError(
            "OPENROUTER_API_KEY is missing. Add it to the project or backend .env file."
        )

    model = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")
    prompt = f"""Review the candidate's resume for the supplied job description.

Use only the resume, job description, and retrieved knowledge-base context below.
Do not invent candidate details, skills, achievements, job requirements, or qualifications.
Matching skills must have evidence in both the resume and job description.
Missing skills must be job requirements that are not evidenced in the resume; do not
claim a skill is missing merely because the wording differs.
Describe skill gaps and suggestions in terms supported by those sources. Suggest job
roles only when supported by the candidate's resume and the job description.
Calculate an evidence-based ATS-style match score from 0 to 100; it must reflect this
resume and this job description, not a default or preset score.
Return only a JSON object with exactly these fields:
- ats_match_score: integer from 0 to 100
- matching_skills: array of strings
- missing_skills: array of strings
- skill_gaps: array of strings
- resume_improvement_suggestions: array of strings
- relevant_job_roles: array of strings
Use empty arrays when no evidence supports an item. Do not include a candidate name
unless it is explicitly present in the resume.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

RETRIEVED KNOWLEDGE-BASE CONTEXT:
{retrieved_context}
"""
    request_body = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are an evidence-grounded resume analyst. "
                    "Return valid JSON matching the requested fields. "
                    "Never substitute sample or generic candidate data."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.2,
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": os.getenv("OPENROUTER_SITE_URL", "http://localhost:5173"),
        "X-Title": os.getenv("OPENROUTER_APP_NAME", "CareerLens AI"),
    }

    try:
        response = httpx.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=request_body,
            timeout=90.0,
        )
        response.raise_for_status()
        payload = response.json()
        content = payload["choices"][0]["message"]["content"]
        if not isinstance(content, str) or not content.strip():
            raise ValueError("The model returned an empty analysis.")
        return ResumeAnalysis.model_validate_json(content)
    except httpx.HTTPStatusError as exc:
        logger.error("OpenRouter returned HTTP %s.", exc.response.status_code)
        raise RuntimeError(
            f"OpenRouter request failed with HTTP {exc.response.status_code}."
        ) from exc
    except (httpx.RequestError, KeyError, IndexError, TypeError, ValueError, ValidationError) as exc:
        logger.exception("Could not obtain a valid analysis response from OpenRouter.")
        raise RuntimeError("The analysis service returned an invalid response.") from exc


def analyze_resume(resume_text: str, job_description: str) -> ResumeAnalysis:
    retrieved_context = _retrieve_knowledge(resume_text, job_description)
    return _request_analysis(resume_text, job_description, retrieved_context)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/analyze-resume", response_model=ResumeAnalysis)
async def analyze_uploaded_resume(
    resume: Annotated[UploadFile, File(description="Resume PDF file")],
    job_description: Annotated[str, Form()],
) -> ResumeAnalysis:
    if not resume.filename or Path(resume.filename).suffix.lower() != ".pdf":
        raise HTTPException(status_code=415, detail="Upload a resume in PDF format.")
    if not job_description.strip():
        raise HTTPException(status_code=422, detail="Job description cannot be empty.")
    if len(job_description) > MAX_JOB_DESCRIPTION_CHARS:
        raise HTTPException(
            status_code=413,
            detail=f"Job description exceeds the {MAX_JOB_DESCRIPTION_CHARS}-character limit.",
        )

    try:
        pdf_bytes = await resume.read(MAX_UPLOAD_BYTES + 1)
        if len(pdf_bytes) > MAX_UPLOAD_BYTES:
            raise HTTPException(
                status_code=413,
                detail=f"PDF exceeds the {MAX_UPLOAD_BYTES // (1024 * 1024)} MB upload limit.",
            )
        with fitz.open(stream=pdf_bytes, filetype="pdf") as pdf:
            if pdf.is_encrypted:
                raise HTTPException(
                    status_code=422,
                    detail="Could not read this PDF because it is password-protected.",
                )
            resume_text = "\n".join(page.get_text("text") for page in pdf).strip()
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Could not read uploaded PDF %r.", resume.filename)
        raise HTTPException(
            status_code=422,
            detail="Could not read the uploaded PDF. Please upload a valid, unencrypted PDF.",
        ) from exc
    finally:
        await resume.close()

    if not resume_text:
        raise HTTPException(
            status_code=422,
            detail="Could not extract readable text from this PDF.",
        )
    if len(resume_text) > MAX_RESUME_CHARS:
        raise HTTPException(
            status_code=413,
            detail=f"Extracted resume exceeds the {MAX_RESUME_CHARS}-character analysis limit.",
        )
    if not os.getenv("OPENROUTER_API_KEY"):
        raise HTTPException(
            status_code=503,
            detail="Analysis is not configured. Set OPENROUTER_API_KEY in a .env file.",
        )

    try:
        return await run_in_threadpool(
            analyze_resume, resume_text, job_description.strip()
        )
    except RuntimeError as exc:
        logger.exception("Resume analysis could not be completed.")
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Unexpected error while analyzing uploaded resume.")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error prevented resume analysis.",
        ) from exc
