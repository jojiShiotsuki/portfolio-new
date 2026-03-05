import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const carouselImages = [
  {
    src: '/pundok-google-ranking.png',
    alt: 'Pundok Studios ranking #1 on Google search results',
  },
  {
    src: '/pundok-screenshot.png',
    alt: 'Pundok Studios website homepage',
  },
];

const stats = [
  { value: '#1', label: 'Google Ranking' },
  { value: '60%', label: 'More Walk-ins' },
  { value: 'More', label: 'Inquiries & Bookings' },
  { value: '100%', label: 'Client Satisfaction' },
];

const Results: React.FC = () => {
  const { theme } = useTheme();
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="results" style={{ padding: '160px 48px', background: theme.bgSecondary, position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header */}
        <div className="results-header" style={{ textAlign: 'center', marginBottom: '100px' }}>
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
            Proof
            <span style={{ width: '40px', height: '1px', background: theme.accent }} />
          </div>
          <h2 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-2px',
            color: theme.textPrimary,
          }}>
            Results That<br />
            <span style={{ color: 'transparent', WebkitTextStroke: `2px ${theme.headingStroke}` }}>Speak</span>
          </h2>
        </div>

        {/* Case Study 1: Pundok Studios */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '80px',
          alignItems: 'center',
          marginBottom: '120px',
        }} className="results-case-study">
          {/* Image carousel */}
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            border: `1px solid ${theme.borderPrimary}`,
          }}>
            <div style={{ position: 'relative' }}>
              {carouselImages.map((img, index) => (
                <img
                  key={index}
                  src={img.src}
                  alt={img.alt}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    position: index === 0 ? 'relative' : 'absolute',
                    top: 0,
                    left: 0,
                    opacity: currentSlide === index ? 1 : 0,
                    pointerEvents: currentSlide === index ? 'auto' : 'none',
                    transition: 'opacity 0.5s ease',
                  }}
                />
              ))}
            </div>
            {/* Carousel controls */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <button
                style={{
                  background: theme.bgPrimary,
                  border: `1px solid ${theme.borderPrimary}`,
                  color: theme.textSecondary,
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                }}
                onClick={() => setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)}
                aria-label="Previous image"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                style={{
                  background: theme.bgPrimary,
                  border: `1px solid ${theme.borderPrimary}`,
                  color: theme.textSecondary,
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                }}
                onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselImages.length)}
                aria-label="Next image"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: theme.accent,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}>Case Study 01</div>

            <h3 style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              color: theme.textPrimary,
              letterSpacing: '-1px',
              marginBottom: '24px',
              lineHeight: 1.1,
            }}>Pundok Studios</h3>

            <p style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: '17px',
              lineHeight: 1.8,
              color: theme.textSecondary,
              marginBottom: '32px',
            }}>
              A local barbershop that wasn't showing up on Google. We built them a professional website and optimised it for search.
            </p>

            <div style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: '28px',
              fontWeight: 800,
              color: theme.accent,
              marginBottom: '8px',
            }}>#1 on Google</div>
            <p style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: '15px',
              color: theme.textTertiary,
              marginBottom: '40px',
            }}>Walk-ins and bookings increased by 60%</p>

            {/* Testimonial */}
            <div style={{
              borderLeft: `2px solid ${theme.accent}`,
              paddingLeft: '20px',
              marginBottom: '40px',
            }}>
              <p style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: '15px',
                lineHeight: 1.8,
                color: theme.textTertiary,
                fontStyle: 'italic',
              }}>
                "Customers tell us they found us on Google — that never used to happen. Best investment we've made for the business."
              </p>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: theme.textMuted,
                marginTop: '12px',
              }}>Jay the Barber</div>
            </div>

            <a
              href="https://pundokstudios.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: theme.textPrimary,
                textDecoration: 'none',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 0',
                borderBottom: `1px solid ${theme.borderHover}`,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.accent;
                e.currentTarget.style.borderColor = theme.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.textPrimary;
                e.currentTarget.style.borderColor = theme.borderHover;
              }}
            >
              View Live Site <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        {/* Case Study 2: You% Nutrition — reversed */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '80px',
          alignItems: 'center',
          marginBottom: '120px',
        }} className="results-case-study">
          {/* Content */}
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: theme.accent,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}>Case Study 02</div>

            <h3 style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              color: theme.textPrimary,
              letterSpacing: '-1px',
              marginBottom: '24px',
              lineHeight: 1.1,
            }}>You% Nutrition</h3>

            <p style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: '17px',
              lineHeight: 1.8,
              color: theme.textSecondary,
              marginBottom: '32px',
            }}>
              A health & wellness business with a basic website that had poor usability — no clear booking buttons and low online exposure.
            </p>

            <div style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: '28px',
              fontWeight: 800,
              color: theme.accent,
              marginBottom: '8px',
            }}>More Bookings</div>
            <p style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: '15px',
              color: theme.textTertiary,
              marginBottom: '40px',
            }}>Increased Google visibility, inquiries from local & international clients</p>

            {/* Testimonial */}
            <div style={{
              borderLeft: `2px solid ${theme.accent}`,
              paddingLeft: '20px',
              marginBottom: '40px',
            }}>
              <p style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: '15px',
                lineHeight: 1.8,
                color: theme.textTertiary,
                fontStyle: 'italic',
              }}>
                "They know their stuff but also learn about your business so they can project what you hope to achieve."
              </p>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: theme.textMuted,
                marginTop: '12px',
              }}>Owner, You% Nutrition</div>
            </div>

            <a
              href="https://youpercent.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: theme.textPrimary,
                textDecoration: 'none',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 0',
                borderBottom: `1px solid ${theme.borderHover}`,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.accent;
                e.currentTarget.style.borderColor = theme.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.textPrimary;
                e.currentTarget.style.borderColor = theme.borderHover;
              }}
            >
              View Live Site <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Image */}
          <div style={{
            overflow: 'hidden',
            border: `1px solid ${theme.borderPrimary}`,
          }}>
            <img
              src="/youpercent-screenshot.png"
              alt="You% Nutrition website"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>

        {/* Ongoing Project — inline */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '40px 0',
          borderTop: `1px solid ${theme.borderPrimary}`,
          borderBottom: `1px solid ${theme.borderPrimary}`,
          marginBottom: '80px',
        }} className="results-ongoing">
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: theme.accent,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              Ongoing
              <span style={{
                width: '6px',
                height: '6px',
                background: theme.accent,
                borderRadius: '50%',
                animation: 'pulse 2s infinite',
              }} />
            </div>
            <h3 style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: '28px',
              fontWeight: 800,
              color: theme.textPrimary,
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
            }}>US Roofing Company</h3>
          </div>
          <p style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: '16px',
            color: theme.textSecondary,
            maxWidth: '400px',
            lineHeight: 1.7,
            textAlign: 'right',
          }}>
            Website maintenance, development, and managing their digital presence.
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '48px',
        }} className="results-stats-grid">
          {stats.map((stat, index) => {
            const isHovered = hoveredStat === index;
            return (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  cursor: 'default',
                }}
                onMouseEnter={() => setHoveredStat(index)}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 'clamp(36px, 5vw, 56px)',
                  fontWeight: 800,
                  color: isHovered ? theme.accent : theme.textPrimary,
                  lineHeight: 1,
                  marginBottom: '12px',
                  transition: 'color 0.3s ease',
                }}>{stat.value}</div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  color: theme.textMuted,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}>{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 968px) {
          .results-case-study {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .results-ongoing {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
          .results-ongoing p {
            text-align: left !important;
          }
        }
        @media (max-width: 768px) {
          #results { padding: 64px 20px !important; }
          .results-header { margin-bottom: 48px !important; }
          .results-case-study { margin-bottom: 60px !important; }
          .results-ongoing { margin-bottom: 40px !important; padding: 24px 0 !important; }
          .results-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 480px) {
          #results { padding: 48px 16px !important; }
          .results-header { margin-bottom: 40px !important; }
          .results-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Results;
