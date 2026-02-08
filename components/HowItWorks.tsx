import React, { useState } from 'react';
import { Search, PhoneCall, Rocket } from 'lucide-react';

const steps = [
  {
    id: 'audit',
    number: '01',
    icon: Search,
    title: 'Free Website Audit',
    description: 'I review your current website (or lack of one) and show you exactly what\'s hurting your Google rankings and costing you leads.',
  },
  {
    id: 'strategy',
    number: '02',
    icon: PhoneCall,
    title: 'Custom Strategy',
    description: 'We jump on a quick call. I learn about your business and create a plan to get you ranking and generating leads.',
  },
  {
    id: 'launch',
    number: '03',
    icon: Rocket,
    title: 'Launch & Rank',
    description: 'I build your new site in 2 weeks. You start showing up on Google. Customers start calling.',
  },
];

const HowItWorks: React.FC = () => {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  const sectionStyle: React.CSSProperties = {
    padding: '160px 48px',
    background: '#0a0a0a',
    position: 'relative',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
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
    fontSize: 'clamp(40px, 6vw, 72px)',
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: '-2px',
    color: '#f5f0e8',
    marginBottom: '80px',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2px',
    background: 'rgba(245, 240, 232, 0.1)',
  };

  const cardStyle = (isHovered: boolean): React.CSSProperties => ({
    background: isHovered ? '#141414' : '#0a0a0a',
    padding: '48px',
    transition: 'all 0.4s ease',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden',
  });

  const numberStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '12px',
    color: 'rgba(245, 240, 232, 0.2)',
    marginBottom: '40px',
  };

  const iconContainerStyle = (isHovered: boolean): React.CSSProperties => ({
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '32px',
    color: isHovered ? '#00F0FF' : 'rgba(245, 240, 232, 0.4)',
    transition: 'all 0.3s ease',
    border: `1px solid ${isHovered ? '#00F0FF' : 'rgba(245, 240, 232, 0.1)'}`,
  });

  const stepTitleStyle = (isHovered: boolean): React.CSSProperties => ({
    fontFamily: "'Syne', sans-serif",
    fontSize: '24px',
    fontWeight: 700,
    color: isHovered ? '#f5f0e8' : 'rgba(245, 240, 232, 0.8)',
    marginBottom: '16px',
    transition: 'color 0.3s ease',
  });

  const descStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: '16px',
    lineHeight: 1.7,
    color: 'rgba(245, 240, 232, 0.4)',
  };

  const accentLineStyle = (isHovered: boolean): React.CSSProperties => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: isHovered ? '100%' : '0%',
    height: '2px',
    background: '#00F0FF',
    transition: 'width 0.4s ease',
  });

  return (
    <section id="how-it-works" style={sectionStyle}>
      <div style={containerStyle}>
        <div style={labelStyle}>
          <span style={{ width: '40px', height: '1px', background: '#00F0FF' }} />
          Process
        </div>
        <h2 style={titleStyle}>
          How It<br />
          <span style={{ color: '#00F0FF' }}>Works</span>
        </h2>

        <div style={gridStyle} className="hiw-grid">
          {steps.map((step) => (
            <div
              key={step.id}
              style={cardStyle(hoveredStep === step.id)}
              onMouseEnter={() => setHoveredStep(step.id)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div style={numberStyle}>{step.number}</div>
              <div style={iconContainerStyle(hoveredStep === step.id)}>
                <step.icon size={28} />
              </div>
              <h3 style={stepTitleStyle(hoveredStep === step.id)}>{step.title}</h3>
              <p style={descStyle}>{step.description}</p>
              <div style={accentLineStyle(hoveredStep === step.id)} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #how-it-works { padding: 80px 24px !important; }
          .hiw-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          #how-it-works { padding: 60px 16px !important; }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
