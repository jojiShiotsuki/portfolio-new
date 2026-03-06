import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';
import { useTheme } from '../ThemeContext';
import { ThemeToggle } from './ui/theme-toggle';
import { InteractiveHoverButton } from './ui/interactive-hover-button';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { mode, theme, toggleTheme } = useTheme();
  const tickingRef = useRef(false);

  useEffect(() => {
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


  const statusDotStyle: React.CSSProperties = {
    width: '8px',
    height: '8px',
    background: theme.accent,
    borderRadius: '50%',
    animation: 'pulse-dot 2s infinite',
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

  const navItems = [
    { label: 'Results', href: isHomePage ? '#results' : '/#results', isRoute: !isHomePage },
    { label: 'Services', href: isHomePage ? '#services' : '/#services', isRoute: !isHomePage },
    { label: 'About', href: isHomePage ? '#about' : '/#about', isRoute: !isHomePage },
  ];

  return (
    <>
      <nav className="main-nav" style={navStyle}>
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
          <ThemeToggle />
          <InteractiveHoverButton
            text="Book a Call"
            variant="primary"
            href="https://calendly.com/jojishiotsuki0/30min"
            style={{ padding: '14px 28px', fontSize: '11px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'none' }} className="mobile-menu-btn">
            <ThemeToggle />
          </div>
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
          <InteractiveHoverButton
            text="Book a Call"
            variant="primary"
            href="https://calendly.com/jojishiotsuki0/30min"
            onClick={() => setIsOpen(false)}
            style={{ padding: '14px 28px', fontSize: '11px', marginTop: '8px', width: '100%' }}
          />
        </div>
      )}
    </>
  );
};

export default Navbar;
