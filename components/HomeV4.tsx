import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  MapPin,
  Mail,
  Search,
  PhoneCall,
  Rocket,
  Star,
  CheckCircle2,
  Globe2,
  Languages,
  CalendarClock,
  CircleDot,
} from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { PERSONAL_INFO, SERVICES, PROJECTS, EXPERIENCE } from '../constants';

// =============================================================================
// LIQUID GLASS DESIGN TOKENS
// =============================================================================

const fontDisplay = "'Bricolage Grotesque', sans-serif";
const fontBody = "'Instrument Sans', sans-serif";
const fontMono = "'JetBrains Mono', monospace";

// Glass token derivation per theme mode
const useGlass = () => {
  const { theme, mode } = useTheme();
  const isDark = mode === 'dark';
  return {
    isDark,
    // Surfaces
    glassBg: isDark ? 'rgba(20, 25, 18, 0.45)' : 'rgba(255, 255, 255, 0.55)',
    glassBgStrong: isDark ? 'rgba(20, 25, 18, 0.65)' : 'rgba(255, 255, 255, 0.75)',
    glassBgFaint: isDark ? 'rgba(20, 25, 18, 0.25)' : 'rgba(255, 255, 255, 0.35)',
    // Borders (glass edge highlight)
    glassBorder: isDark ? 'rgba(195, 201, 165, 0.18)' : 'rgba(255, 255, 255, 0.7)',
    glassBorderStrong: isDark ? 'rgba(195, 201, 165, 0.28)' : 'rgba(255, 255, 255, 0.9)',
    // Inner glow (top edge highlight)
    innerGlow: isDark
      ? 'inset 0 1px 0 0 rgba(195, 201, 165, 0.15)'
      : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.7)',
    // Shadows
    shadowSoft: isDark
      ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)'
      : '0 12px 40px rgba(95, 113, 97, 0.18), 0 2px 8px rgba(95, 113, 97, 0.08)',
    shadowLifted: isDark
      ? '0 16px 48px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)'
      : '0 20px 56px rgba(95, 113, 97, 0.25), 0 4px 16px rgba(95, 113, 97, 0.12)',
    // Backdrop filter
    blur: 'blur(28px) saturate(180%)',
    blurStrong: 'blur(40px) saturate(200%)',
    // Tints (sage palette adjustments)
    sage: theme.accent,
    sageLight: theme.accentLight,
    sageDim: theme.accentDim,
    sageBorder: theme.accentBorder,
    text: theme.textPrimary,
    textSecondary: theme.textSecondary,
    textMuted: theme.textTertiary,
  };
};

// =============================================================================
// AURORA BACKGROUND — Animated atmospheric blobs
// =============================================================================

