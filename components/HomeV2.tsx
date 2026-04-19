import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowRight,
  MapPin,
  Globe2,
  Languages,
  CalendarClock,
  CircleDot,
  Star,
  Quote,
  Search,
  PhoneCall,
  Rocket,
  Mail,
} from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { PERSONAL_INFO, SERVICES, PROJECTS, EXPERIENCE } from '../constants';
import { InteractiveHoverButton } from './ui/interactive-hover-button';

// --- Shared text styles ---
const fontMono = "'JetBrains Mono', monospace";
const fontDisplay = "'Bricolage Grotesque', sans-serif";
const fontBody = "'Instrument Sans', sans-serif";

// =============================================================================
// HERO V2 — Magazine split with bento info tiles
// =============================================================================

const HeroV2: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section
      id="home-v2"
      aria-label="Hero introduction"
      className="homev2-hero"
      style={{
        padding: '160px 48px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Top label row */}
        <div
          className="homev2-hero-label"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '56px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div
            style={{
              fontFamily: fontMono,
              fontSize: '11px',
              color: theme.accent,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ width: '32px', height: '1px', background: theme.accent }} />
            ISSUE 002 — Editorial
          </div>
          <div
            style={{
              fontFamily: fontMono,
              fontSize: '11px',
              color: theme.textTertiary,
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            {PERSONAL_INFO.location}
          </div>
        </div>

        {/* Main split */}
        <div
          className="homev2-hero-split"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: '64px',
            alignItems: 'flex-end',
          }}
        >
          {/* Left: editorial headline */}
          <div>
            <p
              style={{
                fontFamily: fontBody,
                fontSize: '20px',
                lineHeight: 1.5,
                color: theme.textSecondary,
                marginBottom: '32px',
                fontStyle: 'italic',
              }}
            >
              Joji Shiotsuki, an independent web developer working with{' '}
              <span style={{ color: theme.accent, fontWeight: 600, fontStyle: 'normal' }}>
                service businesses
              </span>{' '}
              across the Philippines and the United States.
            </p>

            <h1
              className="homev2-hero-h1"
              style={{
                fontFamily: fontDisplay,
                fontSize: 'clamp(56px, 9vw, 132px)',
                fontWeight: 800,
                lineHeight: 0.92,
                letterSpacing: '-4px',
                color: theme.textPrimary,
                marginBottom: '40px',
              }}
            >
              I help local
              <br />
              shops get
              <br />
              <span style={{ color: theme.accent, fontStyle: 'italic', fontWeight: 700 }}>
                found.
              </span>
            </h1>

            <p
              style={{
                fontFamily: fontBody,
                fontSize: '17px',
                lineHeight: 1.7,
                color: theme.textSecondary,
                maxWidth: '540px',
                marginBottom: '40px',
              }}
            >
              Websites and SEO for barbershops, salons, clinics, cafes, and the rest of the trades that
              actually make their towns run. Fewer slogans, more bookings.
            </p>

            <div
              className="homev2-hero-cta"
              style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
            >
              <InteractiveHoverButton
                text="Start a project"
                variant="primary"
                href="https://calendly.com/jojishiotsuki0/30min"
              />
              <InteractiveHoverButton
                text="Read case studies"
                variant="outline"
                href="#homev2-results"
              />
            </div>
          </div>

          {/* Right: bento info tiles */}
          <div
            className="homev2-hero-bento"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}
          >
            <BentoTile
              theme={theme}
              icon={<CircleDot size={14} />}
              label="Status"
              value="Available"
              accent
            />
            <BentoTile
              theme={theme}
              icon={<MapPin size={14} />}
              label="Based in"
              value="Cebu, PH"
            />
            <BentoTile
              theme={theme}
              icon={<Globe2 size={14} />}
              label="Working in"
              value="PH + US"
            />
            <BentoTile
              theme={theme}
              icon={<CalendarClock size={14} />}
              label="Lead time"
              value="2 weeks"
            />
            <div
              style={{
                gridColumn: '1 / -1',
                padding: '24px',
                background: theme.bgSecondary,
                border: `1px solid ${theme.borderPrimary}`,
                borderRadius: '2px',
              }}
            >
              <div
                style={{
                  fontFamily: fontMono,
                  fontSize: '10px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: theme.textMuted,
                  marginBottom: '12px',
                }}
              >
                Currently shipping
              </div>
              <div
                style={{
                  fontFamily: fontDisplay,
                  fontSize: '18px',
                  fontWeight: 700,
                  color: theme.textPrimary,
                  lineHeight: 1.3,
                  marginBottom: '8px',
                }}
              >
                US Roofing Co. + new Cebu salon site
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: fontMono,
                  fontSize: '11px',
                  color: theme.accent,
                  letterSpacing: '1px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    background: theme.accent,
                    borderRadius: '50%',
                    animation: 'pulse-dot 2s infinite',
                  }}
                />
                LIVE
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BentoTile: React.FC<{
  theme: ReturnType<typeof useTheme>['theme'];
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}> = ({ theme, icon, label, value, accent }) => (
  <div
    style={{
      padding: '20px',
      background: accent ? theme.accentDim : theme.bgSecondary,
      border: `1px solid ${accent ? theme.accent : theme.borderPrimary}`,
      borderRadius: '2px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      minHeight: '108px',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontFamily: fontMono,
        fontSize: '10px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: accent ? theme.accent : theme.textMuted,
      }}
    >
      <span style={{ display: 'inline-flex' }}>{icon}</span>
      {label}
    </div>
    <div
      style={{
        fontFamily: fontDisplay,
        fontSize: '20px',
        fontWeight: 700,
        color: theme.textPrimary,
        letterSpacing: '-0.5px',
      }}
    >
      {value}
    </div>
  </div>
);

