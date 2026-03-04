import React, { useState } from 'react';
import { HardHat, Droplets, Zap, Wind, Hammer, TreePine } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const trades = [
  { label: 'Roofers', icon: HardHat },
  { label: 'Plumbers', icon: Droplets },
  { label: 'Electricians', icon: Zap },
  { label: 'HVAC / Air Conditioning', icon: Wind },
  { label: 'Builders & Contractors', icon: Hammer },
  { label: 'Landscapers', icon: TreePine },
];

const WhoIWorkWith: React.FC = () => {
  const [hoveredTrade, setHoveredTrade] = useState<number | null>(null);
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
  };

  const headerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '80px',
    marginBottom: '80px',
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

  const tradeCardStyle = (isHovered: boolean): React.CSSProperties => ({
    background: isHovered ? theme.bgCardHover : theme.bgPrimary,
    padding: '40px 48px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    transition: 'all 0.4s ease',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden',
  });

  const tradeIconStyle = (isHovered: boolean): React.CSSProperties => ({
    color: isHovered ? theme.accent : theme.textTertiary,
    transition: 'all 0.3s ease',
    flexShrink: 0,
  });

  const tradeLabelStyle = (isHovered: boolean): React.CSSProperties => ({
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '20px',
    fontWeight: 700,
    color: isHovered ? theme.textPrimary : theme.textSecondary,
    transition: 'color 0.3s ease',
  });

  const accentLineStyle = (isHovered: boolean): React.CSSProperties => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: isHovered ? '100%' : '0%',
    height: '2px',
    background: theme.accent,
    transition: 'width 0.4s ease',
  });

  const ctaStyle: React.CSSProperties = {
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: '20px',
    lineHeight: 1.8,
    color: theme.textSecondary,
    marginTop: '60px',
    textAlign: 'center',
  };

  return (
    <section id="who-i-work-with" style={sectionStyle}>
      <div style={containerStyle}>
        <div style={headerStyle} className="wiww-header">
          <div>
            <div style={labelStyle}>
              <span style={{ width: '40px', height: '1px', background: theme.accent }} />
              Industries
            </div>
            <h2 style={titleStyle}>
              Who I<br />
              <span style={{ color: theme.accent }}>Work With</span>
            </h2>
          </div>
          <p style={descriptionStyle}>
            I specialise in websites for Australian tradies and construction businesses.
          </p>
        </div>

        <div style={gridStyle} className="wiww-grid">
          {trades.map((trade, index) => (
            <div
              key={index}
              style={tradeCardStyle(hoveredTrade === index)}
              onMouseEnter={() => setHoveredTrade(index)}
              onMouseLeave={() => setHoveredTrade(null)}
            >
              <trade.icon size={28} style={tradeIconStyle(hoveredTrade === index)} />
              <span style={tradeLabelStyle(hoveredTrade === index)}>{trade.label}</span>
              <div style={accentLineStyle(hoveredTrade === index)} />
            </div>
          ))}
        </div>

        <p style={ctaStyle}>
          If you're a tradie who wants more leads from Google,{' '}
          <a
            href="#contact"
            style={{ color: theme.accent, textDecoration: 'none', fontWeight: 700 }}
            onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
            onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
          >
            I can help.
          </a>
        </p>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .wiww-header {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 768px) {
          #who-i-work-with { padding: 80px 24px !important; }
          .wiww-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          #who-i-work-with { padding: 60px 16px !important; }
        }
      `}</style>
    </section>
  );
};

export default WhoIWorkWith;
