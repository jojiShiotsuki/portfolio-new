import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Check } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';
import { useTheme } from '../ThemeContext';
import { ThemeToggle } from './ui/theme-toggle';
import { InteractiveHoverButton } from './ui/interactive-hover-button';

const HOME_VARIANTS = [
  { label: 'Default', sub: 'Brutalist editorial', path: '/' },
  { label: 'Editorial', sub: 'Bento magazine spread', path: '/home-2' },
  { label: 'Pixel', sub: '8-bit RPG village', path: '/home-3' },
  { label: 'Glass', sub: 'Liquid glass / VisionOS', path: '/home-4' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [homeMenuOpen, setHomeMenuOpen] = useState(false);
  const homeMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const homeMenuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isAnyHome = HOME_VARIANTS.some((v) => v.path === location.pathname);
  const { mode, theme, toggleTheme } = useTheme();
  const tickingRef = useRef(false);

  // Close home menu on outside click
  useEffect(() => {
    if (!homeMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (homeMenuRef.current && !homeMenuRef.current.contains(e.target as Node)) {
        setHomeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [homeMenuOpen]);

  // Close on route change
  useEffect(() => {
    setHomeMenuOpen(false);
  }, [location.pathname]);

  const openHomeMenu = () => {
    if (homeMenuTimeoutRef.current) clearTimeout(homeMenuTimeoutRef.current);
    setHomeMenuOpen(true);
  };
  const scheduleCloseHomeMenu = () => {
    if (homeMenuTimeoutRef.current) clearTimeout(homeMenuTimeoutRef.current);
    homeMenuTimeoutRef.current = setTimeout(() => setHomeMenuOpen(false), 180);
  };

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
    { label: 'Portfolio', href: '/projects', isRoute: true },
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
          {/* Home dropdown */}
          <div
            ref={homeMenuRef}
            style={{ position: 'relative' }}
            onMouseEnter={openHomeMenu}
            onMouseLeave={scheduleCloseHomeMenu}
          >
            <button
              type="button"
              onClick={() => setHomeMenuOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={homeMenuOpen}
              style={{
                ...linkStyle(hoveredLink === 'Home' || isAnyHome || homeMenuOpen),
                background: 'transparent',
                border: 'none',
                padding: '8px 0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontFamily: "'JetBrains Mono', monospace",
              }}
              onMouseEnter={() => setHoveredLink('Home')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Home
              <ChevronDown
                size={12}
                style={{
                  transition: 'transform 0.2s ease',
                  transform: homeMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>

            {homeMenuOpen && (
              <div
                role="menu"
                aria-label="Home variants"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  left: 0,
                  minWidth: '260px',
                  background: theme.bgPrimary,
                  border: `1px solid ${theme.accentBorder}`,
                  borderRadius: '2px',
                  padding: '8px',
                  boxShadow: `0 12px 32px ${theme.accentBorder}, 0 4px 12px rgba(0,0,0,0.15)`,
                  backdropFilter: 'blur(20px)',
                  zIndex: 110,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
                onMouseEnter={openHomeMenu}
                onMouseLeave={scheduleCloseHomeMenu}
              >
                <div
                  style={{
                    padding: '8px 12px 4px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '9px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: theme.textMuted,
                  }}
                >
                  Choose a layout
                </div>
                {HOME_VARIANTS.map((variant) => {
                  const active = location.pathname === variant.path;
                  return (
                    <Link
                      key={variant.path}
                      to={variant.path}
                      role="menuitem"
                      onClick={() => setHomeMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '12px',
                        borderRadius: '2px',
                        textDecoration: 'none',
                        background: active ? theme.accentDim : 'transparent',
                        border: `1px solid ${active ? theme.accent : 'transparent'}`,
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = theme.bgSecondary;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <div
                        style={{
                          width: '20px',
                          paddingTop: '2px',
                          color: theme.accent,
                          display: 'flex',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {active && <Check size={14} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '12px',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            color: theme.textPrimary,
                            marginBottom: '4px',
                          }}
                        >
                          {variant.label}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Instrument Sans', sans-serif",
                            fontSize: '12px',
                            color: theme.textTertiary,
                            lineHeight: 1.4,
                          }}
                        >
                          {variant.sub}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

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
          {/* Home variants */}
          <div
            style={{
              padding: '12px',
              border: `1px solid ${theme.accentBorder}`,
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: theme.textMuted,
                padding: '4px 8px 8px',
              }}
            >
              Home — Choose a layout
            </div>
            {HOME_VARIANTS.map((variant) => {
              const active = location.pathname === variant.path;
              return (
                <Link
                  key={variant.path}
                  to={variant.path}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '2px',
                    textDecoration: 'none',
                    background: active ? theme.accentDim : 'transparent',
                    border: `1px solid ${active ? theme.accent : 'transparent'}`,
                  }}
                >
                  <div style={{ width: '16px', display: 'flex', justifyContent: 'center', color: theme.accent }}>
                    {active && <Check size={14} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '12px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: theme.textPrimary,
                      }}
                    >
                      {variant.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Instrument Sans', sans-serif",
                        fontSize: '11px',
                        color: theme.textTertiary,
                      }}
                    >
                      {variant.sub}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

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