// =============================================================================
// MARQUEE — Industries strip
// =============================================================================

const MarqueeV2: React.FC = () => {
  const { theme } = useTheme();
  const items = [
    'Barbershops',
    'Salons',
    'Clinics',
    'Cafes',
    'Restaurants',
    'Gyms',
    'Spas',
    'Studios',
    'Roofers',
    'Plumbers',
    'Electricians',
    'Cleaners',
  ];

  return (
    <section
      aria-label="Industries served"
      style={{
        padding: '40px 0',
        background: theme.bgSecondary,
        borderTop: `1px solid ${theme.borderPrimary}`,
        borderBottom: `1px solid ${theme.borderPrimary}`,
        overflow: 'hidden',
      }}
    >
      <div
        className="homev2-marquee"
        style={{
          display: 'flex',
          gap: '64px',
          whiteSpace: 'nowrap',
          animation: 'homev2-marquee-scroll 40s linear infinite',
          willChange: 'transform',
        }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: fontDisplay,
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 800,
              color: i % 2 === 0 ? theme.textPrimary : 'transparent',
              WebkitTextStroke: i % 2 === 0 ? 'unset' : `1.5px ${theme.headingStroke}`,
              letterSpacing: '-1px',
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '64px',
            }}
          >
            {item}
            <span
              aria-hidden
              style={{
                width: '12px',
                height: '12px',
                background: theme.accent,
                borderRadius: '50%',
                display: 'inline-block',
              }}
            />
          </span>
        ))}
      </div>
    </section>
  );
};

// =============================================================================
// BENTO RESULTS — Asymmetric stats grid
// =============================================================================

