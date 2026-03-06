import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../ThemeContext';
import { InteractiveHoverButton } from './ui/interactive-hover-button';

const StickyCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();
  const tickingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 500);
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    zIndex: 999,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'all 0.3s ease',
    pointerEvents: isVisible ? 'auto' : 'none',
  };

  const pulseStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    width: '12px',
    height: '12px',
    background: theme.accentLight,
    borderRadius: '50%',
    animation: 'pulse-cta 2s infinite',
    zIndex: 20,
    pointerEvents: 'none',
  };

  return (
    <div style={containerStyle} className="sticky-cta">
      <div style={{ position: 'relative' }}>
        <span style={pulseStyle} />
        <InteractiveHoverButton
          text="BOOK A CALL"
          variant="primary"
          href="https://calendly.com/jojishiotsuki0/30min"
          style={{ padding: '18px 32px', fontSize: '14px', boxShadow: `0 4px 30px ${theme.accentGlow}` }}
        />
      </div>
    </div>
  );
};

export default StickyCTA;
