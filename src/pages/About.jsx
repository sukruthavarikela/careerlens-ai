import { ArrowRight, CircleHelp, Eye, FileCheck2, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

const principles = [
  { icon: FileCheck2, title: 'Use what you provide', text: 'A real assessment should use evidence from your resume and the specific job description, not make up experience or skills.' },
  { icon: Eye, title: 'Explain the reasoning', text: 'Recommendations should say which requirement they relate to and why a change could help.' },
  { icon: ShieldCheck, title: 'Keep expectations honest', text: 'A resume tool can help you prepare. It cannot guarantee an interview, an offer, or a particular outcome.' },
]

export default function About() {
  return (
    <section className="page-wrap about-page">
      <div className="page-intro"><div className="eyebrow">About CareerLens AI</div><h1>Useful perspective, without the promises.</h1><p>Career decisions are personal. CareerLens is designed to help organize the details so you can decide what to do with them.</p></div>
      <div className="about-feature"><div className="about-feature-mark"><CircleHelp size={22} /></div><div><span className="eyebrow">THE IDEA</span><h2>Make the comparison easier to understand.</h2><p>Bring together a resume and a job description. See the requirements, possible areas of overlap, and questions worth investigating, with a reason behind each suggestion.</p></div></div>
      <div className="principles-heading"><span className="eyebrow">HOW IT SHOULD WORK</span><h2>Three principles for a more useful review.</h2></div>
      <div className="principles-grid">{principles.map(({ icon: Icon, title, text }) => <article className="principle-item" key={title}><Icon size={21} /><h3>{title}</h3><p>{text}</p></article>)}</div>
      <div className="preview-notice"><strong>Frontend-only demo</strong><p>The selected PDF is not uploaded or read. The analysis dashboard displays predefined sample data and does not generate personalized advice.</p><Link className="text-link" to="/resume-analyzer">Explore the demo <ArrowRight size={16} /></Link></div>
    </section>
  )
}