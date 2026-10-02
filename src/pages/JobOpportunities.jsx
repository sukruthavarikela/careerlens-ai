import { ArrowUpRight, BriefcaseBusiness, CircleHelp, MapPin } from 'lucide-react'

const examples = [
  { priority: 'Explore', title: 'Operations Coordinator', setting: 'Operations · Early career', reason: 'A role family that often values organization and clear communication.' },
  { priority: 'Explore', title: 'Customer Insights Associate', setting: 'Research · Associate', reason: 'A role family that may combine customer understanding with structured analysis.' },
  { priority: 'Explore', title: 'Project Support Specialist', setting: 'Project delivery · Entry to mid-level', reason: 'A role family where planning and cross-team follow-through can matter.' },
]

export default function JobOpportunities() {
  return (
    <section className="page-wrap">
      <div className="page-intro"><div className="eyebrow">04 / Job opportunities</div><h1>Explore possible directions.</h1><p>Use these generic role examples to imagine what could be explored next. They are not personalized recommendations.</p><span className="example-badge"><CircleHelp size={14} /> ILLUSTRATIVE EXAMPLES</span></div>
      <div className="example-banner"><strong>Not a job feed or a match result.</strong><span>These role ideas were not matched to your resume. No job availability, fit, or hiring outcome is implied.</span></div>
      <div className="opportunity-list">
        {examples.map((role, index) => (
          <article className="opportunity-row" key={role.title}>
            <span className="opportunity-number">0{index + 1}</span>
            <div className="opportunity-main"><span className="priority-label"><span />{role.priority}</span><h2>{role.title}</h2><div className="role-meta"><span><BriefcaseBusiness size={14} />{role.setting}</span><span><MapPin size={14} />Location varies</span></div></div>
            <div className="opportunity-reason"><span className="eyebrow">WHY EXPLORE IT?</span><p>{role.reason}</p></div>
            <button className="icon-button" type="button" title="Example role only" aria-label={`${role.title}, example role`}><ArrowUpRight size={18} /></button>
          </article>
        ))}
      </div>
      <div className="page-footnote"><CircleHelp size={16} /><p>To make this section useful, a future version would need to explain the evidence behind each role suggestion and let you adjust your interests.</p></div>
    </section>
  )
}