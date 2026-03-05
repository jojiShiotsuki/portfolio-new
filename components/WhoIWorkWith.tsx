import React, { useState } from 'react';
import { HardHat, Droplets, Zap, Wind, Hammer, TreePine, ArrowRight } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { InteractiveHoverButton } from './ui/interactive-hover-button';

const trades = [
  { label: 'Roofers', icon: HardHat, tagline: 'Roof repairs, replacements & new builds' },
  { label: 'Plumbers', icon: Droplets, tagline: 'Emergency, residential & commercial' },
  { label: 'Electricians', icon: Zap, tagline: 'Wiring, installations & maintenance' },
  { label: 'HVAC', icon: Wind, tagline: 'Heating, cooling & air conditioning' },
  { label: 'Builders', icon: Hammer, tagline: 'Renovations, extensions & new homes' },
  { label: 'Landscapers', icon: TreePine, tagline: 'Gardens, hardscaping & outdoor living' },
];

const WhoIWorkWith: React.FC = () => {
  const [hoveredTrade, setHoveredTrade] = useState<number | null>(null);
  const { theme } = useTheme();

  return (
    <section id="who-i-work-with" style={{ padding: '160px 48px', background: theme.bgPrimary, position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header - centered */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            color: theme.labelColor,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}>
            <span style={{ width: '40px', height: '1px', background: theme.accent }} />
            Industries
            <span style={{ width: '40px', height: '1px', background: theme.accent }} />
          </div>
          <h2 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-2px',
            color: theme.textPrimary,
            marginBottom: '24px',
          }}>
            Who I<br />
            <span style={{ color: 'transparent', WebkitTextStroke: `2px ${theme.headingStroke}` }}>Work With</span>
          </h2>
          <p style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: '20px',
            lineHeight: 1.7,
            color: theme.textSecondary,
            maxWidth: '550px',
            margin: '0 auto',
          }}>
            I specialise in websites for Australian tradies and construction businesses.
          </p>
        </div>

        {/* Trade cards - 3x2 grid with rich cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
        }} className="wiww-grid">
          {trades.map((trade, index) => {
            const isHovered = hoveredTrade === index;
            return (
              <div
                key={index}
                style={{
                  background: isHovered ? theme.bgCardHover : theme.bgSecondary,
                  border: `1px solid ${isHovered ? theme.accent : theme.borderPrimary}`,
                  padding: '40px',
                  transition: 'all 0.4s ease',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={() => setHoveredTrade(index)}
                onMouseLeave={() => setHoveredTrade(null)}
              >
                {/* Icon */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  background: isHovered ? theme.accent : theme.accentDim,
                  color: isHovered ? theme.btnPrimaryText : theme.accent,
                  transition: 'all 0.3s ease',
                }}>
                  <trade.icon size={26} />
                </div>

                {/* Label */}
                <div style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: '24px',
                  fontWeight: 700,
                  color: isHovered ? theme.textPrimary : theme.textSecondary,
                  transition: 'color 0.3s ease',
                  marginBottom: '8px',
                }}>{trade.label}</div>

                {/* Tagline */}
                <div style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: '15px',
                  color: theme.textTertiary,
                  lineHeight: 1.5,
                }}>{trade.tagline}</div>

                {/* Decorative number */}
                <div style={{
                  position: 'absolute',
                  right: '-8px',
                  bottom: '-16px',
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: '120px',
                  fontWeight: 800,
                  color: theme.borderPrimary,
                  lineHeight: 1,
                  pointerEvents: 'none',
                  opacity: isHovered ? 1 : 0.4,
                  transition: 'opacity 0.4s ease',
                }}>0{index + 1}</div>

                {/* Accent line */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: isHovered ? '100%' : '0%',
                  height: '2px',
                  background: theme.accent,
                  transition: 'width 0.4s ease',
                }} />
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <p style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: '20px',
            lineHeight: 1.8,
            color: theme.textSecondary,
            marginBottom: '32px',
          }}>
            If you're a tradie who wants more leads from Google, let's talk.
          </p>
          <InteractiveHoverButton
            text="Get a Free Audit"
            variant="primary"
            href="#contact"
            style={{ display: 'inline-flex' }}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .wiww-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          #who-i-work-with { padding: 80px 24px !important; }
          .wiww-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
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
