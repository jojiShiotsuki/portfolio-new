import React, { useState } from 'react';
import { Search, PhoneCall, Rocket, ChevronRight } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { InteractiveHoverButton } from './ui/interactive-hover-button';

const steps = [
  {
    id: 'audit',
    number: '01',
    icon: Search,
    title: 'Free Website Audit',
    description: 'I review your current website (or lack of one) and show you exactly what\'s hurting your Google rankings and costing you leads.',
    duration: '24 hours',
  },
  {
    id: 'strategy',
    number: '02',
    icon: PhoneCall,
    title: 'Custom Strategy',
    description: 'We jump on a quick call. I learn about your business and create a plan to get you ranking and generating leads.',
    duration: '30 min call',
  },
  {
    id: 'launch',
    number: '03',
    icon: Rocket,
    title: 'Launch & Rank',
    description: 'I build your new site in 2 weeks. You start showing up on Google. Customers start calling.',
    duration: '2 weeks',
  },
];

const HowItWorks: React.FC = () => {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  const { theme } = useTheme();

  return (
    <section id="how-it-works" aria-label="How it works" style={{ padding: '160px 48px', background: theme.bgSecondary, position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div className="hiw-header" style={{ textAlign: 'center', marginBottom: '100px' }}>
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
            Process
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
            How It<br />
            <span style={{ color: 'transparent', WebkitTextStroke: `2px ${theme.headingStroke}` }}>Works</span>
          </h2>
          <p style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: '20px',
            lineHeight: 1.7,
            color: theme.textSecondary,
            maxWidth: '500px',
            margin: '0 auto',
          }}>
            Three simple steps from "no one can find me" to "the phone won't stop ringing."
          </p>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Horizontal connector line (desktop only) */}
          <div
            className="hiw-connector"
            style={{
              position: 'absolute',
              top: '60px',
              left: '16.67%',
              right: '16.67%',
              height: '1px',
              background: `linear-gradient(90deg, ${theme.borderPrimary}, ${theme.accent}, ${theme.borderPrimary})`,
              zIndex: 0,
            }}
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '40px',
            position: 'relative',
            zIndex: 1,
          }} className="hiw-grid">
            {steps.map((step, index) => {
              const isHovered = hoveredStep === step.id;
              return (
                <div
                  key={step.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {/* Step number circle */}
                  <div style={{
                    width: '120px',
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    marginBottom: '40px',
                    cursor: 'default',
                  }}>
                    {/* Outer ring */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      border: `1px solid ${isHovered ? theme.accent : theme.borderPrimary}`,
                      borderRadius: '50%',
                      transition: 'all 0.4s ease',
                      transform: isHovered ? 'scale(1)' : 'scale(0.9)',
                    }} />
                    {/* Inner filled circle */}
                    <div style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isHovered ? theme.accent : theme.bgPrimary,
                      border: `1px solid ${isHovered ? theme.accent : theme.borderPrimary}`,
                      transition: 'all 0.4s ease',
                    }}>
                      <step.icon
                        size={32}
                        style={{
                          color: isHovered ? theme.btnPrimaryText : theme.textMuted,
                          transition: 'color 0.3s ease',
                        }}
                      />
                    </div>
                    {/* Step number badge */}
                    <div style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: theme.bgSecondary,
                      border: `2px solid ${isHovered ? theme.accent : theme.borderPrimary}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '12px',
                      fontWeight: 700,
                      color: isHovered ? theme.accent : theme.textMuted,
                      transition: 'all 0.3s ease',
                    }}>
                      {step.number}
                    </div>
                  </div>

                  {/* Duration tag */}
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: theme.accent,
                    padding: '6px 16px',
                    border: `1px solid ${theme.accentBorder}`,
                    marginBottom: '24px',
                    background: theme.accentDim,
                  }}>
                    {step.duration}
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: '24px',
                    fontWeight: 700,
                    color: isHovered ? theme.textPrimary : theme.textSecondary,
                    marginBottom: '16px',
                    transition: 'color 0.3s ease',
                  }}>{step.title}</h3>

                  {/* Description */}
                  <p style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: '16px',
                    lineHeight: 1.7,
                    color: theme.textTertiary,
                    maxWidth: '340px',
                  }}>{step.description}</p>

                  {/* Arrow connector (between steps, mobile hidden) */}
                  {index < steps.length - 1 && (
                    <div
                      className="hiw-arrow"
                      style={{
                        position: 'absolute',
                        top: '52px',
                        left: `${(index + 1) * 33.33}%`,
                        transform: 'translateX(-50%)',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: theme.bgSecondary,
                        border: `1px solid ${theme.borderPrimary}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: theme.accent,
                        zIndex: 2,
                      }}
                    >
                      <ChevronRight size={16} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="hiw-cta" style={{ textAlign: 'center', marginTop: '80px' }}>
          <InteractiveHoverButton
            text="Book a Call"
            variant="primary"
            href="https://calendly.com/jojishiotsuki0/30min"
            style={{ display: 'inline-flex' }}
          />
        </div>
      </div>

    </section>
  );
};

export default HowItWorks;
