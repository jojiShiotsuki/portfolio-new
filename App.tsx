import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UrgencyBanner from './components/UrgencyBanner';
import StickyCTA from './components/StickyCTA';
import PixelAssistant from './components/PixelAssistant';
import MonoHome from './components/mono/MonoHome';
import { useTheme } from './ThemeContext';

// Lazy-loaded route components for code splitting
const CaseStudies = React.lazy(() => import('./components/mono/CaseStudies'));
const AssistantPage = React.lazy(() => import('./components/AssistantPage'));
const FreelancePage = React.lazy(() => import('./components/FreelancePage'));

// The Mono Index design. These pages bring their own masthead, footer and background,
// so none of the older chrome (nav, banner, sticky CTA, grid overlay) renders on them.
const MONO_ROUTES = ['/', '/projects'];

// Reset scroll on route change. React Router preserves scroll across navigations
// by default, which makes "All work and case studies" land you mid-page. A link that
// carries a hash (/#about from the work page) has to scroll to that section instead.
const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();
  React.useEffect(() => {
    if (hash) {
      // The target is rendered in the same commit, but layout may not have settled;
      // one frame is enough and avoids landing on a half-measured page.
      requestAnimationFrame(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'auto', block: 'start' });
          return;
        }
        window.scrollTo(0, 0);
      });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

// The archived freelance page still carries the older sales copy and is deliberately
// kept off the main nav. robots.txt asks crawlers not to fetch it, but a Disallow does
// not stop indexing if something links in, so set noindex on the page itself too.
const NOINDEX_ROUTES = ['/freelance'];

const RouteMeta: React.FC = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    const shouldHide = NOINDEX_ROUTES.includes(pathname);
    let tag = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (shouldHide) {
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = 'robots';
        document.head.appendChild(tag);
      }
      tag.content = 'noindex, nofollow';
    } else if (tag) {
      tag.remove();
    }
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = `https://jojishiotsuki.com${pathname === '/' ? '/' : pathname}`;
  }, [pathname]);
  return null;
};

// Everything the older pages need and the Mono Index pages must not get.
const LegacyChrome: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const gridOverlay: React.CSSProperties = {
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
    pointerEvents: 'none',
    zIndex: 0,
  };

  return (
    // `legacy` is what the older ID-based rules in app.css hang off, so they cannot
    // reach the Mono Index pages, which reuse #about and #contact as public anchors.
    <div className="legacy" style={{ minHeight: '100vh', position: 'relative' }}>
      <div style={gridOverlay} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <a href="#main" className="skip-link">Skip to content</a>
        <UrgencyBanner />
        <div style={{ height: scrolled ? '0px' : '40px', transition: 'height 0.3s ease' }} />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <StickyCTA />
      </div>
    </div>
  );
};

// A Mono Index page renders its own shell, so it needs no wrapper at all.
const Shell: React.FC = () => {
  const { pathname } = useLocation();
  const isMono = MONO_ROUTES.includes(pathname);

  const routes = (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<MonoHome />} />
        <Route path="/projects" element={<CaseStudies />} />
        <Route path="/freelance" element={<FreelancePage />} />
        <Route path="/talk" element={<AssistantPage />} />
      </Routes>
    </Suspense>
  );

  return (
    <>
      {isMono ? routes : <LegacyChrome>{routes}</LegacyChrome>}
      <PixelAssistant />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <RouteMeta />
      <Shell />
    </BrowserRouter>
  );
}

export default App;
