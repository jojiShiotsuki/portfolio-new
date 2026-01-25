import React from 'react';
import { EXPERIENCE } from '../constants';
import { MapPin, Target, Award, Dumbbell } from 'lucide-react';

const About: React.FC = () => {
  const sectionStyle: React.CSSProperties = {
    padding: '160px 48px',
    background: '#0f0f0f',
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
    fontFamily: "'Space Mono', monospace",
    fontSize: '12px',
    color: '#00F0FF',
    letterSpacing: '4px',
    textTransform: 'uppercase',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(40px, 5vw, 64px)',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-2px',
    color: '#f5f0e8',
    marginBottom: '40px',
  };

  const textStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: '17px',
    lineHeight: 1.9,
    color: 'rgba(245, 240, 232, 0.5)',
    marginBottom: '24px',
  };

  const highlightStyle: React.CSSProperties = {
    color: '#f5f0e8',
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
    background: 'rgba(245, 240, 232, 0.02)',
    border: '1px solid rgba(245, 240, 232, 0.08)',
    transition: 'all 0.3s ease',
  };

  const statIconStyle = (color: string): React.CSSProperties => ({
    color,
    marginBottom: '16px',
  });

  const statValueStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: '24px',
    fontWeight: 700,
    color: '#f5f0e8',
    marginBottom: '4px',
  };

  const statLabelStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '11px',
    color: 'rgba(245, 240, 232, 0.4)',
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
    borderLeft: '1px solid rgba(245, 240, 232, 0.1)',
    paddingLeft: '40px',
    marginLeft: '0',
  };

  const timelineDotStyle: React.CSSProperties = {
    position: 'absolute',
    left: '-6px',
    top: '0',
    width: '12px',
    height: '12px',
    background: '#00F0FF',
    borderRadius: '50%',
    boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
  };

  const roleStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: '20px',
    fontWeight: 700,
    color: '#f5f0e8',
    marginBottom: '4px',
  };

  const companyStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '12px',
    color: '#FF6B4A',
    letterSpacing: '1px',
    marginBottom: '8px',
  };

  const periodStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '11px',
    color: 'rgba(245, 240, 232, 0.3)',
    letterSpacing: '1px',
    marginBottom: '12px',
  };

  const descStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: '14px',
    lineHeight: 1.7,
    color: 'rgba(245, 240, 232, 0.4)',
  };

  const stats = [
    { icon: Target, value: '600+', label: 'Days Sober', color: '#00F0FF' },
    { icon: Dumbbell, value: 'Daily', label: 'Gym & Running', color: '#FF6B4A' },
    { icon: Award, value: 'Continuous', label: 'Learning', color: '#00F0FF' },
    { icon: MapPin, value: 'Global', label: 'US, AU & PH Clients', color: '#FF6B4A' },
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
        background: 'radial-gradient(circle, rgba(0, 240, 255, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={containerStyle} className="about-container">
        {/* Left Column - Story */}
        <div>
          <div style={labelStyle}>
            <span style={{ width: '40px', height: '1px', background: '#00F0FF' }} />
            About
          </div>
          <h2 style={titleStyle}>
            The<br />
            <span style={{ color: '#00F0FF' }}>Journey</span>
          </h2>

          <p style={textStyle}>
            My path hasn't been linear, and that's my biggest asset. I started in leadership at{' '}
            <span style={highlightStyle}>Toyota</span>, learning the importance of process and reliability.
          </p>
          <p style={textStyle}>
            After running my own businesses and working in the construction industry, I realized most
            businesses struggle to bridge the gap between "having a website" and{' '}
            <span style={{ color: '#00F0FF' }}>"getting sales."</span>
          </p>
          <p style={textStyle}>
            Now I combine <span style={{ color: '#FF6B4A', fontWeight: 700 }}>full-stack engineering</span> with
            conversion psychology to build websites that actually drive revenue.
          </p>

          <div style={statsGridStyle}>
            {stats.map((stat, i) => (
              <div
                key={i}
                style={statCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = stat.color;
                  e.currentTarget.style.background = 'rgba(245, 240, 232, 0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(245, 240, 232, 0.08)';
                  e.currentTarget.style.background = 'rgba(245, 240, 232, 0.02)';
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
            fontFamily: "'Space Mono', monospace",
            fontSize: '11px',
            color: 'rgba(245, 240, 232, 0.3)',
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
      `}</style>
    </section>
  );
};

export default About;