const BentoResultsV2: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section
      id="homev2-results"
      aria-label="Results"
      style={{
        padding: '120px 48px',
        background: theme.bgPrimary,
      }}
      className="homev2-section"
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <SectionHeader
          theme={theme}
          eyebrow="Proof"
          title="Results"
          subtitle="Numbers from real service businesses I've built and ranked."
          align="left"
        />

        <div
          className="homev2-bento-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridAutoRows: 'minmax(180px, auto)',
            gap: '12px',
          }}
        >
          {/* Big tile: Pundok */}
          <div
            style={{
              gridColumn: 'span 2',
              gridRow: 'span 2',
              background: theme.bgSecondary,
              border: `1px solid ${theme.borderPrimary}`,
              borderRadius: '2px',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
            className="homev2-bento-pundok"
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 10',
                overflow: 'hidden',
                background: theme.bgTertiary,
              }}
            >
              <img
                src="/pundok-google-ranking.webp"
                alt="Pundok Studios ranking #1 on Google"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  padding: '6px 12px',
                  background: theme.bgPrimary,
                  border: `1px solid ${theme.accent}`,
                  fontFamily: fontMono,
                  fontSize: '10px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: theme.accent,
                }}
              >
                Case 01 — Pundok
              </div>
            </div>
            <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  fontFamily: fontDisplay,
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  fontWeight: 800,
                  letterSpacing: '-1.5px',
                  lineHeight: 1.05,
                  color: theme.textPrimary,
                  marginBottom: '16px',
                }}
              >
                #1 on Google for{' '}
                <span style={{ color: theme.accent, fontStyle: 'italic' }}>"barbershop Cebu"</span>
              </div>
              <p
                style={{
                  fontFamily: fontBody,
                  fontSize: '15px',
                  lineHeight: 1.6,
                  color: theme.textSecondary,
                  marginTop: 'auto',
                }}
              >
                A premium barbershop with a 4.9 rating but no online presence. Ranked #1 in 6 months.
                Walk-ins up 60%.
              </p>
            </div>
          </div>

          {/* Stat tiles */}
          <StatTile theme={theme} value="60%" label="More walk-ins" />
          <StatTile theme={theme} value="340%" label="Profile views" />
          <StatTile theme={theme} value="#1" label="Cebu City" />
          <StatTile theme={theme} value="2024" label="Active since" />

          {/* Quote tile */}
          <div
            style={{
              gridColumn: 'span 2',
              background: theme.accentDim,
              border: `1px solid ${theme.accent}`,
              borderRadius: '2px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
            className="homev2-bento-quote"
          >
            <Quote size={28} style={{ color: theme.accent }} />
            <p
              style={{
                fontFamily: fontDisplay,
                fontSize: 'clamp(18px, 2vw, 22px)',
                fontWeight: 600,
                lineHeight: 1.4,
                color: theme.textPrimary,
                letterSpacing: '-0.5px',
                fontStyle: 'italic',
              }}
            >
              "We went from hoping customers would find us to having a waitlist."
            </p>
            <div
              style={{
                fontFamily: fontMono,
                fontSize: '11px',
                color: theme.textTertiary,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginTop: 'auto',
              }}
            >
              Harley · Pundok Studios
            </div>
          </div>

          {/* You% mini case */}
          <div
            style={{
              gridColumn: 'span 4',
              background: theme.bgSecondary,
              border: `1px solid ${theme.borderPrimary}`,
              borderRadius: '2px',
              padding: '32px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '32px',
              alignItems: 'center',
            }}
            className="homev2-bento-youpercent"
          >
            <div>
              <div
                style={{
                  fontFamily: fontMono,
                  fontSize: '11px',
                  color: theme.accent,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                Case 02 — You% Nutrition
              </div>
              <div
                style={{
                  fontFamily: fontDisplay,
                  fontSize: '24px',
                  fontWeight: 800,
                  color: theme.textPrimary,
                  letterSpacing: '-0.5px',
                  lineHeight: 1.15,
                }}
              >
                #1 for "nutritionist in Cebu City"
              </div>
            </div>
            <p
              style={{
                fontFamily: fontBody,
                fontSize: '15px',
                lineHeight: 1.7,
                color: theme.textSecondary,
              }}
            >
              Pro-bono build for a friend, then 3 months of SEO. Now ranking for the most competitive
              local terms — and booking virtual consultations from international clients.
            </p>
            <a
              href="https://youpercent.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: fontMono,
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
                justifySelf: 'end',
                cursor: 'pointer',
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
              Visit site <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatTile: React.FC<{
  theme: ReturnType<typeof useTheme>['theme'];
  value: string;
  label: string;
}> = ({ theme, value, label }) => (
  <div
    style={{
      background: theme.bgSecondary,
      border: `1px solid ${theme.borderPrimary}`,
      borderRadius: '2px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '180px',
      transition: 'border-color 0.3s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = theme.accent;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = theme.borderPrimary;
    }}
  >
    <div
      style={{
        fontFamily: fontDisplay,
        fontSize: 'clamp(40px, 5vw, 64px)',
        fontWeight: 800,
        color: theme.textPrimary,
        lineHeight: 1,
        letterSpacing: '-2px',
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontFamily: fontMono,
        fontSize: '11px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: theme.textMuted,
      }}
    >
      {label}
    </div>
  </div>
);

// =============================================================================
// SHARED Section Header
// =============================================================================

const SectionHeader: React.FC<{
  theme: ReturnType<typeof useTheme>['theme'];
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}> = ({ theme, eyebrow, title, subtitle, align = 'left' }) => (
  <div
    style={{
      textAlign: align,
      marginBottom: '64px',
      maxWidth: align === 'center' ? '700px' : 'none',
      margin: align === 'center' ? '0 auto 64px' : '0 0 64px',
    }}
  >
    <div
      style={{
        fontFamily: fontMono,
        fontSize: '11px',
        color: theme.accent,
        letterSpacing: '4px',
        textTransform: 'uppercase',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        gap: '12px',
      }}
    >
      <span style={{ width: '32px', height: '1px', background: theme.accent }} />
      {eyebrow}
    </div>
    <h2
      style={{
        fontFamily: fontDisplay,
        fontSize: 'clamp(36px, 5vw, 64px)',
        fontWeight: 800,
        lineHeight: 1,
        letterSpacing: '-2px',
        color: theme.textPrimary,
        marginBottom: subtitle ? '20px' : 0,
      }}
    >
      {title}
    </h2>
    {subtitle && (
      <p
        style={{
          fontFamily: fontBody,
          fontSize: '18px',
          lineHeight: 1.6,
          color: theme.textSecondary,
          maxWidth: '560px',
          margin: align === 'center' ? '0 auto' : 0,
        }}
      >
        {subtitle}
      </p>
    )}
  </div>
);

// =============================================================================
// SERVICES V2 — 3-up icon cards
// =============================================================================

const ServicesV2: React.FC = () => {
  const { theme } = useTheme();
  const [hovered, setHovered] = useState<string | null>(null);

  const benefits: Record<string, string[]> = {
    websites: ['Mobile-first', 'Fast loading', 'Conversion-focused'],
    seo: ['Local rankings', 'Google Business', 'Content strategy'],
    maintenance: ['Monthly updates', 'Monitoring', 'Priority support'],
  };

  return (
    <section
      aria-label="Services"
      style={{
        padding: '120px 48px',
        background: theme.bgSecondary,
      }}
      className="homev2-section"
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <SectionHeader
          theme={theme}
          eyebrow="Services"
          title="Three things, done well."
          subtitle="No agency padding. Just websites, rankings, and the maintenance that keeps both running."
        />

        <div
          className="homev2-services-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
          }}
        >
          {SERVICES.map((service, idx) => {
            const isHovered = hovered === service.id;
            return (
              <div
                key={service.id}
                onMouseEnter={() => setHovered(service.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: theme.bgPrimary,
                  border: `1px solid ${isHovered ? theme.accent : theme.borderPrimary}`,
                  borderRadius: '2px',
                  padding: '40px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  position: 'relative',
                  transition: 'border-color 0.3s ease',
                  minHeight: '420px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isHovered ? theme.accent : theme.accentDim,
                      color: isHovered ? theme.btnPrimaryText : theme.accent,
                      transition: 'all 0.3s ease',
                      borderRadius: '2px',
                    }}
                  >
                    <service.icon size={24} />
                  </div>
                  <div
                    style={{
                      fontFamily: fontMono,
                      fontSize: '11px',
                      color: theme.textMuted,
                      letterSpacing: '2px',
                    }}
                  >
                    0{idx + 1} / 03
                  </div>
                </div>

                <h3
                  style={{
                    fontFamily: fontDisplay,
                    fontSize: '24px',
                    fontWeight: 800,
                    color: theme.textPrimary,
                    letterSpacing: '-0.5px',
                    lineHeight: 1.15,
                  }}
                >
                  {service.title}
                </h3>

                <p
                  style={{
                    fontFamily: fontBody,
                    fontSize: '15px',
                    lineHeight: 1.65,
                    color: theme.textSecondary,
                  }}
                >
                  {service.description}
                </p>

                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '24px',
                    borderTop: `1px solid ${theme.borderPrimary}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {(benefits[service.id] || []).map((b, i) => (
                    <div
                      key={i}
                      style={{
                        fontFamily: fontMono,
                        fontSize: '11px',
                        color: isHovered ? theme.accent : theme.textTertiary,
                        letterSpacing: '1px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'color 0.3s ease',
                      }}
                    >
                      <ArrowRight size={11} />
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// PROCESS V2 — Vertical numbered list
// =============================================================================

const ProcessV2: React.FC = () => {
  const { theme } = useTheme();

  const steps = [
    {
      icon: Search,
      number: '01',
      title: 'Free audit',
      duration: '24 hours',
      description:
        "I look at your site (or lack of one) and tell you exactly what's killing your rankings.",
    },
    {
      icon: PhoneCall,
      number: '02',
      title: 'Strategy call',
      duration: '30 min',
      description:
        "We get on a call, I learn the business, and I give you a plan to rank and bring leads.",
    },
    {
      icon: Rocket,
      number: '03',
      title: 'Launch & rank',
      duration: '2 weeks',
      description:
        'New site shipped in two weeks. Google starts noticing. The phone starts ringing.',
    },
  ];

  return (
    <section
      aria-label="Process"
      style={{
        padding: '120px 48px',
        background: theme.bgPrimary,
      }}
      className="homev2-section"
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div
          className="homev2-process-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            gap: '80px',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <SectionHeader
              theme={theme}
              eyebrow="Process"
              title="Simple, on purpose."
              subtitle="Three steps from invisible to inbox-full. No surprise scope creep, no agency runaround."
            />
            <InteractiveHoverButton
              text="Book the call"
              variant="primary"
              href="https://calendly.com/jojishiotsuki0/30min"
            />
          </div>

          <div style={{ position: 'relative' }}>
            {steps.map((step, i) => {
              const Icon = step.icon;
              const last = i === steps.length - 1;
              return (
                <div
                  key={step.number}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr',
                    gap: '24px',
                    paddingBottom: last ? 0 : '40px',
                    position: 'relative',
                  }}
                >
                  {/* Number column with line */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: theme.accentDim,
                        border: `1px solid ${theme.accent}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: theme.accent,
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    {!last && (
                      <div
                        style={{
                          flex: 1,
                          width: '1px',
                          minHeight: '60px',
                          background: `linear-gradient(to bottom, ${theme.accent}, ${theme.borderPrimary})`,
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    style={{
                      paddingTop: '6px',
                      paddingBottom: last ? '6px' : '20px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '16px',
                        marginBottom: '12px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: fontMono,
                          fontSize: '12px',
                          color: theme.accent,
                          letterSpacing: '3px',
                        }}
                      >
                        {step.number}
                      </span>
                      <h3
                        style={{
                          fontFamily: fontDisplay,
                          fontSize: 'clamp(24px, 3vw, 36px)',
                          fontWeight: 800,
                          color: theme.textPrimary,
                          letterSpacing: '-1px',
                          lineHeight: 1.1,
                        }}
                      >
                        {step.title}
                      </h3>
                      <span
                        style={{
                          fontFamily: fontMono,
                          fontSize: '10px',
                          letterSpacing: '2px',
                          textTransform: 'uppercase',
                          color: theme.accent,
                          padding: '4px 10px',
                          border: `1px solid ${theme.accentBorder}`,
                          background: theme.accentDim,
                        }}
                      >
                        {step.duration}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: fontBody,
                        fontSize: '16px',
                        lineHeight: 1.65,
                        color: theme.textSecondary,
                        maxWidth: '500px',
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// PROJECTS V2 — Bento masonry of top 6 projects
// =============================================================================

const ProjectsV2: React.FC = () => {
  const { theme } = useTheme();
  const [hovered, setHovered] = useState<string | null>(null);

  const featured = PROJECTS.slice(0, 6);

  // Bento layout: tile sizes (col span / row span)
  const layout: { col: number; row: number }[] = [
    { col: 2, row: 2 }, // big - Vertex
    { col: 2, row: 1 }, // wide - KontentFire
    { col: 1, row: 1 }, // small - Pundok
    { col: 1, row: 1 }, // small - Knock Knock
    { col: 2, row: 1 }, // wide - Samantha
    { col: 2, row: 1 }, // wide - Trade Titans
  ];

  return (
    <section
      aria-label="Featured projects"
      style={{
        padding: '120px 48px',
        background: theme.bgSecondary,
      }}
      className="homev2-section"
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div
          className="homev2-projects-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '48px',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: fontMono,
                fontSize: '11px',
                color: theme.accent,
                letterSpacing: '4px',
                textTransform: 'uppercase',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ width: '32px', height: '1px', background: theme.accent }} />
              Selected work
            </div>
            <h2
              style={{
                fontFamily: fontDisplay,
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: '-2px',
                color: theme.textPrimary,
              }}
            >
              The portfolio,
              <br />
              <span style={{ color: theme.accent, fontStyle: 'italic' }}>tiled.</span>
            </h2>
          </div>
          <Link
            to="/projects"
            style={{
              fontFamily: fontMono,
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
              cursor: 'pointer',
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
            All {PROJECTS.length} projects <ArrowUpRight size={14} />
          </Link>
        </div>

        <div
          className="homev2-projects-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridAutoRows: '220px',
            gap: '12px',
          }}
        >
          {featured.map((project, i) => {
            const tile = layout[i] || { col: 1, row: 1 };
            const isHovered = hovered === project.id;
            const isBig = tile.col === 2 && tile.row === 2;
            const Wrapper: React.ElementType = project.link ? 'a' : 'div';
            const wrapperProps = project.link
              ? {
                  href: project.link,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                }
              : {};

            return (
              <Wrapper
                key={project.id}
                {...wrapperProps}
                onMouseEnter={() => setHovered(project.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  gridColumn: `span ${tile.col}`,
                  gridRow: `span ${tile.row}`,
                  position: 'relative',
                  overflow: 'hidden',
                  background: theme.bgPrimary,
                  border: `1px solid ${isHovered ? theme.accent : theme.borderPrimary}`,
                  borderRadius: '2px',
                  textDecoration: 'none',
                  cursor: project.link ? 'pointer' : 'default',
                  transition: 'border-color 0.3s ease',
                  display: 'block',
                }}
                className="homev2-project-tile"
              >
                {/* Image background */}
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    position: 'absolute',
                    inset: 0,
                    filter: isHovered ? 'grayscale(0) brightness(0.55)' : 'grayscale(80%) brightness(0.45)',
                    transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                    transition: 'all 0.5s ease',
                  }}
                />

                {/* Gradient overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.85) 100%)`,
                    pointerEvents: 'none',
                  }}
                />

                {/* Content */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    padding: isBig ? '32px' : '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    color: '#F5F3EE',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: fontMono,
                        fontSize: '10px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: '#C3C9A5',
                        padding: '4px 10px',
                        background: 'rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(195, 201, 165, 0.3)',
                      }}
                    >
                      {project.category}
                    </span>
                    {project.link && (
                      <span
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: isHovered ? '#8D9A7C' : 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(8px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isHovered ? '#0C0F14' : '#F5F3EE',
                          transition: 'all 0.3s ease',
                          transform: isHovered ? 'rotate(0deg)' : 'rotate(-45deg)',
                        }}
                      >
                        <ArrowRight size={14} />
                      </span>
                    )}
                  </div>

                  <div>
                    <h3
                      style={{
                        fontFamily: fontDisplay,
                        fontSize: isBig ? 'clamp(28px, 3vw, 40px)' : 'clamp(20px, 2vw, 24px)',
                        fontWeight: 800,
                        letterSpacing: '-1px',
                        lineHeight: 1.05,
                        color: '#F5F3EE',
                        marginBottom: '8px',
                      }}
                    >
                      {project.title}
                    </h3>
                    {isBig && (
                      <p
                        style={{
                          fontFamily: fontBody,
                          fontSize: '14px',
                          lineHeight: 1.5,
                          color: 'rgba(245, 243, 238, 0.75)',
                          maxWidth: '440px',
                        }}
                      >
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// ABOUT V2 — Editorial spread
// =============================================================================

const AboutV2: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section
      aria-label="About"
      style={{
        padding: '120px 48px',
        background: theme.bgPrimary,
      }}
      className="homev2-section"
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div
          className="homev2-about-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left: Editorial story */}
          <div>
            <div
              style={{
                fontFamily: fontMono,
                fontSize: '11px',
                color: theme.accent,
                letterSpacing: '4px',
                textTransform: 'uppercase',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ width: '32px', height: '1px', background: theme.accent }} />
              About — A profile
            </div>

            <h2
              style={{
                fontFamily: fontDisplay,
                fontSize: 'clamp(40px, 5vw, 72px)',
                fontWeight: 800,
                lineHeight: 0.95,
                letterSpacing: '-2px',
                color: theme.textPrimary,
                marginBottom: '32px',
              }}
            >
              Builder.{' '}
              <span style={{ color: theme.accent, fontStyle: 'italic' }}>Operator.</span>{' '}
              <span
                style={{
                  color: 'transparent',
                  WebkitTextStroke: `2px ${theme.headingStroke}`,
                }}
              >
                Service-first.
              </span>
            </h2>

            <div
              style={{
                fontFamily: fontBody,
                fontSize: '17px',
                lineHeight: 1.85,
                color: theme.textSecondary,
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <p>
                I'm not a generalist freelancer. I work with{' '}
                <span style={{ color: theme.textPrimary, fontWeight: 600 }}>
                  service businesses only
                </span>{' '}
                — barbershops, clinics, cleaners, contractors, the people who keep their towns
                running.
              </p>
              <p>
                Two years inside a US roofing company taught me how trades actually buy: trust,
                speed, and the phone ringing. A Cebu barbershop client taught me how to take that
                same playbook and rank it{' '}
                <span style={{ color: theme.accent, fontWeight: 700 }}>#1 on Google</span> in three
                months.
              </p>
              <p>
                You don't need a 30-page deck. You need a site that loads, ranks, and converts —
                and someone who picks up the phone six months later. That's what I do.
              </p>
            </div>

            <div
              style={{
                marginTop: '40px',
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              <PillStat theme={theme} value="600+" label="Dev hours" />
              <PillStat theme={theme} value="#1" label="Google" />
              <PillStat theme={theme} value="PH + US" label="Markets" />
            </div>
          </div>

          {/* Right: Experience cards */}
          <div>
            <div
              style={{
                fontFamily: fontMono,
                fontSize: '11px',
                color: theme.textTertiary,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: `1px solid ${theme.borderPrimary}`,
              }}
            >
              Career timeline
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {EXPERIENCE.map((exp, i) => (
                <div
                  key={exp.id}
                  style={{
                    padding: '24px 0',
                    borderBottom:
                      i < EXPERIENCE.length - 1
                        ? `1px solid ${theme.borderPrimary}`
                        : 'none',
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr',
                    gap: '24px',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      fontFamily: fontMono,
                      fontSize: '11px',
                      color: theme.accent,
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      paddingTop: '4px',
                    }}
                  >
                    {exp.period}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: fontDisplay,
                        fontSize: '18px',
                        fontWeight: 700,
                        color: theme.textPrimary,
                        marginBottom: '4px',
                        letterSpacing: '-0.5px',
                      }}
                    >
                      {exp.role}
                    </div>
                    <div
                      style={{
                        fontFamily: fontMono,
                        fontSize: '11px',
                        color: theme.accentLight,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        marginBottom: '8px',
                      }}
                    >
                      {exp.company}
                    </div>
                    <p
                      style={{
                        fontFamily: fontBody,
                        fontSize: '14px',
                        lineHeight: 1.6,
                        color: theme.textTertiary,
                      }}
                    >
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PillStat: React.FC<{
  theme: ReturnType<typeof useTheme>['theme'];
  value: string;
  label: string;
}> = ({ theme, value, label }) => (
  <div
    style={{
      padding: '12px 20px',
      border: `1px solid ${theme.borderPrimary}`,
      borderRadius: '999px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
    }}
  >
    <span
      style={{
        fontFamily: fontDisplay,
        fontSize: '20px',
        fontWeight: 800,
        color: theme.accent,
        letterSpacing: '-0.5px',
      }}
    >
      {value}
    </span>
    <span
      style={{
        fontFamily: fontMono,
        fontSize: '11px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: theme.textMuted,
      }}
    >
      {label}
    </span>
  </div>
);

// =============================================================================
// CONTACT V2 — Compact CTA banner
// =============================================================================

const ContactV2: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section
      id="contact"
      aria-label="Contact"
      style={{
        padding: '120px 48px',
        background: theme.bgSecondary,
      }}
      className="homev2-section"
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div
          className="homev2-contact-card"
          style={{
            background: theme.bgPrimary,
            border: `1px solid ${theme.accent}`,
            borderRadius: '2px',
            padding: '64px',
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: '64px',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative corner */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '300px',
              height: '300px',
              background: `radial-gradient(circle, ${theme.accentDim} 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative' }}>
            <div
              style={{
                fontFamily: fontMono,
                fontSize: '11px',
                color: theme.accent,
                letterSpacing: '4px',
                textTransform: 'uppercase',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <Star size={12} fill={theme.accent} stroke={theme.accent} />
              Free audit · 24h turnaround
            </div>

            <h2
              style={{
                fontFamily: fontDisplay,
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: '-2px',
                color: theme.textPrimary,
                marginBottom: '24px',
              }}
            >
              Let's get you{' '}
              <span style={{ color: theme.accent, fontStyle: 'italic' }}>found.</span>
            </h2>

            <p
              style={{
                fontFamily: fontBody,
                fontSize: '17px',
                lineHeight: 1.7,
                color: theme.textSecondary,
                maxWidth: '460px',
                marginBottom: '32px',
              }}
            >
              Send me your site (or tell me you don't have one). I'll show you exactly what's
              keeping you off Google and how to fix it. No pitch, no upsell.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <InteractiveHoverButton
                text="Book a call"
                variant="primary"
                href="https://calendly.com/jojishiotsuki0/30min"
              />
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                style={{
                  fontFamily: fontMono,
                  fontSize: '11px',
                  color: theme.textPrimary,
                  textDecoration: 'none',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 0',
                  borderBottom: `1px solid ${theme.borderHover}`,
                  cursor: 'pointer',
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
                <Mail size={14} />
                Email instead
              </a>
            </div>
          </div>

          {/* Right: contact info card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              position: 'relative',
            }}
          >
            <ContactRow
              theme={theme}
              icon={<Mail size={14} />}
              label="Email"
              value={PERSONAL_INFO.email}
              href={`mailto:${PERSONAL_INFO.email}`}
            />
            <ContactRow
              theme={theme}
              icon={<MapPin size={14} />}
              label="Location"
              value={PERSONAL_INFO.location}
            />
            <ContactRow
              theme={theme}
              icon={<Languages size={14} />}
              label="Working in"
              value="English · Filipino"
            />
            <ContactRow
              theme={theme}
              icon={<CalendarClock size={14} />}
              label="Response"
              value="Within 24 hours"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactRow: React.FC<{
  theme: ReturnType<typeof useTheme>['theme'];
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}> = ({ theme, icon, label, value, href }) => {
  const inner = (
    <>
      <div
        style={{
          fontFamily: fontMono,
          fontSize: '10px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: theme.textMuted,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {icon}
        {label}
      </div>
      <div
        style={{
          fontFamily: fontDisplay,
          fontSize: '16px',
          fontWeight: 600,
          color: theme.textPrimary,
          letterSpacing: '-0.3px',
          wordBreak: 'break-word',
        }}
      >
        {value}
      </div>
    </>
  );

  const baseStyle: React.CSSProperties = {
    padding: '20px',
    background: theme.bgSecondary,
    border: `1px solid ${theme.borderPrimary}`,
    borderRadius: '2px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    textDecoration: 'none',
    transition: 'border-color 0.3s ease',
  };

  if (href) {
    return (
      <a
        href={href}
        style={{ ...baseStyle, cursor: 'pointer' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = theme.accent;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = theme.borderPrimary;
        }}
      >
        {inner}
      </a>
    );
  }
  return <div style={baseStyle}>{inner}</div>;
};

// =============================================================================
// PAGE
// =============================================================================

const HomeV2: React.FC = () => {
  // Inject keyframes for marquee once
  useEffect(() => {
    const styleId = 'homev2-keyframes';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes homev2-marquee-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-33.333%); }
      }
      @media (prefers-reduced-motion: reduce) {
        .homev2-marquee { animation: none !important; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <>
      <HeroV2 />
      <MarqueeV2 />
      <BentoResultsV2 />
      <ServicesV2 />
      <ProcessV2 />
      <ProjectsV2 />
      <AboutV2 />
      <ContactV2 />
    </>
  );
};

export default HomeV2;
