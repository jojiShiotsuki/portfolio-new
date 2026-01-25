import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import ProjectsPreview from './components/ProjectsPreview';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectsPage from './components/ProjectsPage';
import UrgencyBanner from './components/UrgencyBanner';
import StickyCTA from './components/StickyCTA';

const styles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: '100vh',
    position: 'relative',
  },
  gridOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: '100px 100px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
};

// Home page component
const HomePage: React.FC = () => (
  <>
    <Hero />
    <Services />
    <ProjectsPreview />
    <About />
    <Contact />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <div style={styles.app}>
        <div style={styles.gridOverlay} />
        <div style={styles.content}>
          <UrgencyBanner />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
            </Routes>
          </main>
          <Footer />
          <StickyCTA />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
