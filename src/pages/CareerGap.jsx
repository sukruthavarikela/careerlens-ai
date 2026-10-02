import { ArrowRight, BookOpen, CircleHelp, Code2, Compass, FolderKanban } from 'lucide-react'
import { Link } from 'react-router-dom'

const suggestions = [
  { icon: BookOpen, kind: 'LEARN', title: 'Build a foundation', text: 'Choose a short course only after checking that a target role actually asks for this skill.', detail: 'Example: introductory data analysis' },
  { icon: Code2, kind: 'PRACTICE', title: 'Try a small project', text: 'A practical project can help you practice and give you something concrete to discuss.', detail: 'Example: summarize a public dataset' },
  { icon: FolderKanban, kind: 'SHOW', title: 'Make the evidence visible', text: 'Describe what you did, the tools you used, and the result, when those details are true.', detail: 'Example: add a project to your portfolio' },
]

export default function CareerGap() {
  return (
    <section className="page-wrap">
      <div className="page-intro"><div className="eyebrow">05 / Career gap</div><h1>Turn a gap into a next step.</h1><p>A useful growth plan starts with a real requirement, not a guess about what you lack.</p><span className="example-badge"><CircleHelp size={14} /> GENERAL EXAMPLES</span></div>
      <div className="gap-intro-band"><span className="gap-compass"><Compass size={23} /></span><div><span className="eyebrow">NO PERSONAL GAP HAS BEEN IDENTIFIED</span><h2>Start by checking what the role actually needs.</h2><p>The ideas below are general examples. They are not based on your resume or a job description.</p></div></div>
      <div className="suggestion-grid">
        {suggestions.map(({ icon: Icon, kind, title, text, detail }) => <article className="suggestion-item" key={kind}><div className="suggestion-icon"><Icon size={20} /></div><span className="eyebrow">{kind}</span><h3>{title}</h3><p>{text}</p><div className="suggestion-example">{detail}</div></article>)}
      </div>
      <div className="next-step-band"><div><span className="eyebrow">MAKE IT SPECIFIC</span><h2>Start with a job description.</h2></div><Link className="text-link" to="/job-description-analyzer">Add a role to explore <ArrowRight size={16} /></Link></div>
    </section>
  )
}