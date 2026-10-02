import { ArrowRight, Check, CircleHelp, FileText, Lightbulb, Target } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

function ResultList({ items, emptyMessage }) {
  if (!items?.length) {
    return <div className="empty-evidence"><CircleHelp size={17} /><span>{emptyMessage}</span></div>
  }

  return (
    <div className="tag-list">
      {items.map((item, index) => <span className="skill-tag" key={`${item}-${index}`}>{item}</span>)}
    </div>
  )
}

export default function AnalysisDashboard() {
  const { state } = useLocation()
  const analysis = state?.analysis

  if (!analysis) {
    return (
      <section className="page-wrap dashboard-page">
        <div className="page-intro dashboard-intro"><div className="eyebrow">03 / Analysis dashboard</div><h1>Explore the sample dashboard.</h1><p>Choose a PDF and add a job description to view the static analysis demo.</p></div>
        <div className="example-banner"><strong>Frontend-only demo</strong><span>Results are predefined examples and are not generated from an uploaded resume.</span></div>
        <div className="next-step-band"><div><span className="eyebrow">READY TO BEGIN?</span><h2>Preview the analyzer.</h2></div><Link className="text-link" to="/resume-analyzer">Start demo <ArrowRight size={16} /></Link></div>
      </section>
    )
  }

  const matchingSkills = analysis.matching_skills ?? []
  const missingSkills = analysis.missing_skills ?? []
  const skillGaps = analysis.skill_gaps ?? []
  const suggestions = analysis.resume_improvement_suggestions ?? []
  const jobRoles = analysis.relevant_job_roles ?? []

  return (
    <section className="page-wrap dashboard-page">
      <div className="page-intro dashboard-intro">
        <div className="eyebrow">03 / Analysis dashboard</div>
        <h1>Your resume analysis demo.</h1>
        <p>Explore the report layout and example recommendations.</p>
        <span className="example-badge"><CircleHelp size={14} /> STATIC DEMO RESULTS</span>
      </div>
      <div className="example-banner"><strong>Illustrative sample data</strong><span>These predefined results are not extracted from or personalized to your PDF or job description.</span></div>
      {state.resumeName && <div className="selected-resume"><FileText size={16} /><span>Selected file: {state.resumeName} · not read in this demo</span></div>}
      <div className="dashboard-metrics">
        <article className="metric-tile"><span className="metric-icon green"><Target size={18} /></span><span className="metric-label">ATS match score</span><strong>{analysis.ats_match_score}%</strong><small>Illustrative demo score</small></article>
        <article className="metric-tile"><span className="metric-icon coral"><Check size={18} /></span><span className="metric-label">Matching skills</span><strong>{matchingSkills.length}</strong><small>Example skills in common</small></article>
        <article className="metric-tile"><span className="metric-icon yellow"><Lightbulb size={18} /></span><span className="metric-label">Missing skills</span><strong>{missingSkills.length}</strong><small>Example areas to explore</small></article>
      </div>
      <div className="dashboard-columns">
        <section className="report-panel"><div className="report-heading"><div><span className="eyebrow">SKILLS</span><h2>Matching skills</h2></div><span className="report-icon"><Check size={17} /></span></div><p className="report-explainer">Example skills shown to demonstrate the report.</p><ResultList items={matchingSkills} emptyMessage="No sample skills available." /></section>
        <section className="report-panel"><div className="report-heading"><div><span className="eyebrow">REQUIREMENTS</span><h2>Missing skills</h2></div><span className="report-icon coral-icon"><Lightbulb size={17} /></span></div><p className="report-explainer">Example requirements shown to demonstrate the report.</p><ResultList items={missingSkills} emptyMessage="No sample gaps available." /></section>
        <section className="report-panel report-panel-wide"><div className="report-heading"><div><span className="eyebrow">GROWTH AREAS</span><h2>Skill gaps</h2></div><span className="report-icon coral-icon"><Target size={17} /></span></div><ResultList items={skillGaps} emptyMessage="No sample skill gaps available." /></section>
        <section className="report-panel report-panel-wide"><div className="report-heading"><div><span className="eyebrow">NEXT STEPS</span><h2>Resume improvement suggestions</h2></div><span className="report-icon"><FileText size={17} /></span></div><ResultList items={suggestions} emptyMessage="No sample suggestions available." /></section>
        <section className="report-panel report-panel-wide"><div className="report-heading"><div><span className="eyebrow">CAREER DIRECTIONS</span><h2>Recommended job roles</h2></div><span className="report-icon"><ArrowRight size={17} /></span></div><ResultList items={jobRoles} emptyMessage="No sample roles available." /></section>
      </div>
      <div className="next-step-band"><div><span className="eyebrow">TRY THE DEMO AGAIN</span><h2>Explore another sample report.</h2></div><Link className="text-link" to="/resume-analyzer">Start over <ArrowRight size={16} /></Link></div>
    </section>
  )
}
