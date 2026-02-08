import React from 'react';
import { PERSONAL_INFO } from '../constants';
import { Mail, ArrowUpRight } from 'lucide-react';

const Contact: React.FC = () => {
  const sectionStyle: React.CSSProperties = {
    padding: '200px 48px',
    background: '#0a0a0a',
    position: 'relative',
    overflow: 'hidden',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '12px',
    color: '#00F0FF',
    letterSpacing: '4px',
    textTransform: 'uppercase',
    marginBottom: '32px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(48px, 8vw, 100px)',
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: '-3px',
    color: '#f5f0e8',
    marginBottom: '32px',
  };

  const descStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: '20px',
    lineHeight: 1.7,
    color: 'rgba(245, 240, 232, 0.5)',
    maxWidth: '600px',
    margin: '0 auto 64px',
  };

  const ctaContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  };

  const primaryCtaStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '14px',
    fontWeight: 700,
    color: '#0a0a0a',
    background: '#00F0FF',
    padding: '24px 48px',
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
    fontFamily: "'Space Mono', monospace",
    fontSize: '14px',
    fontWeight: 400,
    color: '#f5f0e8',
    background: 'transparent',
    padding: '24px 48px',
    textDecoration: 'none',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    border: '1px solid rgba(245, 240, 232, 0.2)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const emailDisplayStyle: React.CSSProperties = {
    marginTop: '80px',
    fontFamily: "'Space Mono', monospace",
    fontSize: '14px',
    color: 'rgba(245, 240, 232, 0.3)',
    letterSpacing: '2px',
  };

  return (
    <section id="contact" style={sectionStyle}>
      {/* Background elements */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(0, 240, 255, 0.03) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.3), transparent)',
      }} />

      <div style={containerStyle}>
        <div style={labelStyle}>Let's Go</div>

        <h2 style={titleStyle}>
          Ready to Get<br />
          <span style={{ color: 'transparent', WebkitTextStroke: '2px #00F0FF' }}>More Leads?</span>
        </h2>

        <p style={descStyle}>
          Get a free website audit. I'll show you exactly what's stopping you from ranking on Google — and how to fix it.
        </p>

        <div style={ctaContainerStyle}>
          <a
            href={`mailto:${PERSONAL_INFO.email}?subject=Free%20Website%20Audit%20Request`}
            style={primaryCtaStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f5f0e8';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 240, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#00F0FF';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Mail size={18} />
            Get Your Free Audit
          </a>
          <a
            href="https://linkedin.com/in/jojishiotsuki"
            target="_blank"
            rel="noopener noreferrer"
            style={secondaryCtaStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#FF6B4A';
              e.currentTarget.style.color = '#FF6B4A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(245, 240, 232, 0.2)';
              e.currentTarget.style.color = '#f5f0e8';
            }}
          >
            Connect on LinkedIn
            <ArrowUpRight size={18} />
          </a>
        </div>

        <div style={emailDisplayStyle}>
          Or email me directly: {PERSONAL_INFO.email}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #contact { padding: 100px 24px !important; }
        }
        @media (max-width: 480px) {
          #contact { padding: 80px 16px !important; }
        }
      `}</style>
    </section>
  );
};

export default Contact;
