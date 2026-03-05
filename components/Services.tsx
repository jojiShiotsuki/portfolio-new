import React, { useState } from 'react';
import { SERVICES } from '../constants';
import { useTheme } from '../ThemeContext';
import { ArrowRight } from 'lucide-react';

const serviceBenefits: Record<string, string[]> = {
  websites: ['Mobile-responsive design', 'Fast page load speeds', 'Conversion-optimised layouts'],
  seo: ['Local SEO optimisation', 'Google Business Profile setup', 'Keyword strategy & content'],
  maintenance: ['Monthly updates & fixes', 'Performance monitoring', 'Priority support'],
};

const Services: React.FC = () => {
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const { theme } = useTheme();

  return (
    <section id="services" style={{ padding: '160px 48px', position: 'relative' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header - centered */}
        <div className="services-header" style={{ textAlign: 'center', marginBottom: '100px' }}>
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
            Services
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
            What I Build<br />
            <span style={{ color: 'transparent', WebkitTextStroke: `2px ${theme.headingStroke}` }}>for Tradies</span>
          </h2>
          <p style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: '20px',
            lineHeight: 1.7,
            color: theme.textSecondary,
            maxWidth: '500px',
            margin: '0 auto',
          }}>
            Everything you need to get found on Google and turn visitors into paying customers.
          </p>
        </div>

        {/* Services list */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {SERVICES.map((service, index) => {
            const isHovered = hoveredService === service.id;
            const num = `0${index + 1}`;
            const benefits = serviceBenefits[service.id] || [];

            return (
              <div
                key={service.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr 1fr',
                  gap: '48px',
                  alignItems: 'start',
                  padding: '60px 0',
                  borderTop: `1px solid ${theme.borderPrimary}`,
                  cursor: 'default',
                  transition: 'all 0.3s ease',
                }}
                className="services-row"
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                {/* Number */}
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  color: isHovered ? theme.accent : theme.textMuted,
                  paddingTop: '4px',
                  transition: 'color 0.3s ease',
                }}>{num}</div>

                {/* Title + description */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isHovered ? theme.accent : theme.accentDim,
                      color: isHovered ? theme.btnPrimaryText : theme.accent,
                      transition: 'all 0.3s ease',
                      flexShrink: 0,
                    }}>
                      <service.icon size={22} />
                    </div>
                    <h3 style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: '28px',
                      fontWeight: 800,
                      color: theme.textPrimary,
                      letterSpacing: '-0.5px',
                      lineHeight: 1.1,
                    }}>{service.title}</h3>
                  </div>
                  <p style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: '16px',
                    lineHeight: 1.8,
                    color: theme.textSecondary,
                    maxWidth: '480px',
                  }}>{service.description}</p>
                </div>

                {/* Benefits */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '4px' }}>
                  {benefits.map((benefit, i) => (
                    <div key={i} style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '12px',
                      color: isHovered ? theme.accent : theme.textTertiary,
                      letterSpacing: '1px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'color 0.3s ease',
                    }}>
                      <ArrowRight size={12} />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {/* Bottom border */}
          <div style={{ borderTop: `1px solid ${theme.borderPrimary}` }} />
        </div>
      </div>

      <style>{`
        @media (max-width: 968px) {
          .services-row {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .services-row > div:first-child {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          #services { padding: 64px 20px !important; }
          .services-header { margin-bottom: 48px !important; }
          .services-row { padding: 32px 0 !important; }
        }
        @media (max-width: 480px) {
          #services { padding: 48px 16px !important; }
          .services-header { margin-bottom: 40px !important; }
        }
      `}</style>
    </section>
  );
};

export default Services;
