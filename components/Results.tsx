import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const carouselImages = [
  {
    src: '/pundok-google-ranking.png',
    alt: 'Pundok Studios ranking #1 on Google search results',
    caption: 'Google search results showing Pundok Studios ranking for "premium barbershop in cebu"',
  },
  {
    src: '/pundok-screenshot.png',
    alt: 'Pundok Studios website homepage',
    caption: 'The Pundok Studios website we built — clean, professional, and optimised for conversions',
  },
];

const Results: React.FC = () => {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const sectionStyle: React.CSSProperties = {
    padding: '160px 48px',
    background: '#0f0f0f',
    position: 'relative',
    overflow: 'hidden',
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

  const caseStudyStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '60px',
    marginBottom: '48px',
    alignItems: 'center',
  };

  const imageContainerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: '#141414',
    border: '1px solid rgba(0, 240, 255, 0.1)',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    display: 'block',
    transition: 'opacity 0.5s ease',
  };

  const captionStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '11px',
    color: 'rgba(245, 240, 232, 0.5)',
    letterSpacing: '1px',
    padding: '16px 24px',
    background: 'rgba(0, 240, 255, 0.03)',
    borderTop: '1px solid rgba(0, 240, 255, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const carouselBtnStyle: React.CSSProperties = {
    background: 'transparent',
    border: '1px solid rgba(0, 240, 255, 0.3)',
    color: '#00F0FF',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    padding: 0,
    flexShrink: 0,
  };

  const dotStyle = (isActive: boolean): React.CSSProperties => ({
    width: isActive ? '24px' : '8px',
    height: '8px',
    background: isActive ? '#00F0FF' : 'rgba(245, 240, 232, 0.2)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: 'none',
    padding: 0,
  });

  const caseStudyContentStyle: React.CSSProperties = {
    padding: '0',
  };

  const caseStudyLabelStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '11px',
    color: '#FF6B4A',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: '16px',
  };

  const caseStudyTitleStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(28px, 4vw, 40px)',
    fontWeight: 800,
    color: '#f5f0e8',
    letterSpacing: '-1px',
    marginBottom: '24px',
    lineHeight: 1.1,
  };

  const detailStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: '16px',
    lineHeight: 1.8,
    color: 'rgba(245, 240, 232, 0.5)',
    marginBottom: '12px',
  };

  const detailLabelStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '11px',
    color: '#00F0FF',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginRight: '8px',
  };

  const resultHighlightStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: '18px',
    fontWeight: 700,
    color: '#00F0FF',
    marginTop: '24px',
    padding: '20px 24px',
    background: 'rgba(0, 240, 255, 0.05)',
    border: '1px solid rgba(0, 240, 255, 0.15)',
  };

  const testimonialStyle: React.CSSProperties = {
    padding: '40px 48px',
    background: 'rgba(0, 240, 255, 0.03)',
    border: '1px solid rgba(0, 240, 255, 0.1)',
    marginBottom: '48px',
    position: 'relative',
  };

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '2px',
    background: 'rgba(245, 240, 232, 0.1)',
    marginTop: '48px',
  };

  const statCardStyle = (isHovered: boolean): React.CSSProperties => ({
    background: isHovered ? '#141414' : '#0a0a0a',
    padding: '48px 32px',
    textAlign: 'center',
    transition: 'all 0.4s ease',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden',
  });

  const statValueStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(32px, 4vw, 48px)',
    fontWeight: 800,
    color: '#00F0FF',
    lineHeight: 1,
    marginBottom: '16px',
  };

  const statLabelStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '11px',
    color: 'rgba(245, 240, 232, 0.5)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    lineHeight: 1.6,
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

  const caseStudy2Style: React.CSSProperties = {
    padding: '48px',
    background: 'rgba(245, 240, 232, 0.02)',
    border: '1px solid rgba(245, 240, 232, 0.08)',
    marginBottom: '0',
  };

  const stats = [
    { value: '#1', label: 'Google\nRanking\nAchieved' },
    { value: '60%', label: 'More\nWalk-ins &\nBookings' },
    { value: 'More', label: 'Inquiries\n& Bookings\nGenerated' },
    { value: '100%', label: 'Client\nSatisfaction' },
  ];

  return (
    <section id="results" style={sectionStyle}>
      <div style={containerStyle}>
        <div style={labelStyle}>
          <span style={{ width: '40px', height: '1px', background: '#00F0FF' }} />
          Proof
        </div>
        <h2 style={titleStyle}>
          Results That<br />
          <span style={{ color: '#00F0FF' }}>Speak</span>
        </h2>

        {/* Case Study 1: Pundok Studios */}
        <div style={caseStudyStyle} className="results-case-study">
          <div style={imageContainerStyle}>
            {/* Carousel images */}
            <div style={{ position: 'relative' }}>
              {carouselImages.map((img, index) => (
                <img
                  key={index}
                  src={img.src}
                  alt={img.alt}
                  style={{
                    ...imageStyle,
                    position: index === 0 ? 'relative' : 'absolute',
                    top: 0,
                    left: 0,
                    opacity: currentSlide === index ? 1 : 0,
                    pointerEvents: currentSlide === index ? 'auto' : 'none',
                  }}
                />
              ))}
            </div>
            <div style={captionStyle}>
              <span style={{ flex: 1 }}>{carouselImages[currentSlide].caption}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px' }}>
                <button
                  style={carouselBtnStyle}
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 240, 255, 0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={16} />
                </button>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      style={dotStyle(currentSlide === index)}
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  style={carouselBtnStyle}
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselImages.length)}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 240, 255, 0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  aria-label="Next image"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div style={caseStudyContentStyle}>
            <div style={caseStudyLabelStyle}>Case Study</div>
            <h3 style={caseStudyTitleStyle}>Pundok Studios</h3>

            <div style={detailStyle}>
              <span style={detailLabelStyle}>Client:</span>
              Pundok Studios (Local Barbershop)
            </div>
            <div style={detailStyle}>
              <span style={detailLabelStyle}>Challenge:</span>
              Not showing up on Google when customers searched for them
            </div>
            <div style={resultHighlightStyle}>
              Ranked #1 in organic search for "premium barbershop in Cebu" — walk-ins and bookings increased by 60%
            </div>

            <div style={{ marginTop: '24px' }}>
              <a
                href="https://pundokstudios.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '11px',
                  color: '#f5f0e8',
                  textDecoration: 'none',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(245, 240, 232, 0.2)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#00F0FF';
                  e.currentTarget.style.borderColor = '#00F0FF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#f5f0e8';
                  e.currentTarget.style.borderColor = 'rgba(245, 240, 232, 0.2)';
                }}
              >
                View Live Site <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div style={testimonialStyle} className="results-testimonial">
          <Quote size={32} style={{ color: 'rgba(0, 240, 255, 0.2)', marginBottom: '20px' }} />
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '20px',
            lineHeight: 1.8,
            color: 'rgba(245, 240, 232, 0.7)',
            fontStyle: 'italic',
            marginBottom: '24px',
          }}>
            Since Joji built our website and got us ranking on Google, we've seen a real increase in walk-ins and online bookings. Customers tell us they found us on Google — that never used to happen. Best investment we've made for the business.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '1px',
              background: '#FF6B4A',
            }} />
            <div>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '16px',
                fontWeight: 700,
                color: '#f5f0e8',
              }}>
                Jay the Barber
              </div>
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '11px',
                color: '#FF6B4A',
                letterSpacing: '1px',
              }}>
                Pundok Studios
              </div>
            </div>
          </div>
        </div>

        {/* Case Study 2: You% Nutrition */}
        <div style={{ ...caseStudyStyle, gridTemplateColumns: '1fr 1.2fr' }} className="results-case-study">
          <div style={caseStudyContentStyle}>
            <div style={caseStudyLabelStyle}>Case Study</div>
            <h3 style={caseStudyTitleStyle}>You% Nutrition</h3>

            <div style={detailStyle}>
              <span style={detailLabelStyle}>Client:</span>
              You% Nutrition (Health & Wellness Business)
            </div>
            <div style={detailStyle}>
              <span style={detailLabelStyle}>Challenge:</span>
              Website was too simple with poor usability — no clear booking buttons, limited pages, and low online exposure
            </div>
            <div style={resultHighlightStyle}>
              Increased Google visibility and generated more inquiries & bookings (local + international)
            </div>

            <div style={{ marginTop: '24px' }}>
              <a
                href="https://youpercent.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '11px',
                  color: '#f5f0e8',
                  textDecoration: 'none',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(245, 240, 232, 0.2)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#00F0FF';
                  e.currentTarget.style.borderColor = '#00F0FF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#f5f0e8';
                  e.currentTarget.style.borderColor = 'rgba(245, 240, 232, 0.2)';
                }}
              >
                View Live Site <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          <div style={imageContainerStyle}>
            <img
              src="/youpercent-screenshot.png"
              alt="You% Nutrition website"
              style={imageStyle}
            />
            <div style={captionStyle}>
              <span style={{ flex: 1 }}>The You% Nutrition website — redesigned for better usability and conversions</span>
            </div>
          </div>
        </div>

        {/* You% Nutrition Testimonial */}
        <div style={testimonialStyle} className="results-testimonial">
          <Quote size={32} style={{ color: 'rgba(0, 240, 255, 0.2)', marginBottom: '20px' }} />
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '20px',
            lineHeight: 1.8,
            color: 'rgba(245, 240, 232, 0.7)',
            fontStyle: 'italic',
            marginBottom: '24px',
          }}>
            We had more inquiries and bookings due to the reach. They know their stuff but also learn about your business so they can project what you hope to achieve.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '1px',
              background: '#FF6B4A',
            }} />
            <div>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '16px',
                fontWeight: 700,
                color: '#f5f0e8',
              }}>
                Owner
              </div>
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '11px',
                color: '#FF6B4A',
                letterSpacing: '1px',
              }}>
                You% Nutrition
              </div>
            </div>
          </div>
        </div>

        {/* Case Study 3: US Roofing Company */}
        <div style={caseStudy2Style}>
          <div style={caseStudyLabelStyle}>Ongoing Project</div>
          <h3 style={{ ...caseStudyTitleStyle, fontSize: 'clamp(24px, 3vw, 32px)' }}>
            US Roofing Company
          </h3>
          <div style={detailStyle}>
            <span style={detailLabelStyle}>Work:</span>
            Website maintenance, development, and digital presence
          </div>
          <div style={detailStyle}>
            <span style={detailLabelStyle}>Result:</span>
            Currently managing their online presence and web applications
          </div>
        </div>

        {/* Key Stats */}
        <div style={statsGridStyle} className="results-stats-grid">
          {stats.map((stat, index) => (
            <div
              key={index}
              style={statCardStyle(hoveredStat === index) as React.CSSProperties}
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div style={statValueStyle}>{stat.value}</div>
              <div style={statLabelStyle}>{stat.label}</div>
              <div style={accentLineStyle(hoveredStat === index)} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 968px) {
          .results-case-study {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 768px) {
          #results { padding: 80px 24px !important; }
          .results-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .results-testimonial {
            padding: 32px 24px !important;
          }
        }
        @media (max-width: 480px) {
          #results { padding: 60px 16px !important; }
          .results-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Results;
