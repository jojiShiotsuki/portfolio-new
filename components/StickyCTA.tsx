import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const StickyCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 500px
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

  const buttonStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '14px',
    fontWeight: 700,
    color: '#0a0a0a',
    background: '#00F0FF',
    padding: '18px 32px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    letterSpacing: '1px',
    boxShadow: '0 4px 30px rgba(0, 240, 255, 0.4)',
    transition: 'all 0.3s ease',
  };

  const pulseStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    width: '12px',
    height: '12px',
    background: '#FF6B4A',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
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
      <a
        href="#contact"
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f5f0e8';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 40px rgba(0, 240, 255, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#00F0FF';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 30px rgba(0, 240, 255, 0.4)';
        }}
      >
        <span style={pulseStyle} />
        LET'S BUILD
        <ArrowRight size={18} />
      </a>
    </div>
  );
};

export default StickyCTA;
