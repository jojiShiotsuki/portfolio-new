import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Results from './components/Results';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import WhoIWorkWith from './components/WhoIWorkWith';
import ProjectsPreview from './components/ProjectsPreview';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectsPage from './components/ProjectsPage';
import UrgencyBanner from './components/UrgencyBanner';
import StickyCTA from './components/StickyCTA';
import ChatBot from './components/ChatBot';

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
    <Results />
    <Services />
    <HowItWorks />
    <WhoIWorkWith />
    <ProjectsPreview />
    <About />
    <Contact />
  </>
);

function App() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <BrowserRouter>
      <div style={styles.app}>
        <div style={styles.gridOverlay} />
        <div style={styles.content}>
          <UrgencyBanner />
          <div style={{ height: scrolled ? '0px' : '40px', transition: 'height 0.3s ease' }} />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
            </Routes>
          </main>
          <Footer />
          <StickyCTA />
          <ChatBot />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
