import { useRef, useState } from 'react'
import { ArrowRight, Check, FileText, LockKeyhole, UploadCloud } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function ResumeAnalyzer() {
  const inputRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState(location.state?.resumeFile ?? null)
  const [error, setError] = useState('')

  function handleFileChange(event) {
    const file = event.target.files?.[0] ?? null
    setError('')

    if (file && !file.name.toLowerCase().endsWith('.pdf')) {
      setSelectedFile(null)
      setError('Please select a resume in PDF format.')
      event.target.value = ''
      return
    }

    setSelectedFile(file)
  }

  function handleContinue() {
    if (!selectedFile) {
      setError('Please select a resume PDF before continuing.')
      return
    }

    navigate('/job-description-analyzer', {
      state: { resumeFile: selectedFile },
    })
  }

  return (
    <section className="page-wrap">
      <div className="page-intro"><div className="eyebrow">01 / Resume</div><h1>Start with your experience.</h1><p>Select a PDF to preview the resume-analysis demo.</p></div>
      <div className="analyzer-grid">
        <div className="form-panel">
          <div className="panel-heading"><span className="panel-step">01</span><div><h2>Add your resume</h2><p>Choose a PDF document from your device.</p></div></div>
          <button className={`upload-zone ${selectedFile ? 'has-file' : ''}`} type="button" onClick={() => inputRef.current?.click()}>
            <span className="upload-icon">{selectedFile ? <FileText size={23} /> : <UploadCloud size={24} />}</span>
            <strong>{selectedFile?.name || 'Choose a PDF resume'}</strong>
            <span>{selectedFile ? 'Choose a different PDF' : 'PDF · The file stays in your browser'}</span>
          </button>
          <input ref={inputRef} className="visually-hidden" type="file" accept="application/pdf,.pdf" onChange={handleFileChange} aria-label="Choose a resume PDF" />
          {selectedFile && <p className="inline-message"><Check size={15} />Resume selected: {selectedFile.name}</p>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="privacy-line"><LockKeyhole size={15} /><span>Frontend-only demo: your PDF is not uploaded or read.</span></div>
          <div className="form-divider" />
          <div className="panel-heading second-step"><span className="panel-step muted">02</span><div><h2>Add a job description</h2><p>Continue to enter the role you want to explore.</p></div></div>
          <button className="button button-primary full-button" type="button" onClick={handleContinue}>Continue to job description <ArrowRight size={17} /></button>
        </div>
        <aside className="side-note"><span className="side-note-number">A</span><p className="eyebrow">FRONTEND-ONLY DEMO</p><h3>Preview the analysis flow.</h3><p>Choose a PDF and enter a role description to explore the interface. Demo results are predefined and are not extracted from your file.</p><div className="side-note-bottom"><FileText size={17} /><span>Only the filename is used in this demo.</span></div></aside>
      </div>
    </section>
  )
}
