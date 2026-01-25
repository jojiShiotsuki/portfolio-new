import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: scrolled ? 0 : 40, // Account for urgency banner
    left: 0,
    right: 0,
    zIndex: 100,
    padding: '20px 48px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    background: scrolled ? 'rgba(10, 10, 10, 0.95)' : 'transparent',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(0, 240, 255, 0.1)' : 'none',
  };

  const logoStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '14px',
    fontWeight: 700,
    color: '#00F0FF',
    letterSpacing: '2px',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const linksContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
  };

  const linkStyle = (isHovered: boolean): React.CSSProperties => ({
    fontFamily: "'Space Mono', monospace",
    fontSize: '11px',
    fontWeight: 400,
    color: isHovered ? '#00F0FF' : '#f5f0e8',
    textDecoration: 'none',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    position: 'relative',
    padding: '8px 0',
    transition: 'color 0.2s ease',
  });

  const ctaStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '11px',
    fontWeight: 700,
    color: '#0a0a0a',
    background: '#00F0FF',
    padding: '14px 28px',
    textDecoration: 'none',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const statusDotStyle: React.CSSProperties = {
    width: '8px',
    height: '8px',
    background: '#00F0FF',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
    boxShadow: '0 0 10px #00F0FF',
  };

  const mobileMenuBtnStyle: React.CSSProperties = {
    display: 'none',
    background: 'transparent',
    border: '1px solid rgba(0, 240, 255, 0.3)',
    padding: '8px',
    cursor: 'pointer',
    color: '#f5f0e8',
  };

  // Navigation items - mix of hash links and route links
  const navItems = [
    { label: 'About', href: isHomePage ? '#about' : '/#about', isRoute: !isHomePage },
    { label: 'Services', href: isHomePage ? '#services' : '/#services', isRoute: !isHomePage },
    { label: 'Projects', href: '/projects', isRoute: true },
    { label: 'Contact', href: isHomePage ? '#contact' : '/#contact', isRoute: !isHomePage },
  ];

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
      <nav style={navStyle}>
        <Link to="/" style={logoStyle}>
          <span style={{ color: '#FF6B4A' }}>[</span>
          JOJI.DEV
          <span style={{ color: '#FF6B4A' }}>]</span>
          <span style={statusDotStyle} />
        </Link>

        <div style={linksContainerStyle} className="desktop-nav">
          {navItems.map((item) => (
            item.isRoute ? (
              <Link
                key={item.label}
                to={item.href}
                style={linkStyle(hoveredLink === item.label)}
                onMouseEnter={() => setHoveredLink(item.label)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                style={linkStyle(hoveredLink === item.label)}
                onMouseEnter={() => setHoveredLink(item.label)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {item.label}
              </a>
            )
          ))}
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            style={ctaStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FF6B4A';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 107, 74, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#00F0FF';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Let's Talk
          </a>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          style={mobileMenuBtnStyle}
          className="mobile-menu-btn"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: 0,
          right: 0,
          background: 'rgba(10, 10, 10, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 240, 255, 0.1)',
          padding: '24px',
          zIndex: 99,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {navItems.map((item) => (
            item.isRoute ? (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setIsOpen(false)}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '14px',
                  color: '#f5f0e8',
                  textDecoration: 'none',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(245, 240, 232, 0.1)',
                }}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '14px',
                  color: '#f5f0e8',
                  textDecoration: 'none',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(245, 240, 232, 0.1)',
                }}
              >
                {item.label}
              </a>
            )
          ))}
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            onClick={() => setIsOpen(false)}
            style={{
              ...ctaStyle,
              textAlign: 'center',
              marginTop: '8px',
            }}
          >
            Let's Talk
          </a>
        </div>
      )}
    </>
  );
};

export default Navbar;
