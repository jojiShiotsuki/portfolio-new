import React, { useEffect, useState } from 'react';
import { PERSONAL_INFO } from '../constants';
import { Github, Linkedin } from 'lucide-react';
import { InteractiveHoverButton } from './ui/interactive-hover-button';
import { TikTokIcon } from './ui/tiktok-icon';
import { useTheme } from '../ThemeContext';
import { GooeyText } from './ui/gooey-text-morphing';
import { AnimatedSocialIcons } from './ui/animated-social-icons';

const TRADE_WORDS = ["Tradies", "Plumbers", "Sparkies", "Chippies", "Builders", "Roofers"];

const SOCIAL_ICONS = [
  { Icon: TikTokIcon, href: "https://tiktok.com/@_shiotsuki" },
  { Icon: Linkedin, href: "https://linkedin.com/in/jojishiotsuki" },
  { Icon: Github, href: "https://github.com/jojiShiotsuki" },
];

const Hero: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '120px 48px 80px',
    position: 'relative',
    overflow: 'hidden',
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
    position: 'relative',
    zIndex: 2,
  };

  const taglineStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: theme.accent,
    letterSpacing: '4px',
    textTransform: 'uppercase',
    marginBottom: '32px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    animation: 'fadeInUp 0.8s ease-out forwards',
  };

  const headlineStyle: React.CSSProperties = {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: 'clamp(48px, 10vw, 140px)',
    fontWeight: 800,
    lineHeight: 0.9,
    letterSpacing: '-4px',
    marginBottom: '48px',
    color: theme.textPrimary,
  };

  const descriptionStyle: React.CSSProperties = {
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: '20px',
    lineHeight: 1.7,
    color: theme.textSecondary,
    maxWidth: '600px',
    marginBottom: '48px',
    animation: 'fadeInUp 0.8s ease-out 0.3s forwards',
    opacity: 0,
  };

  const ctaContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    flexWrap: 'wrap',
    animation: 'fadeInUp 0.8s ease-out 0.4s forwards',
    opacity: 0,
  };


  const floatingElementStyle: React.CSSProperties = {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${theme.accentDim} 0%, transparent 70%)`,
    filter: 'blur(60px)',
    transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`,
    transition: 'transform 0.3s ease-out',
    pointerEvents: 'none',
  };

  const verticalTextStyle: React.CSSProperties = {
    position: 'absolute',
    right: '48px',
    top: '50%',
    transform: 'translateY(-50%) rotate(90deg)',
    transformOrigin: 'center',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    letterSpacing: '4px',
    color: theme.textMuted,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  };

  const socialLinksStyle: React.CSSProperties = {
    position: 'absolute',
    left: '48px',
    bottom: '140px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    animation: 'fadeInUp 0.8s ease-out 0.5s forwards',
    opacity: 0,
  };

  const scrollIndicatorStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    animation: 'fadeInUp 0.8s ease-out 0.6s forwards',
    opacity: 0,
  };

  const scrollLineStyle: React.CSSProperties = {
    width: '1px',
    height: '60px',
    background: `linear-gradient(to bottom, ${theme.accent}, transparent)`,
  };

  return (
    <section id="home" style={containerStyle}>
      {/* Floating gradient */}
      <div style={{ ...floatingElementStyle, top: '10%', right: '20%' }} className="hide-mobile" />
      <div style={{ ...floatingElementStyle, bottom: '20%', left: '10%', background: `radial-gradient(circle, ${theme.accentBorder} 0%, transparent 70%)` }} className="hide-mobile" />

      {/* Vertical text */}
      <div style={verticalTextStyle} className="hide-mobile">
        Available for Projects // 2025
      </div>

      {/* Social links */}
      <div style={socialLinksStyle} className="hide-mobile">
        <AnimatedSocialIcons
          icons={SOCIAL_ICONS}
          iconSize={20}
        />
      </div>

      <div style={contentStyle}>
        <div style={taglineStyle}>
          <span style={{ width: '40px', height: '1px', background: theme.accent }} />
          {PERSONAL_INFO.role}
        </div>

        <h1 style={headlineStyle}>
          <span style={{ animation: 'fadeInUp 0.8s ease-out 0.1s forwards', opacity: 0, display: 'block' }}>
            I Help
          </span>
          <span style={{ color: 'transparent', WebkitTextStroke: `2px ${theme.headingStroke}`, display: 'block', animation: 'fadeInUp 0.8s ease-out 0.2s forwards', opacity: 0 }}>
            Aussie{' '}
            <GooeyText
              texts={TRADE_WORDS}
              morphTime={1.5}
              cooldownTime={0.5}
              textStyle={{ color: theme.headingStroke, WebkitTextStroke: 'unset' }}
            />
          </span>
          <span style={{ animation: 'fadeInUp 0.8s ease-out 0.3s forwards', opacity: 0, display: 'block' }}>
            Get Found
          </span>
        </h1>

        <p style={descriptionStyle}>
          {PERSONAL_INFO.subHeadline}
        </p>

        <div style={ctaContainerStyle}>
          <InteractiveHoverButton
            text="Book a Call"
            variant="primary"
            href="https://calendly.com/jojishiotsuki0/30min"
          />
          <InteractiveHoverButton
            text="See My Results"
            variant="outline"
            href="#results"
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={scrollIndicatorStyle} className="hide-mobile">
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '2px', color: theme.textTertiary }}>
          SCROLL
        </span>
        <div style={scrollLineStyle} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          #home { padding: 100px 24px 60px !important; }
          #home h1 {
            font-size: clamp(32px, 10vw, 70px) !important;
            letter-spacing: -1px !important;
            line-height: 1 !important;
          }
        }
        @media (max-width: 480px) {
          #home { padding: 90px 16px 50px !important; }
          #home h1 {
            font-size: clamp(28px, 9vw, 50px) !important;
            letter-spacing: -1px !important;
            line-height: 1.05 !important;
          }
        }
        @media (max-width: 375px) {
          #home h1 {
            font-size: 28px !important;
            letter-spacing: 0px !important;
            line-height: 1.1 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
