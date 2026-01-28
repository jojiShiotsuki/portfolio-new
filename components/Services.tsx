import React, { useState } from 'react';
import { SERVICES } from '../constants';

const Services: React.FC = () => {
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  const sectionStyle: React.CSSProperties = {
    padding: '160px 48px',
    position: 'relative',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const headerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '80px',
    marginBottom: '100px',
    alignItems: 'end',
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
  };

  const descriptionStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: '18px',
    lineHeight: 1.8,
    color: 'rgba(245, 240, 232, 0.5)',
    maxWidth: '500px',
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
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  });

  const cardNumberStyle: React.CSSProperties = {
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

  const cardTitleStyle = (isHovered: boolean): React.CSSProperties => ({
    fontFamily: "'Syne', sans-serif",
    fontSize: '24px',
    fontWeight: 700,
    color: isHovered ? '#f5f0e8' : 'rgba(245, 240, 232, 0.8)',
    marginBottom: '16px',
    transition: 'color 0.3s ease',
  });

  const cardDescStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: '15px',
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
    <section id="services" style={sectionStyle}>
      <div style={containerStyle}>
        <div style={headerStyle} className="services-header">
          <div>
            <div style={labelStyle}>
              <span style={{ width: '40px', height: '1px', background: '#00F0FF' }} />
              Services
            </div>
            <h2 style={titleStyle}>
              What I<br />
              <span style={{ color: '#00F0FF' }}>Build</span>
            </h2>
          </div>
          <p style={descriptionStyle}>
            Technical excellence meets marketing strategy. I don't just write code; I build business assets that drive revenue.
          </p>
        </div>

        <div style={gridStyle} className="services-grid">
          {SERVICES.map((service, index) => (
            <div
              key={service.id}
              style={cardStyle(hoveredService === service.id)}
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <div style={cardNumberStyle}>0{index + 1}</div>
              <div style={iconContainerStyle(hoveredService === service.id)}>
                <service.icon size={28} />
              </div>
              <h3 style={cardTitleStyle(hoveredService === service.id)}>{service.title}</h3>
              <p style={cardDescStyle}>{service.description}</p>
              <div style={accentLineStyle(hoveredService === service.id)} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .services-header {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .services-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          #services { padding: 80px 24px !important; }
          .services-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          #services { padding: 60px 16px !important; }
        }
      `}</style>
    </section>
  );
};

export default Services;
