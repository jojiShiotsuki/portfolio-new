import React, { useState } from 'react';
import { SERVICES } from '../constants';
import { useTheme } from '../ThemeContext';

const Services: React.FC = () => {
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const { theme } = useTheme();

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
    fontSize: 'clamp(40px, 6vw, 72px)',
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: '-2px',
    color: theme.textPrimary,
  };

  const descriptionStyle: React.CSSProperties = {
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: '20px',
    lineHeight: 1.8,
    color: theme.textSecondary,
    maxWidth: '500px',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2px',
    background: theme.borderPrimary,
  };

  const cardStyle = (isHovered: boolean): React.CSSProperties => ({
    background: isHovered ? theme.bgCardHover : theme.bgPrimary,
    padding: '48px',
    transition: 'all 0.4s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  });

  const cardNumberStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: theme.textMuted,
    marginBottom: '40px',
  };

  const iconContainerStyle = (isHovered: boolean): React.CSSProperties => ({
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '32px',
    color: isHovered ? theme.accent : theme.textTertiary,
    transition: 'all 0.3s ease',
    border: `1px solid ${isHovered ? theme.accent : theme.borderPrimary}`,
  });

  const cardTitleStyle = (isHovered: boolean): React.CSSProperties => ({
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '24px',
    fontWeight: 700,
    color: isHovered ? theme.textPrimary : theme.textSecondary,
    marginBottom: '16px',
    transition: 'color 0.3s ease',
  });

  const cardDescStyle: React.CSSProperties = {
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: '16px',
    lineHeight: 1.7,
    color: theme.textTertiary,
  };

  const accentLineStyle = (isHovered: boolean): React.CSSProperties => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: isHovered ? '100%' : '0%',
    height: '2px',
    background: theme.accent,
    transition: 'width 0.4s ease',
  });

  return (
    <section id="services" style={sectionStyle}>
      <div style={containerStyle}>
        <div style={headerStyle} className="services-header">
          <div>
            <div style={labelStyle}>
              <span style={{ width: '40px', height: '1px', background: theme.accent }} />
              Services
            </div>
            <h2 style={titleStyle}>
              What I Build<br />
              <span style={{ color: theme.accent }}>for Tradies</span>
            </h2>
          </div>
          <p style={descriptionStyle}>
            Everything you need to get found on Google and turn website visitors into paying customers.
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
