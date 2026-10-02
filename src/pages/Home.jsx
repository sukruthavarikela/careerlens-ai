import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, FileText, ScanSearch, Sparkles, Target } from 'lucide-react'
import { Link } from 'react-router-dom'

const steps = [
  { number: '01', title: 'Bring your resume', text: 'Start with the experience and skills you have already put on paper.', icon: FileText },
  { number: '02', title: 'Choose a role', text: 'Add a job description to see what that employer is asking for.', icon: Target },
  { number: '03', title: 'Make a plan', text: 'Review potential matches, gaps, and practical ways to grow.', icon: ScanSearch },
]

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> A more thoughtful job search</div>
          <h1>See your next move <span>clearly.</span></h1>
          <p className="hero-lede">Understand how your experience connects to a role, what might be missing, and where to focus next.</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/resume-analyzer">Explore the analyzer <ArrowUpRight size={17} /></Link>
            <a className="text-link" href="#how-it-works">See how it works <ArrowDownRight size={16} /></a>
          </div>
          <div className="hero-note"><Sparkles size={15} /><span>Explore an interactive frontend demo with sample results.</span></div>
        </div>
        <div className="hero-visual">
          <img className="hero-photo" src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1100&q=85" alt="Colleagues discussing their work around a table" />
          <div className="photo-caption"><span className="caption-dot" /> YOUR CAREER, IN CONTEXT</div>
          <div className="floating-note">
            <span className="floating-icon"><ScanSearch size={18} /></span>
            <div><strong>Start with what’s real</strong><small>Your experience. Their requirements.</small></div>
            <ArrowUpRight size={17} className="floating-arrow" />
          </div>
          <div className="hero-visual-index">A clearer path forward <span>01 / 03</span></div>
        </div>
        <div className="hero-side-label">A CAREER TOOL FOR THE IN-BETWEEN</div>
      </section>

      <section className="trust-strip" aria-label="Product principles">
        <span className="strip-label">MADE TO HELP YOU</span>
        <div><Check size={15} /> Understand role requirements</div>
        <div><Check size={15} /> Spot possible skill gaps</div>
        <div><Check size={15} /> Decide your own next step</div>
      </section>

      <section className="how-section section-pad" id="how-it-works">
        <div className="section-heading">
          <div><div className="eyebrow">A simple place to start</div><h2>From “maybe” to a clearer plan.</h2></div>
          <p>Good career decisions start with useful context. CareerLens brings your resume and a role description into one focused view.</p>
        </div>
        <div className="steps-grid">
          {steps.map(({ number, title, text, icon: Icon }) => (
            <article className="step-item" key={number}>
              <div className="step-top"><span>{number}</span><Icon size={21} strokeWidth={1.7} /></div>
              <h3>{title}</h3><p>{text}</p>
              <div className="step-rule" />
            </article>
          ))}
        </div>
      </section>

      <section className="home-callout">
        <div className="callout-mark"><ScanSearch size={24} /></div>
        <div><p className="eyebrow">YOUR NEXT STEP, AT YOUR PACE</p><h2>Start with one role you’re curious about.</h2>        <p className="callout-copy">Preview the report experience using predefined sample analysis data.</p></div>
        <Link className="button button-light" to="/resume-analyzer">Try the demo <ArrowRight size={17} /></Link>
      </section>
      <p className="home-disclaimer">Frontend-only demo · Your selected PDF stays in your browser and is not read or uploaded. Analysis results are predefined examples.</p>
    </>
  )
}