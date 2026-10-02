# CareerLens Resume Analyzer API

This FastAPI backend runs separately from the existing React/Vite frontend.
It accepts a PDF and job description, extracts the PDF's text, retrieves
relevant resume/job guidance from a persistent Chroma vector database, and
requests a grounded JSON analysis from OpenRouter.

## Setup (Windows PowerShell)

Use Python 3.10 or newer.

From the project root:

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `backend/.env` and replace `your_openrouter_api_key` with your OpenRouter
API key. Keep `.env` private; it is excluded by this folder's `.gitignore`.
The backend also reads a project-root `.env` if one already exists.

Run the API from inside `backend`:

```powershell
uvicorn main:app --reload
```

The API is available at `http://localhost:8000`; interactive documentation is
at `http://localhost:8000/docs`. Run the existing frontend separately from the
project root with `npm run dev`. The default CORS allowlist includes Vite's
`localhost:5173` and `127.0.0.1:5173` origins.

## Analyze a resume

Send a `multipart/form-data` POST request to `/analyze-resume` with:

- `resume`: a PDF file
- `job_description`: the job description as text

Example using curl:

```powershell
curl.exe -X POST http://localhost:8000/analyze-resume `
  -F "resume=@C:\path\to\resume.pdf" `
  -F "job_description=Paste the job description here"
```

The JSON response contains `ats_match_score`, `matching_skills`,
`missing_skills`, `skill_gaps`, `resume_improvement_suggestions`, and
`relevant_job_roles`. Invalid, unreadable, encrypted, or text-free PDFs return
an explicit HTTP error instead of an analysis. The API does not store uploaded
resume files; Chroma persists only the bundled knowledge documents and their
embeddings under `backend/chroma_db`.

The React application is unchanged. A frontend request can use `fetch` with a
`FormData` body containing the `resume` file and `job_description`; do not set
the multipart `Content-Type` header manually, so the browser can add its
boundary.
