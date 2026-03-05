import React from "react";
import {
  ArrowDownRight,
  Target,
  Crown,
  Star,
  Scissors,
  Flame,
  Zap,
  Podcast,
  Home,
  Sparkles,
  Salad,
  Github,
  Linkedin,
  Music2,
} from "lucide-react";

const CLIENTS = [
  { name: "Pundok Studios", icon: Scissors },
  { name: "Knock Knock HVAC", icon: Flame },
  { name: "Correct Electric", icon: Zap },
  { name: "Trade Titans", icon: Podcast },
  { name: "Abacus Home", icon: Home },
  { name: "Spark Designs", icon: Sparkles },
  { name: "YOU% Nutrition", icon: Salad },
];

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'default' }}>
    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>{value}</span>
    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a1a1aa', fontWeight: 500 }}>{label}</span>
  </div>
);

export default function GlassmorphismHero() {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'calc(100vh - 90px)',
        color: '#fff',
        overflow: 'hidden',
        background: '#0A0D12',
        fontFamily: "'Bricolage Grotesque', sans-serif",
      }}
    >
      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes heroPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.55; }
        }
        .hero-fade { animation: heroFadeIn 0.7s ease-out forwards; opacity: 0; }
        .hero-marquee-track { animation: heroMarquee 30s linear infinite; }
        .hero-d1 { animation-delay: 0.1s; }
        .hero-d2 { animation-delay: 0.2s; }
        .hero-d3 { animation-delay: 0.3s; }
        .hero-d4 { animation-delay: 0.4s; }
        .hero-d5 { animation-delay: 0.5s; }
        .hero-d6 { animation-delay: 0.65s; }
        @keyframes pingDot { 75%, 100% { transform: scale(2); opacity: 0; } }
        .hero-ping { animation: pingDot 1s cubic-bezier(0,0,0.2,1) infinite; }
        .hero-cta-primary:hover { background: #6d8170 !important; transform: scale(1.02); }
        .hero-cta-secondary:hover { background: rgba(255,255,255,0.08) !important; border-color: rgba(255,255,255,0.2) !important; }
      `}</style>

      {/* Ambient background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '70%', height: '80%', background: 'radial-gradient(ellipse at 25% 25%, rgba(95, 113, 97, 0.22) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '60%', height: '60%', background: 'radial-gradient(ellipse at 75% 75%, rgba(141, 154, 124, 0.12) 0%, transparent 55%)' }} />
        <div style={{ position: 'absolute', top: '15%', left: '25%', width: '45%', height: '55%', background: 'radial-gradient(ellipse at center, rgba(195, 201, 165, 0.07) 0%, transparent 50%)', animation: 'heroPulse 8s ease-in-out infinite' }} />
      </div>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 10,
        maxWidth: 1200, margin: '0 auto', padding: '0 48px',
        display: 'flex', alignItems: 'center',
        minHeight: 'calc(100vh - 90px)',
        boxSizing: 'border-box',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 40,
          alignItems: 'center',
          width: '100%',
          padding: '48px 0',
        }}
          className="hero-layout"
        >
          <style>{`
            @media (min-width: 1024px) {
              .hero-layout {
                grid-template-columns: minmax(0, 7fr) minmax(0, 5fr) !important;
                gap: 40px !important;
                padding: 0 !important;
              }
            }
          `}</style>

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>

            {/* Badge */}
            <div className="hero-fade hero-d1">
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                borderRadius: 9999, border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)', padding: '7px 14px',
                backdropFilter: 'blur(12px)', cursor: 'default',
              }}>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '0.15em', color: '#d4d4d8',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  Available for Projects
                  <Star style={{ width: 14, height: 14, color: '#C3C9A5', fill: '#C3C9A5' }} />
                </span>
              </div>
            </div>

            {/* Heading */}
            <h1
              className="hero-fade hero-d2"
              style={{
                fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 0.9,
                margin: 0,
              }}
            >
              I Help Aussie<br />
              <span style={{
                background: 'linear-gradient(to bottom right, #C3C9A5, #8D9A7C, #5F7161)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Tradies
              </span><br />
              Get Found
            </h1>

            {/* Description */}
            <p
              className="hero-fade hero-d3"
              style={{
                maxWidth: 420, fontSize: '1rem', color: '#a1a1aa',
                lineHeight: 1.7, margin: 0,
                fontFamily: "'Instrument Sans', sans-serif",
              }}
            >
              I build websites for roofers, plumbers, electricians, and builders that rank on Google and turn visitors into paying customers. No fluff. Just results.
            </p>

            {/* CTA Buttons */}
            <div className="hero-fade hero-d4" style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <a
                href="#contact"
                className="hero-cta-primary"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  borderRadius: 9999, background: '#5F7161',
                  padding: '12px 24px', fontWeight: 600, color: '#fff',
                  textDecoration: 'none', transition: 'all 0.3s',
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 11,
                }}
              >
                Get a Free Website Audit
                <ArrowDownRight style={{ width: 15, height: 15 }} />
              </a>
              <a
                href="#results"
                className="hero-cta-secondary"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  borderRadius: 9999, border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.04)', padding: '12px 24px',
                  fontWeight: 600, color: '#fff', textDecoration: 'none',
                  backdropFilter: 'blur(4px)', transition: 'all 0.3s',
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 11,
                }}
              >
                See My Results
              </a>
            </div>

            {/* Social links */}
            <div className="hero-fade hero-d5" style={{ display: 'flex', alignItems: 'center', gap: 18, paddingTop: 4 }}>
              {[
                { href: "https://tiktok.com/@_shiotsuki", icon: Music2, label: "TikTok" },
                { href: "https://linkedin.com/in/jojishiotsuki", icon: Linkedin, label: "LinkedIn" },
                { href: "https://github.com/jojiShiotsuki", icon: Github, label: "GitHub" },
              ].map(({ href, icon: Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  style={{ color: '#52525b', transition: 'color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#C3C9A5')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#52525b')}
                >
                  <Icon size={17} />
                </a>
              ))}
              <div style={{ height: 16, width: 1, background: 'rgba(113,113,122,0.4)' }} />
              <span style={{ fontSize: 10, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'JetBrains Mono', monospace" }}>
                AU &middot; US &middot; PH
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0, overflow: 'hidden' }}>

            {/* Stats Card */}
            <div
              className="hero-fade hero-d5"
              style={{
                position: 'relative', overflow: 'hidden',
                borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(40px)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
              }}
            >
              {/* Glow */}
              <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(95,113,97,0.1)', filter: 'blur(80px)', pointerEvents: 'none' }} />

              <div style={{ position: 'relative', zIndex: 10, padding: '28px 28px 24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                  <div style={{
                    display: 'flex', height: 44, width: 44, alignItems: 'center', justifyContent: 'center',
                    borderRadius: 14, background: 'rgba(95,113,97,0.2)',
                    boxShadow: 'inset 0 0 0 1px rgba(95,113,97,0.3)',
                  }}>
                    <Target style={{ height: 22, width: 22, color: '#8D9A7C' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1 }}>#1</div>
                    <div style={{ fontSize: '0.8rem', color: '#a1a1aa', marginTop: 3 }}>Google Ranking Achieved</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 8 }}>
                    <span style={{ color: '#a1a1aa' }}>Client Satisfaction</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>100%</span>
                  </div>
                  <div style={{ height: 6, width: '100%', borderRadius: 9999, background: 'rgba(39,39,42,0.6)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '100%', borderRadius: 9999, background: 'linear-gradient(to right, #5F7161, #8D9A7C, #C3C9A5)' }} />
                  </div>
                </div>

                <div style={{ height: 1, width: '100%', background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'center' }}>
                  <StatItem value="60%" label="More Leads" />
                  <StatItem value="600+" label="Dev Hours" />
                  <StatItem value="2wk" label="Delivery" />
                </div>

                {/* Tags */}
                <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    borderRadius: 9999, border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.04)', padding: '5px 12px',
                    fontSize: 10, fontWeight: 500, letterSpacing: '0.08em',
                    color: '#d4d4d8', textTransform: 'uppercase',
                  }}>
                    <span style={{ position: 'relative', display: 'flex', height: 7, width: 7 }}>
                      <span className="hero-ping" style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', background: '#4ade80', opacity: 0.75 }} />
                      <span style={{ position: 'relative', display: 'inline-flex', height: 7, width: 7, borderRadius: '50%', background: '#22c55e' }} />
                    </span>
                    Taking Clients
                  </div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    borderRadius: 9999, border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.04)', padding: '5px 12px',
                    fontSize: 10, fontWeight: 500, letterSpacing: '0.08em',
                    color: '#d4d4d8', textTransform: 'uppercase',
                  }}>
                    <Crown style={{ width: 12, height: 12, color: '#C3C9A5' }} />
                    SEO Specialist
                  </div>
                </div>
              </div>
            </div>

            {/* Marquee */}
            <div
              className="hero-fade hero-d6"
              style={{
                position: 'relative', overflow: 'hidden',
                borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)', padding: '20px 0',
                backdropFilter: 'blur(40px)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              }}
            >
              <h3 style={{
                margin: '0 0 16px 24px', color: '#71717a', fontWeight: 500,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                letterSpacing: '0.15em', textTransform: 'uppercase',
              }}>
                Clients I've Worked With
              </h3>

              <div style={{
                position: 'relative', display: 'flex', overflow: 'hidden',
                maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
              }}>
                <div className="hero-marquee-track" style={{ display: 'flex', gap: 32, whiteSpace: 'nowrap', paddingLeft: 16 }}>
                  {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.4, cursor: 'default', transition: 'opacity 0.3s' }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}
                    >
                      <client.icon style={{ height: 14, width: 14, color: '#8D9A7C' }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>
                        {client.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 64, background: 'linear-gradient(to top, #0A0D12, transparent)', zIndex: 20, pointerEvents: 'none' }} />
    </section>
  );
}