const AuroraBackdrop: React.FC = () => {
  const { isDark } = useGlass();

  // Light mode: soft sage + warm peach + cool lavender
  // Dark mode: deep sage + warm rust + indigo
  const blobs = isDark
    ? [
        { color: 'rgba(141, 154, 124, 0.55)', top: '-15%', left: '-10%', size: '60vw', delay: '0s' },
        { color: 'rgba(195, 201, 165, 0.35)', top: '40%', right: '-15%', size: '55vw', delay: '-8s' },
        { color: 'rgba(180, 130, 110, 0.30)', bottom: '-10%', left: '20%', size: '50vw', delay: '-16s' },
        { color: 'rgba(110, 130, 165, 0.25)', top: '20%', left: '40%', size: '40vw', delay: '-4s' },
      ]
    : [
        { color: 'rgba(141, 154, 124, 0.50)', top: '-10%', left: '-10%', size: '55vw', delay: '0s' },
        { color: 'rgba(255, 200, 165, 0.45)', top: '30%', right: '-10%', size: '50vw', delay: '-8s' },
        { color: 'rgba(195, 201, 165, 0.55)', bottom: '-15%', left: '15%', size: '60vw', delay: '-16s' },
        { color: 'rgba(195, 175, 220, 0.35)', top: '15%', left: '45%', size: '40vw', delay: '-4s' },
      ];

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: b.top,
            left: b.left,
            right: b.right,
            bottom: b.bottom,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle, ${b.color} 0%, transparent 60%)`,
            filter: 'blur(60px)',
            animation: `homev4-drift 30s ease-in-out ${b.delay} infinite`,
            willChange: 'transform',
          }}
        />
      ))}
      {/* Subtle grain to break gradients */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          opacity: isDark ? 0.05 : 0.04,
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
};

// =============================================================================
// REUSABLE — Glass Panel
// =============================================================================

interface GlassPanelProps {
  children: React.ReactNode;
  variant?: 'default' | 'strong' | 'faint';
  padding?: string;
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
  hoverable?: boolean;
}

const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  variant = 'default',
  padding = '32px',
  radius = 24,
  className,
  style,
  hoverable,
}) => {
  const g = useGlass();
  const [hovered, setHovered] = useState(false);

  const bg = variant === 'strong' ? g.glassBgStrong : variant === 'faint' ? g.glassBgFaint : g.glassBg;

  return (
    <div
      className={className}
      onMouseEnter={hoverable ? () => setHovered(true) : undefined}
      onMouseLeave={hoverable ? () => setHovered(false) : undefined}
      style={{
        background: bg,
        backdropFilter: g.blur,
        WebkitBackdropFilter: g.blur,
        border: `1px solid ${hovered && hoverable ? g.glassBorderStrong : g.glassBorder}`,
        borderRadius: `${radius}px`,
        boxShadow: `${hovered && hoverable ? g.shadowLifted : g.shadowSoft}, ${g.innerGlow}`,
        padding,
        position: 'relative',
        transition: 'box-shadow 0.4s ease, border-color 0.4s ease, transform 0.4s ease',
        transform: hovered && hoverable ? 'translateY(-4px)' : 'translateY(0)',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// =============================================================================
// REUSABLE — Glass Pill Button
// =============================================================================

interface GlassButtonProps {
  children: React.ReactNode;
  primary?: boolean;
  href?: string;
  to?: string;
  external?: boolean;
  fullWidth?: boolean;
  ariaLabel?: string;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  primary,
  href,
  to,
  external,
  fullWidth,
  ariaLabel,
}) => {
  const g = useGlass();
  const [hovered, setHovered] = useState(false);

  const bg = primary
    ? hovered
      ? g.sageLight
      : g.sage
    : hovered
      ? g.glassBgStrong
      : g.glassBg;
  const fg = primary
    ? g.isDark
      ? '#0C0F14'
      : '#FFFFFF'
    : g.text;
  const border = primary
    ? hovered
      ? g.sageLight
      : g.sage
    : g.glassBorderStrong;

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '16px 28px',
    fontFamily: fontMono,
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    background: bg,
    color: fg,
    border: `1px solid ${border}`,
    borderRadius: '999px',
    cursor: 'pointer',
    textDecoration: 'none',
    backdropFilter: primary ? 'none' : g.blur,
    WebkitBackdropFilter: primary ? 'none' : g.blur,
    boxShadow: hovered
      ? primary
        ? `0 12px 32px ${g.sageDim}, ${g.innerGlow}`
        : `${g.shadowLifted}, ${g.innerGlow}`
      : `${g.shadowSoft}, ${g.innerGlow}`,
    transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    width: fullWidth ? '100%' : 'auto',
    whiteSpace: 'nowrap',
    position: 'relative',
    overflow: 'hidden',
  };

  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    'aria-label': ariaLabel,
  };

  if (to) {
    return (
      <Link to={to} style={baseStyle} {...handlers}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        style={baseStyle}
        {...handlers}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" style={baseStyle} {...handlers}>
      {children}
    </button>
  );
};

// =============================================================================
// SECTION HEADER
// =============================================================================

const GlassEyebrow: React.FC<{ children: React.ReactNode; centered?: boolean }> = ({
  children,
  centered,
}) => {
  const g = useGlass();
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 16px',
        background: g.glassBgFaint,
        backdropFilter: g.blur,
        WebkitBackdropFilter: g.blur,
        border: `1px solid ${g.glassBorder}`,
        borderRadius: '999px',
        fontFamily: fontMono,
        fontSize: '11px',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: g.sage,
        marginBottom: '24px',
      }}
    >
      <Sparkles size={11} />
      {children}
    </div>
  );
};

// =============================================================================
// HERO V4 — Centered glass hero with floating cards
// =============================================================================

const HeroV4: React.FC = () => {
  const g = useGlass();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        setMousePos({
          x: (e.clientX / window.innerWidth - 0.5) * 2,
          y: (e.clientY / window.innerHeight - 0.5) * 2,
        });
        rafRef.current = 0;
      });
    };
    window.addEventListener('mousemove', handler);
    return () => {
      window.removeEventListener('mousemove', handler);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const parallax = (depth: number): React.CSSProperties => ({
    transform: `translate3d(${mousePos.x * depth}px, ${mousePos.y * depth}px, 0)`,
    transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
    willChange: 'transform',
  });

  return (
    <section
      id="home-v4"
      aria-label="Liquid glass hero"
      className="homev4-hero"
      style={{
        minHeight: 'calc(100vh - 80px)',
        padding: '120px 32px 80px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <AuroraBackdrop />

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Centered intro */}
        <div
          className="homev4-hero-intro"
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <div style={{ display: 'inline-block' }}>
            <GlassEyebrow>Cebu — PH · Available now</GlassEyebrow>
          </div>

          <h1
            className="homev4-hero-h1"
            style={{
              fontFamily: fontDisplay,
              fontSize: 'clamp(48px, 9vw, 128px)',
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: '-4px',
              color: g.text,
              marginBottom: '32px',
              ...parallax(8),
            }}
          >
            Calm websites for{' '}
            <span
              style={{
                backgroundImage: `linear-gradient(135deg, ${g.sage}, ${g.sageLight})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontStyle: 'italic',
                fontWeight: 600,
              }}
            >
              busy shops.
            </span>
          </h1>

          <p
            style={{
              fontFamily: fontBody,
              fontSize: 'clamp(17px, 1.5vw, 20px)',
              lineHeight: 1.6,
              color: g.textSecondary,
              maxWidth: '640px',
              margin: '0 auto 40px',
            }}
          >
            Lead-generating websites and SEO for service businesses across the Philippines and the
            United States. Built once, ranked for years.
          </p>

          <div
            className="homev4-hero-cta"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <GlassButton primary href="https://calendly.com/jojishiotsuki0/30min" external>
              Book a call <ArrowRight size={14} />
            </GlassButton>
            <GlassButton href="#homev4-trophy">
              See the work <ArrowUpRight size={14} />
            </GlassButton>
          </div>
        </div>

        {/* Floating glass info cards */}
        <div
          className="homev4-hero-cards"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            ...parallax(-4),
          }}
        >
          <FloatingInfoCard
            icon={<CircleDot size={14} />}
            label="Status"
            value="Available"
            accent
          />
          <FloatingInfoCard icon={<MapPin size={14} />} label="Based" value="Cebu, PH" />
          <FloatingInfoCard icon={<Globe2 size={14} />} label="Markets" value="PH + US" />
          <FloatingInfoCard icon={<CalendarClock size={14} />} label="Lead time" value="2 weeks" />
        </div>
      </div>
    </section>
  );
};

const FloatingInfoCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}> = ({ icon, label, value, accent }) => {
  const g = useGlass();
  return (
    <GlassPanel
      variant={accent ? 'strong' : 'default'}
      padding="20px"
      radius={20}
      hoverable
      style={{
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
          color: accent ? g.sage : g.textMuted,
        }}
      >
        {icon}
        {label}
        {accent && (
          <span
            style={{
              width: '6px',
              height: '6px',
              background: g.sage,
              borderRadius: '50%',
              animation: 'homev4-pulse 2s ease-in-out infinite',
              marginLeft: 'auto',
            }}
          />
        )}
      </div>
      <div
        style={{
          fontFamily: fontDisplay,
          fontSize: '20px',
          fontWeight: 700,
          color: g.text,
          letterSpacing: '-0.5px',
        }}
      >
        {value}
      </div>
    </GlassPanel>
  );
};

// =============================================================================
// PROOF V4 — Glass results showcase
// =============================================================================

const ProofV4: React.FC = () => {
  const g = useGlass();

  return (
    <section
      aria-label="Proof"
      className="homev4-section"
      style={{ padding: '120px 32px', position: 'relative', overflow: 'hidden' }}
    >
      <AuroraBackdrop />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <GlassEyebrow>Proof in numbers</GlassEyebrow>
          <h2
            style={{
              fontFamily: fontDisplay,
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-2px',
              color: g.text,
              marginBottom: '20px',
            }}
          >
            Real results.{' '}
            <span
              style={{
                backgroundImage: `linear-gradient(135deg, ${g.sage}, ${g.sageLight})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontStyle: 'italic',
              }}
            >
              Real shops.
            </span>
          </h2>
        </div>

        {/* Big featured case study */}
        <GlassPanel
          variant="strong"
          padding="0"
          radius={32}
          hoverable
          className="homev4-case-study"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            overflow: 'hidden',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              position: 'relative',
              minHeight: '420px',
              overflow: 'hidden',
            }}
            className="homev4-case-image"
          >
            <img
              src="/pundok-google-ranking.webp"
              alt="Pundok Studios ranked #1 on Google"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                position: 'absolute',
                inset: 0,
              }}
            />
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background: g.isDark
                  ? 'linear-gradient(135deg, rgba(20,25,18,0.4) 0%, transparent 60%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)',
              }}
            />
          </div>

          <div style={{ padding: '48px', display: 'flex', flexDirection: 'column' }}>
            <GlassEyebrow>Case 01 · Pundok Studios</GlassEyebrow>
            <h3
              style={{
                fontFamily: fontDisplay,
                fontSize: 'clamp(28px, 3vw, 40px)',
                fontWeight: 700,
                color: g.text,
                letterSpacing: '-1px',
                lineHeight: 1.05,
                marginBottom: '20px',
              }}
            >
              From invisible to{' '}
              <span style={{ color: g.sage, fontStyle: 'italic' }}>#1 in Cebu.</span>
            </h3>
            <p
              style={{
                fontFamily: fontBody,
                fontSize: '16px',
                lineHeight: 1.7,
                color: g.textSecondary,
                marginBottom: '32px',
              }}
            >
              A premium barbershop with a 4.9 rating but no online presence. Six months later: #1
              for "barbershop Cebu", walk-ins up 60%, waitlist forming.
            </p>

            {/* Mini stats row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '32px',
              }}
            >
              <MiniStat value="#1" label="Google rank" />
              <MiniStat value="60%" label="Walk-ins" />
              <MiniStat value="340%" label="Profile views" />
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <GlassButton href="https://pundokstudios.com/" external>
                Visit live site <ArrowUpRight size={12} />
              </GlassButton>
            </div>
          </div>
        </GlassPanel>

        {/* Quote card */}
        <GlassPanel
          variant="default"
          padding="40px"
          radius={28}
          className="homev4-quote-card"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            alignItems: 'center',
          }}
        >
          <div>
            <Star size={32} style={{ color: g.sage, marginBottom: '16px', fill: g.sage }} />
            <p
              style={{
                fontFamily: fontDisplay,
                fontSize: 'clamp(20px, 2vw, 26px)',
                lineHeight: 1.4,
                color: g.text,
                fontStyle: 'italic',
                fontWeight: 500,
                letterSpacing: '-0.5px',
              }}
            >
              "We went from hoping customers would find us to having a waitlist."
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              borderLeft: `1px solid ${g.glassBorderStrong}`,
              paddingLeft: '32px',
            }}
            className="homev4-quote-attr"
          >
            <div
              style={{
                fontFamily: fontDisplay,
                fontSize: '20px',
                fontWeight: 700,
                color: g.text,
                letterSpacing: '-0.5px',
              }}
            >
              Harley
            </div>
            <div
              style={{
                fontFamily: fontMono,
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: g.textMuted,
              }}
            >
              Head Barber · Pundok Studios
            </div>
            <div
              style={{
                fontFamily: fontBody,
                fontSize: '14px',
                color: g.textSecondary,
                marginTop: '8px',
                lineHeight: 1.5,
              }}
            >
              Cebu, Philippines · Working with Joji since 2024
            </div>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
};

const MiniStat: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  const g = useGlass();
  return (
    <div
      style={{
        padding: '16px',
        background: g.glassBgFaint,
        backdropFilter: g.blur,
        WebkitBackdropFilter: g.blur,
        border: `1px solid ${g.glassBorder}`,
        borderRadius: '16px',
      }}
    >
      <div
        style={{
          fontFamily: fontDisplay,
          fontSize: '24px',
          fontWeight: 700,
          color: g.sage,
          letterSpacing: '-0.5px',
          lineHeight: 1,
          marginBottom: '4px',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: fontMono,
          fontSize: '10px',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: g.textMuted,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// =============================================================================
// SERVICES V4 — Glass card grid
// =============================================================================

const ServicesV4: React.FC = () => {
  const g = useGlass();

  const benefits: Record<string, string[]> = {
    websites: ['Mobile-first design', 'Fast page loads', 'Conversion-focused layouts'],
    seo: ['Local rankings', 'Google Business Profile', 'Content strategy'],
    maintenance: ['Monthly updates', 'Performance monitoring', 'Priority support'],
  };

  return (
    <section
      aria-label="Services"
      className="homev4-section"
      style={{ padding: '120px 32px', position: 'relative', overflow: 'hidden' }}
    >
      <AuroraBackdrop />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <GlassEyebrow>Services</GlassEyebrow>
          <h2
            style={{
              fontFamily: fontDisplay,
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-2px',
              color: g.text,
              marginBottom: '20px',
            }}
          >
            Three crafts.{' '}
            <span style={{ color: g.sage, fontStyle: 'italic' }}>Done well.</span>
          </h2>
          <p
            style={{
              fontFamily: fontBody,
              fontSize: '17px',
              lineHeight: 1.6,
              color: g.textSecondary,
              maxWidth: '520px',
              margin: '0 auto',
            }}
          >
            No agency padding. Just websites, rankings, and the maintenance that keeps both
            running.
          </p>
        </div>

        <div
          className="homev4-services-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}
        >
          {SERVICES.map((service, idx) => {
            const Icon = service.icon;
            return (
              <GlassPanel
                key={service.id}
                variant="default"
                padding="36px"
                radius={28}
                hoverable
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  minHeight: '420px',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '18px',
                    background: `linear-gradient(135deg, ${g.sage}, ${g.sageLight})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: g.isDark ? '#0C0F14' : '#FFFFFF',
                    boxShadow: `0 8px 20px ${g.sageDim}`,
                  }}
                >
                  <Icon size={26} />
                </div>

                <div>
                  <div
                    style={{
                      fontFamily: fontMono,
                      fontSize: '10px',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      color: g.textMuted,
                      marginBottom: '8px',
                    }}
                  >
                    Service · 0{idx + 1}
                  </div>
                  <h3
                    style={{
                      fontFamily: fontDisplay,
                      fontSize: '24px',
                      fontWeight: 700,
                      color: g.text,
                      letterSpacing: '-0.5px',
                      lineHeight: 1.15,
                    }}
                  >
                    {service.title}
                  </h3>
                </div>

                <p
                  style={{
                    fontFamily: fontBody,
                    fontSize: '15px',
                    lineHeight: 1.65,
                    color: g.textSecondary,
                  }}
                >
                  {service.description}
                </p>

                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '20px',
                    borderTop: `1px solid ${g.glassBorder}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {(benefits[service.id] || []).map((b, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontFamily: fontBody,
                        fontSize: '14px',
                        color: g.textSecondary,
                      }}
                    >
                      <CheckCircle2 size={14} style={{ color: g.sage, flexShrink: 0 }} />
                      {b}
                    </div>
                  ))}
                </div>
              </GlassPanel>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// PROCESS V4 — Floating glass stepper
// =============================================================================

const ProcessV4: React.FC = () => {
  const g = useGlass();

  const steps = [
    {
      icon: Search,
      number: '01',
      title: 'Free audit',
      duration: '24 hours',
      description:
        "I review your current site (or lack of one) and tell you exactly what's keeping you off Google.",
    },
    {
      icon: PhoneCall,
      number: '02',
      title: 'Strategy call',
      duration: '30 min',
      description:
        "We talk through the plan. I learn the business, you learn what it'll take to rank.",
    },
    {
      icon: Rocket,
      number: '03',
      title: 'Launch & rank',
      duration: '2 weeks',
      description:
        'Site shipped in two weeks. Google starts noticing. The phone starts ringing.',
    },
  ];

  return (
    <section
      aria-label="Process"
      className="homev4-section"
      style={{ padding: '120px 32px', position: 'relative', overflow: 'hidden' }}
    >
      <AuroraBackdrop />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <GlassEyebrow>The process</GlassEyebrow>
          <h2
            style={{
              fontFamily: fontDisplay,
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-2px',
              color: g.text,
            }}
          >
            From quiet to{' '}
            <span style={{ color: g.sage, fontStyle: 'italic' }}>booked.</span>
          </h2>
        </div>

        <div
          className="homev4-process-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}
        >
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <GlassPanel
                key={step.number}
                padding="36px"
                radius={28}
                hoverable
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: g.glassBgStrong,
                      backdropFilter: g.blur,
                      WebkitBackdropFilter: g.blur,
                      border: `1px solid ${g.glassBorderStrong}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: g.sage,
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <span
                    style={{
                      fontFamily: fontDisplay,
                      fontSize: '48px',
                      fontWeight: 800,
                      color: 'transparent',
                      WebkitTextStroke: `1.5px ${g.sageBorder}`,
                      letterSpacing: '-2px',
                      lineHeight: 1,
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignSelf: 'flex-start',
                    padding: '4px 12px',
                    background: g.glassBgFaint,
                    backdropFilter: g.blur,
                    WebkitBackdropFilter: g.blur,
                    border: `1px solid ${g.glassBorder}`,
                    borderRadius: '999px',
                    fontFamily: fontMono,
                    fontSize: '10px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: g.sage,
                  }}
                >
                  {step.duration}
                </div>

                <h3
                  style={{
                    fontFamily: fontDisplay,
                    fontSize: '24px',
                    fontWeight: 700,
                    color: g.text,
                    letterSpacing: '-0.5px',
                  }}
                >
                  {step.title}
                </h3>

                <p
                  style={{
                    fontFamily: fontBody,
                    fontSize: '15px',
                    lineHeight: 1.65,
                    color: g.textSecondary,
                  }}
                >
                  {step.description}
                </p>
              </GlassPanel>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// PROJECTS V4 — Glass tile gallery
// =============================================================================

const ProjectsV4: React.FC = () => {
  const g = useGlass();
  const featured = PROJECTS.slice(0, 6);

  return (
    <section
      id="homev4-trophy"
      aria-label="Featured projects"
      className="homev4-section"
      style={{ padding: '120px 32px', position: 'relative', overflow: 'hidden' }}
    >
      <AuroraBackdrop />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div
          className="homev4-projects-header"
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
            <GlassEyebrow>Selected work</GlassEyebrow>
            <h2
              style={{
                fontFamily: fontDisplay,
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: '-2px',
                color: g.text,
              }}
            >
              Shops we've{' '}
              <span style={{ color: g.sage, fontStyle: 'italic' }}>shipped.</span>
            </h2>
          </div>
          <GlassButton to="/projects">
            View all {PROJECTS.length} <ArrowUpRight size={12} />
          </GlassButton>
        </div>

        <div
          className="homev4-projects-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}
        >
          {featured.map((p) => (
            <GlassProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

const GlassProjectCard: React.FC<{ project: typeof PROJECTS[0] }> = ({ project }) => {
  const g = useGlass();
  const [hovered, setHovered] = useState(false);
  const Wrapper: React.ElementType = project.link ? 'a' : 'div';
  const wrapperProps = project.link
    ? { href: project.link, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? g.glassBgStrong : g.glassBg,
        backdropFilter: g.blur,
        WebkitBackdropFilter: g.blur,
        border: `1px solid ${hovered ? g.glassBorderStrong : g.glassBorder}`,
        borderRadius: '28px',
        boxShadow: `${hovered ? g.shadowLifted : g.shadowSoft}, ${g.innerGlow}`,
        textDecoration: 'none',
        cursor: project.link ? 'pointer' : 'default',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
      }}
    >
      <div
        style={{
          aspectRatio: '16 / 10',
          overflow: 'hidden',
          background: g.glassBgFaint,
          margin: '12px 12px 0',
          borderRadius: '20px',
          position: 'relative',
        }}
      >
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.6s ease',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: hovered
              ? 'transparent'
              : g.isDark
                ? 'linear-gradient(180deg, transparent 60%, rgba(20,25,18,0.3) 100%)'
                : 'linear-gradient(180deg, transparent 60%, rgba(255,255,255,0.15) 100%)',
            transition: 'background 0.4s ease',
          }}
        />
      </div>
      <div
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px',
          }}
        >
          <span
            style={{
              fontFamily: fontMono,
              fontSize: '10px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: g.sage,
            }}
          >
            {project.category}
          </span>
          {project.link && (
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: hovered ? g.sage : g.glassBgFaint,
                color: hovered ? (g.isDark ? '#0C0F14' : '#FFFFFF') : g.sage,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                transform: hovered ? 'rotate(0deg)' : 'rotate(-45deg)',
              }}
            >
              <ArrowRight size={12} />
            </div>
          )}
        </div>
        <h3
          style={{
            fontFamily: fontDisplay,
            fontSize: '20px',
            fontWeight: 700,
            color: g.text,
            letterSpacing: '-0.5px',
            lineHeight: 1.2,
          }}
        >
          {project.title}
        </h3>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: '14px',
            lineHeight: 1.55,
            color: g.textSecondary,
            flex: 1,
          }}
        >
          {project.description.slice(0, 110)}
          {project.description.length > 110 ? '…' : ''}
        </p>
      </div>
    </Wrapper>
  );
};

