import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import { InteractiveHoverButton } from './ui/interactive-hover-button';

const StickyCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
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
    animation: 'pulse 2s infinite',
    zIndex: 20,
    pointerEvents: 'none',
  };

  return (
    <div style={containerStyle} className="sticky-cta">
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
        @media (max-width: 768px) {
          .sticky-cta {
            display: none !important;
          }
        }
      `}</style>
      <div style={{ position: 'relative' }}>
        <span style={pulseStyle} />
        <InteractiveHoverButton
          text="LET'S BUILD"
          variant="primary"
          href="#contact"
          style={{ padding: '18px 32px', fontSize: '14px', boxShadow: `0 4px 30px ${theme.accentGlow}` }}
        />
      </div>
    </div>
  );
};

export default StickyCTA;
