import { useState } from 'react'
import { ArrowLeft, ArrowRight, BriefcaseBusiness, ClipboardPaste, FileText, Info, LoaderCircle } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const DEMO_ANALYSIS = {
  ats_match_score: 82,
  matching_skills: ['Python', 'SQL', 'Data analysis', 'Communication'],
  missing_skills: ['Cloud platform experience', 'Production ML deployment'],
  skill_gaps: [
    'The sample profile shows analytical project work but limited evidence of production-scale deployment.',
    'Cloud platform experience is not demonstrated in the sample profile.',
  ],
  resume_improvement_suggestions: [
    'Add measurable outcomes to project descriptions where you can substantiate them.',
    'Describe the tools and methods used to deliver each relevant project.',
    'Tailor the opening summary to the role requirements.',
  ],
  relevant_job_roles: ['Data Analyst', 'Junior Data Scientist', 'Business Intelligence Analyst'],
}

const DEMO_DELAY_MS = 1100

export default function JobDescriptionAnalyzer() {
  const location = useLocation()
  const navigate = useNavigate()
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const resumeFile = location.state?.resumeFile
  const canAnalyze = Boolean(resumeFile && description.trim())

  async function handleAnalyze(event) {
    event.preventDefault()
    setError('')

    if (!resumeFile) {
      setError('Please upload a PDF resume before analyzing.')
      return
    }
    if (!description.trim()) {
      setError('Please enter a job description before analyzing.')
      return
    }

    setLoading(true)
    await new Promise((resolve) => window.setTimeout(resolve, DEMO_DELAY_MS))
    navigate('/dashboard', {
      state: {
        analysis: DEMO_ANALYSIS,
        resumeName: resumeFile.name,
        jobDescription: description.trim(),
        isDemo: true,
      },
    })
  }

  return (
    <section className="page-wrap">
      <div className="page-intro"><div className="eyebrow">02 / Job description</div><h1>Choose the role in view.</h1><p>Enter a job description to explore a sample resume analysis.</p></div>
      <form className="analyzer-grid" onSubmit={handleAnalyze}>
        <div className="form-panel">
          <div className="panel-heading"><span className="panel-step"><BriefcaseBusiness size={17} /></span><div><h2>Job description</h2><p>Add responsibilities and qualifications for the role.</p></div></div>
          {resumeFile ? (
            <div className="selected-resume"><FileText size={16} /><span>{resumeFile.name}</span></div>
          ) : (
            <div className="upload-required" role="status">
              <span>No PDF selected yet.</span>
              <Link to="/resume-analyzer">Upload a resume <ArrowRight size={14} /></Link>
            </div>
          )}
          <label className="field-label" htmlFor="job-description">Paste the full description</label>
          <textarea id="job-description" className="description-input" value={description} onChange={(event) => setDescription(event.target.value)} placeholder={'Paste a job description here…\n\nInclude the role title, responsibilities, and required qualifications.'} disabled={loading} />
          <div className="textarea-meta"><span><ClipboardPaste size={14} /> Demo only · Text stays in your browser</span><span>{description.length} characters</span></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary full-button" type="submit" disabled={!canAnalyze || loading}>
            {loading ? <><LoaderCircle className="loading-spinner" size={17} /> Preparing demo…</> : <>Analyze Resume <ArrowRight size={17} /></>}
          </button>
          {loading && <p className="inline-message" role="status">Preparing your sample dashboard…</p>}
          <div className="form-divider" />
          <Link className="text-link" to="/resume-analyzer" state={{ resumeFile }}><ArrowLeft size={16} /> Change resume</Link>
        </div>
        <aside className="side-note"><span className="side-note-number">B</span><p className="eyebrow">FRONTEND-ONLY DEMO</p><h3>Explore the analysis experience.</h3><p>This demo does not upload or read your PDF. The dashboard uses predefined sample analysis data and does not change based on the selected file or description.</p><div className="side-note-bottom"><Info size={17} /><span>Your resume stays on this page and is not sent anywhere.</span></div></aside>
      </form>
    </section>
  )
}
