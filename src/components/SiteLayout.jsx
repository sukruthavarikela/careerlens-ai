import { useState } from 'react'
import { ArrowUpRight, Compass, Menu, X } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/resume-analyzer', label: 'Resume analyzer' },
  { to: '/job-description-analyzer', label: 'Job description' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/opportunities', label: 'Opportunities' },
  { to: '/career-gap', label: 'Career gap' },
  { to: '/about', label: 'About' },
]

export default function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" onClick={() => setMenuOpen(false)} aria-label="CareerLens AI home">
            <span className="brand-mark"><Compass size={20} strokeWidth={2.3} /></span>
            <span>CareerLens<span className="brand-light"> AI</span></span>
          </Link>
          <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {link.label}
              </NavLink>
            ))}
            <Link className="nav-cta mobile-cta" to="/resume-analyzer" onClick={() => setMenuOpen(false)}>Get started <ArrowUpRight size={15} /></Link>
          </nav>
          <Link className="nav-cta desktop-cta" to="/resume-analyzer">Get started <ArrowUpRight size={15} /></Link>
          <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="site-footer">
        <div className="footer-inner">
          <Link className="brand footer-brand" to="/"><span className="brand-mark"><Compass size={18} /></span><span>CareerLens<span className="brand-light"> AI</span></span></Link>
          <p>A clearer view of your next career move.</p>
          <div className="footer-links"><Link to="/about">About</Link><Link to="/resume-analyzer">Resume analyzer</Link><span>Frontend-only demo · Sample results</span></div>
        </div>
      </footer>
    </div>
  )
}