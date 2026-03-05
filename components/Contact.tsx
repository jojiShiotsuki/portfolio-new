import React from 'react';
import { PERSONAL_INFO } from '../constants';
import { useTheme } from '../ThemeContext';
import { InteractiveHoverButton } from './ui/interactive-hover-button';

const Contact: React.FC = () => {
  const { theme } = useTheme();

  const sectionStyle: React.CSSProperties = {
    padding: '200px 48px',
    background: theme.bgPrimary,
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
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: theme.labelColor,
    letterSpacing: '4px',
    textTransform: 'uppercase',
    marginBottom: '32px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: 'clamp(48px, 8vw, 100px)',
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: '-3px',
    color: theme.textPrimary,
    marginBottom: '32px',
  };

  const descStyle: React.CSSProperties = {
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: '20px',
    lineHeight: 1.7,
    color: theme.textSecondary,
    maxWidth: '600px',
    margin: '0 auto 64px',
  };

  const ctaContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  };


  const emailDisplayStyle: React.CSSProperties = {
    marginTop: '80px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '14px',
    color: theme.textTertiary,
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
        background: `radial-gradient(circle, ${theme.accentBorder} 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${theme.accentBorder}, transparent)`,
      }} />

      <div style={containerStyle}>
        <div style={labelStyle}>Let's Go</div>

        <h2 style={titleStyle}>
          Ready to Get<br />
          <span style={{ color: 'transparent', WebkitTextStroke: `2px ${theme.headingStroke}` }}>More Leads?</span>
        </h2>

        <p style={descStyle}>
          Get a free website audit. I'll show you exactly what's stopping you from ranking on Google — and how to fix it.
        </p>

        <div style={ctaContainerStyle}>
          <InteractiveHoverButton
            text="Book a Call"
            variant="primary"
            href="https://calendly.com/jojishiotsuki0/30min"
            style={{ padding: '24px 48px', fontSize: '14px' }}
          />
          <InteractiveHoverButton
            text="Connect on LinkedIn"
            variant="outline"
            href="https://linkedin.com/in/jojishiotsuki"
            style={{ padding: '24px 48px', fontSize: '14px' }}
          />
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
