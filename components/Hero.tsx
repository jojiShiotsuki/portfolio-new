import React, { useEffect, useState, useRef } from 'react';
import { COPY } from '../constants';
import { InteractiveHoverButton } from './ui/interactive-hover-button';
import { useTheme } from '../ThemeContext';
import { useMode } from '../hooks/useMode';
import { GooeyText } from './ui/gooey-text-morphing';

// The hero used to carry a floating social rail. It duplicated the footer links and
// had no collision-free position: on the left it painted over the sub-headline and the
// View Work button (that overlap shipped to production), and on the right it lands under
// the assistant and sticky-CTA widgets. Removing it also keeps motion/react out of the
// eager bundle. The named social links live in the footer.

const Hero: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();
  const mode = useMode();
  const copy = COPY[mode];
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
        rafRef.current = 0;
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
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
    marginBottom: '24px',
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
    fontSize: '18px',
    lineHeight: 1.7,
    color: theme.textSecondary,
    maxWidth: '600px',
    marginBottom: '40px',
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
    <section id="home" aria-label="Hero introduction" style={containerStyle}>
      {/* Floating gradient */}
      <div style={{ ...floatingElementStyle, top: '10%', right: '20%' }} className="hide-mobile" />
      <div style={{ ...floatingElementStyle, bottom: '20%', left: '10%', background: `radial-gradient(circle, ${theme.accentBorder} 0%, transparent 70%)` }} className="hide-mobile" />

      {/* Vertical text */}
      <div style={verticalTextStyle} className="hide-mobile">
        {copy.heroVerticalText}
      </div>

      <div style={contentStyle}>
        <div style={taglineStyle}>
          <span style={{ width: '40px', height: '1px', background: theme.accent }} />
          {copy.role}
        </div>

        {/* The morph renders two overlapping words at once, so both land in the
            accessibility tree and the computed name doubles up. Name the h1 explicitly
            and hide the animated span from assistive tech. */}
        <h1
          style={headlineStyle}
          aria-label={`${copy.heroHeadlineLine1} ${copy.heroMorphWords[0]} ${copy.heroHeadlineLine3}`}
        >
          <span aria-hidden="true" style={{ animation: 'fadeInUp 0.8s ease-out 0.1s forwards', opacity: 0, display: 'block' }}>
            {copy.heroHeadlineLine1}
          </span>
          <span aria-hidden="true" style={{ color: 'transparent', WebkitTextStroke: `2px ${theme.headingStroke}`, display: 'block', animation: 'fadeInUp 0.8s ease-out 0.2s forwards', opacity: 0 }}>
            <GooeyText
              texts={copy.heroMorphWords}
              morphTime={1.5}
              cooldownTime={0.5}
              textStyle={{ color: theme.headingStroke, WebkitTextStroke: 'unset' }}
            />
          </span>
          <span style={{ animation: 'fadeInUp 0.8s ease-out 0.3s forwards', opacity: 0, display: 'block' }}>
            {copy.heroHeadlineLine3}
          </span>
        </h1>

        <p style={descriptionStyle}>
          {copy.subHeadline}
        </p>

        <div style={ctaContainerStyle} className="hero-cta-container">
          <InteractiveHoverButton
            text={copy.heroCtaPrimary.text}
            variant="primary"
            href={copy.heroCtaPrimary.href}
          />
          <InteractiveHoverButton
            text={copy.heroCtaSecondary.text}
            variant="outline"
            href={copy.heroCtaSecondary.href}
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

    </section>
  );
};

export default Hero;