// =============================================================================
// ABOUT V4 — Glass split with floating stats
// =============================================================================

const AboutV4: React.FC = () => {
  const g = useGlass();

  return (
    <section
      aria-label="About"
      className="homev4-section"
      style={{ padding: '120px 32px', position: 'relative', overflow: 'hidden' }}
    >
      <AuroraBackdrop />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div
          className="homev4-about-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: '24px',
            alignItems: 'flex-start',
          }}
        >
          <GlassPanel padding="48px" radius={32}>
            <GlassEyebrow>About</GlassEyebrow>
            <h2
              style={{
                fontFamily: fontDisplay,
                fontSize: 'clamp(32px, 4vw, 56px)',
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '-2px',
                color: g.text,
                marginBottom: '32px',
              }}
            >
              Calm hands.{' '}
              <span style={{ color: g.sage, fontStyle: 'italic' }}>Loud results.</span>
            </h2>

            <div
              style={{
                fontFamily: fontBody,
                fontSize: '16px',
                lineHeight: 1.85,
                color: g.textSecondary,
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <p>
                I build websites for service businesses only — barbershops, clinics, cleaners,
                contractors. The people who keep their towns running.
              </p>
              <p>
                Two years inside a US roofing company taught me how trades actually buy: trust,
                speed, and the phone ringing. A Cebu barbershop client taught me how to take that
                same playbook and rank it{' '}
                <span style={{ color: g.sage, fontWeight: 600 }}>#1 on Google</span> in three
                months.
              </p>
              <p>
                You don't need a 30-page deck. You need a site that loads, ranks, and converts —
                and someone who picks up the phone six months later.
              </p>
            </div>

            <div
              style={{
                marginTop: '40px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
              }}
            >
              <MiniStat value="600+" label="Dev hours" />
              <MiniStat value="#1" label="Rankings" />
              <MiniStat value="PH+US" label="Markets" />
            </div>
          </GlassPanel>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                fontFamily: fontMono,
                fontSize: '11px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: g.textMuted,
                paddingLeft: '8px',
                marginBottom: '4px',
              }}
            >
              Career timeline
            </div>
            {EXPERIENCE.map((exp, i) => (
              <GlassPanel
                key={exp.id}
                variant={i === 0 ? 'strong' : 'default'}
                padding="24px"
                radius={20}
                hoverable
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <h4
                    style={{
                      fontFamily: fontDisplay,
                      fontSize: '17px',
                      fontWeight: 700,
                      color: g.text,
                      letterSpacing: '-0.3px',
                      lineHeight: 1.3,
                    }}
                  >
                    {exp.role}
                  </h4>
                  <span
                    style={{
                      fontFamily: fontMono,
                      fontSize: '10px',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      color: g.sage,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {exp.period}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: fontMono,
                    fontSize: '11px',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: g.sageLight,
                    marginBottom: '12px',
                  }}
                >
                  {exp.company}
                </div>
                <p
                  style={{
                    fontFamily: fontBody,
                    fontSize: '14px',
                    lineHeight: 1.6,
                    color: g.textSecondary,
                  }}
                >
                  {exp.description}
                </p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// CONTACT V4 — Big floating glass CTA
// =============================================================================

const ContactV4: React.FC = () => {
  const g = useGlass();

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="homev4-section"
      style={{ padding: '120px 32px 160px', position: 'relative', overflow: 'hidden' }}
    >
      <AuroraBackdrop />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <GlassPanel
          variant="strong"
          padding="80px"
          radius={40}
          className="homev4-contact-card"
          style={{ textAlign: 'center' }}
        >
          <div style={{ display: 'inline-block', marginBottom: '24px' }}>
            <GlassEyebrow>Free audit · 24h turnaround</GlassEyebrow>
          </div>

          <h2
            style={{
              fontFamily: fontDisplay,
              fontSize: 'clamp(40px, 6vw, 80px)',
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-3px',
              color: g.text,
              marginBottom: '32px',
            }}
          >
            Let's get you{' '}
            <span
              style={{
                backgroundImage: `linear-gradient(135deg, ${g.sage}, ${g.sageLight})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontStyle: 'italic',
              }}
            >
              found.
            </span>
          </h2>

          <p
            style={{
              fontFamily: fontBody,
              fontSize: '18px',
              lineHeight: 1.65,
              color: g.textSecondary,
              maxWidth: '560px',
              margin: '0 auto 40px',
            }}
          >
            Send me your site or tell me you don't have one yet. I'll show you exactly what's
            keeping you off Google. No pitch, no upsell.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: '48px',
            }}
          >
            <GlassButton primary href="https://calendly.com/jojishiotsuki0/30min" external>
              Book a call <ArrowRight size={14} />
            </GlassButton>
            <GlassButton href={`mailto:${PERSONAL_INFO.email}`}>
              <Mail size={14} /> Email instead
            </GlassButton>
          </div>

          <div
            className="homev4-contact-meta"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              maxWidth: '720px',
              margin: '0 auto',
            }}
          >
            <ContactMeta icon={<MapPin size={14} />} label="Location" value="Cebu, Philippines" />
            <ContactMeta icon={<Languages size={14} />} label="Working in" value="EN · Filipino" />
            <ContactMeta icon={<CalendarClock size={14} />} label="Replies in" value="< 24 hours" />
          </div>
        </GlassPanel>
      </div>
    </section>
  );
};

const ContactMeta: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => {
  const g = useGlass();
  return (
    <div
      style={{
        padding: '16px 20px',
        background: g.glassBgFaint,
        backdropFilter: g.blur,
        WebkitBackdropFilter: g.blur,
        border: `1px solid ${g.glassBorder}`,
        borderRadius: '20px',
        textAlign: 'left',
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
          color: g.textMuted,
          marginBottom: '6px',
        }}
      >
        <span style={{ color: g.sage }}>{icon}</span>
        {label}
      </div>
      <div
        style={{
          fontFamily: fontDisplay,
          fontSize: '15px',
          fontWeight: 600,
          color: g.text,
          letterSpacing: '-0.3px',
        }}
      >
        {value}
      </div>
    </div>
  );
};

// =============================================================================
// PAGE
// =============================================================================

const HomeV4: React.FC = () => {
  // Inject keyframes once
  useEffect(() => {
    const styleId = 'homev4-keyframes';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes homev4-drift {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(40px, -30px) scale(1.05); }
        50% { transform: translate(-20px, 40px) scale(0.95); }
        75% { transform: translate(-40px, -20px) scale(1.03); }
      }
      @keyframes homev4-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.4); }
      }
      @media (prefers-reduced-motion: reduce) {
        [class*="homev4-"] *,
        [class*="homev4-"]::before,
        [class*="homev4-"]::after {
          animation: none !important;
          transition: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <>
      <HeroV4 />
      <ProofV4 />
      <ServicesV4 />
      <ProcessV4 />
      <ProjectsV4 />
      <AboutV4 />
      <ContactV4 />
    </>
  );
};

export default HomeV4;
