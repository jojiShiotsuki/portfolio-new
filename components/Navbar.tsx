import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';
import { useTheme } from '../ThemeContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { mode, theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: scrolled ? 0 : 40,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: '20px 48px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    background: scrolled ? theme.bgOverlay : 'transparent',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    borderBottom: scrolled ? `1px solid ${theme.accentBorder}` : 'none',
  };

  const logoStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '14px',
    fontWeight: 700,
    color: theme.accent,
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
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    fontWeight: 400,
    color: isHovered ? theme.accent : theme.textPrimary,
    textDecoration: 'none',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    position: 'relative',
    padding: '8px 0',
    transition: 'color 0.2s ease',
  });

  const ctaStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    fontWeight: 700,
    color: theme.btnPrimaryText,
    background: theme.accent,
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
    background: theme.accent,
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
    boxShadow: `0 0 10px ${theme.accent}`,
  };

  const mobileMenuBtnStyle: React.CSSProperties = {
    display: 'none',
    background: 'transparent',
    border: `1px solid ${theme.accentBorder}`,
    padding: '8px',
    cursor: 'pointer',
    color: theme.textPrimary,
  };

  const toggleBtnStyle: React.CSSProperties = {
    background: 'transparent',
    border: `1px solid ${theme.borderPrimary}`,
    padding: '8px',
    cursor: 'pointer',
    color: theme.textPrimary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  };

  const navItems = [
    { label: 'Results', href: isHomePage ? '#results' : '/#results', isRoute: !isHomePage },
    { label: 'Services', href: isHomePage ? '#services' : '/#services', isRoute: !isHomePage },
    { label: 'About', href: isHomePage ? '#about' : '/#about', isRoute: !isHomePage },
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
          <span style={{ color: theme.accentLight }}>[</span>
          JOJI.DEV
          <span style={{ color: theme.accentLight }}>]</span>
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
          <button
            onClick={toggleTheme}
            style={toggleBtnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.accent;
              e.currentTarget.style.color = theme.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.borderPrimary;
              e.currentTarget.style.color = theme.textPrimary;
            }}
            aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
          >
            {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a
            href={isHomePage ? '#contact' : '/#contact'}
            style={ctaStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.accentLight;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 4px 20px ${theme.accentGlow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = theme.accent;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Free Audit
          </a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={toggleTheme}
            style={{ ...toggleBtnStyle, display: 'none' }}
            className="mobile-menu-btn"
            aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
          >
            {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={mobileMenuBtnStyle}
            className="mobile-menu-btn"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: 0,
          right: 0,
          background: theme.bgMobileMenu,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${theme.accentBorder}`,
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
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '14px',
                  color: theme.textPrimary,
                  textDecoration: 'none',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  padding: '12px 0',
                  borderBottom: `1px solid ${theme.borderPrimary}`,
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
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '14px',
                  color: theme.textPrimary,
                  textDecoration: 'none',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  padding: '12px 0',
                  borderBottom: `1px solid ${theme.borderPrimary}`,
                }}
              >
                {item.label}
              </a>
            )
          ))}
          <a
            href={isHomePage ? '#contact' : '/#contact'}
            onClick={() => setIsOpen(false)}
            style={{
              ...ctaStyle,
              textAlign: 'center',
              marginTop: '8px',
            }}
          >
            Free Audit
          </a>
        </div>
      )}
    </>
  );
};

export default Navbar;
