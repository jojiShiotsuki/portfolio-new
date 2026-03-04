import React, { useEffect, useState } from 'react';
import { PERSONAL_INFO } from '../constants';
import { ArrowDownRight, Github, Linkedin, Music2 } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const Hero: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '120px 48px 80px',
    position: 'relative',
    overflow: 'hidden',
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
    position: 'relative',
    zIndex: 2,
  };

  const taglineStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: theme.accent,
    letterSpacing: '4px',
    textTransform: 'uppercase',
    marginBottom: '32px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    animation: 'fadeInUp 0.8s ease-out forwards',
  };

  const headlineStyle: React.CSSProperties = {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: 'clamp(48px, 10vw, 140px)',
    fontWeight: 800,
    lineHeight: 0.9,
    letterSpacing: '-4px',
    marginBottom: '48px',
    color: theme.textPrimary,
  };

  const accentTextStyle: React.CSSProperties = {
    color: 'transparent',
    WebkitTextStroke: `2px ${theme.headingStroke}`,
    display: 'block',
  };

  const descriptionStyle: React.CSSProperties = {
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: '20px',
    lineHeight: 1.7,
    color: theme.textSecondary,
    maxWidth: '600px',
    marginBottom: '48px',
    animation: 'fadeInUp 0.8s ease-out 0.3s forwards',
    opacity: 0,
  };

  const ctaContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    flexWrap: 'wrap',
    animation: 'fadeInUp 0.8s ease-out 0.4s forwards',
    opacity: 0,
  };

  const primaryCtaStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    fontWeight: 700,
    color: theme.btnPrimaryText,
    background: theme.textPrimary,
    padding: '20px 40px',
    textDecoration: 'none',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const secondaryCtaStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    fontWeight: 400,
    color: theme.textPrimary,
    background: 'transparent',
    padding: '20px 40px',
    textDecoration: 'none',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    border: `1px solid ${theme.btnOutlineBorder}`,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const floatingElementStyle: React.CSSProperties = {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${theme.accentDim} 0%, transparent 70%)`,
    filter: 'blur(60px)',
    transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`,
    transition: 'transform 0.3s ease-out',
    pointerEvents: 'none',
  };

  const verticalTextStyle: React.CSSProperties = {
    position: 'absolute',
    right: '48px',
    top: '50%',
    transform: 'translateY(-50%) rotate(90deg)',
    transformOrigin: 'center',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    letterSpacing: '4px',
    color: theme.textMuted,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  };

  const socialLinksStyle: React.CSSProperties = {
    position: 'absolute',
    left: '48px',
    bottom: '80px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    animation: 'fadeInUp 0.8s ease-out 0.5s forwards',
    opacity: 0,
  };

  const socialLinkStyle: React.CSSProperties = {
    color: theme.textTertiary,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  };

  const scrollIndicatorStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    animation: 'fadeInUp 0.8s ease-out 0.6s forwards',
    opacity: 0,
  };

  const scrollLineStyle: React.CSSProperties = {
    width: '1px',
    height: '60px',
    background: `linear-gradient(to bottom, ${theme.accent}, transparent)`,
  };

  return (
    <section id="home" style={containerStyle}>
      {/* Floating gradient */}
      <div style={{ ...floatingElementStyle, top: '10%', right: '20%' }} className="hide-mobile" />
      <div style={{ ...floatingElementStyle, bottom: '20%', left: '10%', background: `radial-gradient(circle, rgba(245, 183, 49, 0.1) 0%, transparent 70%)` }} className="hide-mobile" />

      {/* Vertical text */}
      <div style={verticalTextStyle} className="hide-mobile">
        Available for Projects // 2025
      </div>

      {/* Social links */}
      <div style={socialLinksStyle} className="hide-mobile">
        <a
          href="https://tiktok.com/@_shiotsuki"
          target="_blank"
          rel="noopener noreferrer"
          style={socialLinkStyle}
          onMouseEnter={(e) => { e.currentTarget.style.color = theme.accent; e.currentTarget.style.transform = 'translateX(4px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = theme.textTertiary; e.currentTarget.style.transform = 'translateX(0)'; }}
        >
          <Music2 size={20} />
        </a>
        <a
          href="https://linkedin.com/in/jojishiotsuki"
          target="_blank"
          rel="noopener noreferrer"
          style={socialLinkStyle}
          onMouseEnter={(e) => { e.currentTarget.style.color = theme.accent; e.currentTarget.style.transform = 'translateX(4px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = theme.textTertiary; e.currentTarget.style.transform = 'translateX(0)'; }}
        >
          <Linkedin size={20} />
        </a>
        <a
          href="https://github.com/jojiShiotsuki"
          target="_blank"
          rel="noopener noreferrer"
          style={socialLinkStyle}
          onMouseEnter={(e) => { e.currentTarget.style.color = theme.accent; e.currentTarget.style.transform = 'translateX(4px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = theme.textTertiary; e.currentTarget.style.transform = 'translateX(0)'; }}
        >
          <Github size={20} />
        </a>
        <div style={{ width: '1px', height: '60px', background: theme.textMuted }} />
      </div>

      <div style={contentStyle}>
        <div style={taglineStyle}>
          <span style={{ width: '40px', height: '1px', background: theme.accent }} />
          {PERSONAL_INFO.role}
        </div>

        <h1 style={headlineStyle}>
          <span style={{ animation: 'fadeInUp 0.8s ease-out 0.1s forwards', opacity: 0, display: 'block' }}>
            I Help
          </span>
          <span style={{ ...accentTextStyle, animation: 'fadeInUp 0.8s ease-out 0.2s forwards', opacity: 0 }}>
            Aussie Tradies
          </span>
          <span style={{ animation: 'fadeInUp 0.8s ease-out 0.3s forwards', opacity: 0, display: 'block' }}>
            Get Found
          </span>
        </h1>

        <p style={descriptionStyle}>
          {PERSONAL_INFO.subHeadline}
        </p>

        <div style={ctaContainerStyle}>
          <a
            href="#contact"
            style={primaryCtaStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.accent;
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 10px 40px ${theme.accentGlow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = theme.textPrimary;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Get a Free Website Audit
            <ArrowDownRight size={18} />
          </a>
          <a
            href="#results"
            style={secondaryCtaStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.accent;
              e.currentTarget.style.color = theme.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.btnOutlineBorder;
              e.currentTarget.style.color = theme.textPrimary;
            }}
          >
            See My Results
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={scrollIndicatorStyle} className="hide-mobile">
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '2px', color: theme.textTertiary }}>
          SCROLL
        </span>
        <div style={scrollLineStyle} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          #home { padding: 100px 24px 60px !important; }
          #home h1 {
            font-size: clamp(32px, 10vw, 70px) !important;
            letter-spacing: -1px !important;
            line-height: 1 !important;
          }
        }
        @media (max-width: 480px) {
          #home { padding: 90px 16px 50px !important; }
          #home h1 {
            font-size: clamp(28px, 9vw, 50px) !important;
            letter-spacing: -1px !important;
            line-height: 1.05 !important;
          }
        }
        @media (max-width: 375px) {
          #home h1 {
            font-size: 28px !important;
            letter-spacing: 0px !important;
            line-height: 1.1 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
