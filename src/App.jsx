import { Route, Routes } from 'react-router-dom'
import SiteLayout from './components/SiteLayout.jsx'
import About from './pages/About.jsx'
import AnalysisDashboard from './pages/AnalysisDashboard.jsx'
import CareerGap from './pages/CareerGap.jsx'
import Home from './pages/Home.jsx'
import JobDescriptionAnalyzer from './pages/JobDescriptionAnalyzer.jsx'
import JobOpportunities from './pages/JobOpportunities.jsx'
import ResumeAnalyzer from './pages/ResumeAnalyzer.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
        <Route path="job-description-analyzer" element={<JobDescriptionAnalyzer />} />
        <Route path="dashboard" element={<AnalysisDashboard />} />
        <Route path="opportunities" element={<JobOpportunities />} />
        <Route path="career-gap" element={<CareerGap />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}