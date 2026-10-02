import { useRef, useState } from 'react'
import { ArrowRight, Check, FileText, LockKeyhole, UploadCloud } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ResumeAnalyzer() {
  const inputRef = useRef(null)
  const [fileName, setFileName] = useState('')
  const [message, setMessage] = useState('')

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    setFileName(file?.name ?? '')
    setMessage(file ? 'File selected for the interface preview. It has not been uploaded or read.' : '')
  }

  return (
    <section className="page-wrap">
      <div className="page-intro"><div className="eyebrow">01 / Resume</div><h1>Start with your experience.</h1><p>Select a resume to see how the upload step will work. This preview does not send or read your file.</p></div>
      <div className="analyzer-grid">
        <div className="form-panel">
          <div className="panel-heading"><span className="panel-step">01</span><div><h2>Add your resume</h2><p>Choose a document from your device.</p></div></div>
          <button className={`upload-zone ${fileName ? 'has-file' : ''}`} type="button" onClick={() => inputRef.current?.click()}>
            <span className="upload-icon">{fileName ? <FileText size={23} /> : <UploadCloud size={24} />}</span>
            <strong>{fileName || 'Choose a file to preview'}</strong>
            <span>{fileName ? 'Choose a different file' : 'PDF or DOCX · File stays on this screen only'}</span>
          </button>
          <input ref={inputRef} className="visually-hidden" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} aria-label="Choose a resume file" />
          {message && <p className="inline-message"><Check size={15} />{message}</p>}
          <div className="privacy-line"><LockKeyhole size={15} /><span>Privacy note: no file is sent anywhere in this frontend preview.</span></div>
          <div className="form-divider" />
          <div className="panel-heading second-step"><span className="panel-step muted">02</span><div><h2>Continue with a role</h2><p>Add the job description you want to explore.</p></div></div>
          <Link className="button button-primary full-button" to="/job-description-analyzer">Go to job description <ArrowRight size={17} /></Link>
        </div>
        <aside className="side-note"><span className="side-note-number">A</span><p className="eyebrow">WHAT HAPPENS NEXT</p><h3>Your document is yours.</h3><p>The finished product can compare resume details with a job description. For now, this page only shows the upload interface: it does not extract resume information or create recommendations.</p><div className="side-note-bottom"><FileText size={17} /><span>Nothing is uploaded or analyzed in this preview.</span></div></aside>
      </div>
    </section>
  )
}