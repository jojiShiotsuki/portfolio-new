import React from 'react';
import { EXPERIENCE } from '../constants';
import { MapPin, Clock, Award, Code2 } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const About: React.FC = () => {
  const { theme } = useTheme();

  const sectionStyle: React.CSSProperties = {
    padding: '160px 48px',
    background: theme.bgSecondary,
    position: 'relative',
    overflow: 'hidden',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '120px',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: theme.labelColor,
    letterSpacing: '4px',
    textTransform: 'uppercase',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: 'clamp(40px, 5vw, 64px)',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-2px',
    color: theme.textPrimary,
    marginBottom: '40px',
  };

  const textStyle: React.CSSProperties = {
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: '18px',
    lineHeight: 1.9,
    color: theme.textSecondary,
    marginBottom: '24px',
  };

  const highlightStyle: React.CSSProperties = {
    color: theme.textPrimary,
    fontWeight: 600,
  };

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginTop: '48px',
  };

  const statCardStyle: React.CSSProperties = {
    padding: '24px',
    background: theme.borderSecondary,
    border: `1px solid ${theme.borderPrimary}`,
    transition: 'all 0.3s ease',
  };

  const statIconStyle = (color: string): React.CSSProperties => ({
    color,
    marginBottom: '16px',
  });

  const statValueStyle: React.CSSProperties = {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '24px',
    fontWeight: 700,
    color: theme.textPrimary,
    marginBottom: '4px',
  };

  const statLabelStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    color: theme.textTertiary,
    letterSpacing: '1px',
    textTransform: 'uppercase',
  };

  const timelineStyle: React.CSSProperties = {
    position: 'relative',
    paddingLeft: '40px',
  };

  const timelineItemStyle: React.CSSProperties = {
    position: 'relative',
    paddingBottom: '48px',
    borderLeft: `1px solid ${theme.borderPrimary}`,
    paddingLeft: '40px',
    marginLeft: '0',
  };

  const timelineDotStyle: React.CSSProperties = {
    position: 'absolute',
    left: '-6px',
    top: '0',
    width: '12px',
    height: '12px',
    background: theme.accent,
    borderRadius: '50%',
    boxShadow: `0 0 20px ${theme.accentGlow}`,
  };

  const roleStyle: React.CSSProperties = {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '20px',
    fontWeight: 700,
    color: theme.textPrimary,
    marginBottom: '4px',
  };

  const companyStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: theme.accentLight,
    letterSpacing: '1px',
    marginBottom: '8px',
  };

  const periodStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    color: theme.textTertiary,
    letterSpacing: '1px',
    marginBottom: '12px',
  };

  const descStyle: React.CSSProperties = {
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: '14px',
    lineHeight: 1.7,
    color: theme.textTertiary,
  };

  const stats = [
    { icon: Code2, value: '600+', label: 'Hours of Dev Experience', color: theme.accent },
    { icon: Clock, value: 'Daily', label: 'Updates to Skills', color: theme.accentLight },
    { icon: Award, value: '#1', label: 'Google Rankings', color: theme.accent },
    { icon: MapPin, value: 'Global', label: 'AU, US & PH Clients', color: theme.accentLight },
  ];

  return (
    <section id="about" style={sectionStyle}>
      {/* Background accent */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: `radial-gradient(circle, ${theme.accentDim} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={containerStyle} className="about-container">
        {/* Left Column - Story */}
        <div>
          <div style={labelStyle}>
            <span style={{ width: '40px', height: '1px', background: theme.accent }} />
            About
          </div>
          <h2 style={titleStyle}>
            Why Tradies<br />
            <span style={{ color: theme.accent }}>Trust Me</span>
          </h2>

          <p style={textStyle}>
            I'm not just another web developer.
          </p>
          <p style={textStyle}>
            I've spent <span style={highlightStyle}>2+ years working with a US roofing company</span>, so I understand the construction industry. I know tradies are busy running jobs — not messing around with websites.
          </p>
          <p style={textStyle}>
            That's why I handle everything:<br />
            <span style={{ color: theme.accent }}>No tech jargon.</span>{' '}
            <span style={{ color: theme.accentLight, fontWeight: 700 }}>No endless back-and-forth.</span>{' '}
            Just a website that ranks and brings you customers.
          </p>
          <p style={textStyle}>
            I've ranked local businesses <span style={{ color: theme.accent, fontWeight: 700 }}>#1 on Google</span>. I'll do the same for you.
          </p>

          <div style={statsGridStyle}>
            {stats.map((stat, i) => (
              <div
                key={i}
                style={statCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = stat.color;
                  e.currentTarget.style.background = theme.borderPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.borderPrimary;
                  e.currentTarget.style.background = theme.borderSecondary;
                }}
              >
                <stat.icon size={24} style={statIconStyle(stat.color)} />
                <div style={statValueStyle}>{stat.value}</div>
                <div style={statLabelStyle}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Timeline */}
        <div style={timelineStyle}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            color: theme.textTertiary,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '40px',
          }}>
            Experience Timeline
          </div>

          {EXPERIENCE.map((exp, index) => (
            <div key={exp.id} style={timelineItemStyle}>
              <div style={timelineDotStyle} />
              <div style={roleStyle}>{exp.role}</div>
              <div style={companyStyle}>{exp.company}</div>
              <div style={periodStyle}>{exp.period}</div>
              <p style={descStyle}>{exp.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 968px) {
          .about-container {
            grid-template-columns: 1fr !important;
            gap: 80px !important;
          }
        }
        @media (max-width: 768px) {
          #about { padding: 80px 24px !important; }
        }
        @media (max-width: 480px) {
          #about { padding: 60px 16px !important; }
        }
      `}</style>
    </section>
  );
};

export default About;
