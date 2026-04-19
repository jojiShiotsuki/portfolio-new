import React, { Suspense } from 'react';
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
import UrgencyBanner from './components/UrgencyBanner';
import StickyCTA from './components/StickyCTA';
import PixelAssistant from './components/PixelAssistant';
import { useTheme } from './ThemeContext';

// Lazy-loaded route components for code splitting
const ProjectsPage = React.lazy(() => import('./components/ProjectsPage'));
const AssistantPage = React.lazy(() => import('./components/AssistantPage'));
const HomeV2 = React.lazy(() => import('./components/HomeV2'));
const HomeV3 = React.lazy(() => import('./components/HomeV3'));
const HomeV4 = React.lazy(() => import('./components/HomeV4'));

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
  const { theme } = useTheme();
  const tickingRef = React.useRef(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        linear-gradient(${theme.gridOverlayColor} 1px, transparent 1px),
        linear-gradient(90deg, ${theme.gridOverlayColor} 1px, transparent 1px)
      `,
      backgroundSize: '100px 100px',
      pointerEvents: 'none' as const,
      zIndex: 0,
    },
    content: {
      position: 'relative',
      zIndex: 1,
    },
  };

  return (
    <BrowserRouter>
      <div style={styles.app}>
        <div style={styles.gridOverlay} />
        <div style={styles.content}>
          <UrgencyBanner />
          <div style={{ height: scrolled ? '0px' : '40px', transition: 'height 0.3s ease' }} />
          <Navbar />
          <main>
            <Suspense fallback={<div />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home-2" element={<HomeV2 />} />
                <Route path="/home-3" element={<HomeV3 />} />
                <Route path="/home-4" element={<HomeV4 />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/talk" element={<AssistantPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <StickyCTA />
          <PixelAssistant />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
