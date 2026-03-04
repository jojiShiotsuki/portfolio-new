import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';

const UrgencyBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bannerStyle: React.CSSProperties = {
    background: `linear-gradient(90deg, ${theme.bannerBg} 0%, ${theme.bannerBg} 100%)`,
    padding: '10px 20px',
    textAlign: 'center',
    position: 'fixed',
    top: isVisible ? 0 : -40,
    left: 0,
    right: 0,
    zIndex: 101,
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'top 0.3s ease',
  };

  const textStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    fontWeight: 700,
    color: theme.bannerText,
    letterSpacing: '1px',
    margin: 0,
  };

  const highlightStyle: React.CSSProperties = {
    background: theme.bannerBadgeBg,
    color: theme.bannerBadgeText,
    padding: '2px 8px',
    marginLeft: '8px',
    fontSize: '11px',
  };

  return (
    <div style={bannerStyle} className="urgency-banner">
      <p style={textStyle} className="urgency-text">
        Currently booking for February
        <span style={highlightStyle}>2 SPOTS LEFT</span>
      </p>

      <style>{`
        @media (max-width: 480px) {
          .urgency-banner {
            padding: 8px 12px !important;
            height: auto !important;
            min-height: 36px !important;
          }
          .urgency-text {
            font-size: 10px !important;
            letter-spacing: 0.5px !important;
            line-height: 1.4 !important;
          }
          .urgency-text span {
            display: inline-block !important;
            margin-left: 6px !important;
            font-size: 9px !important;
            padding: 2px 6px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default UrgencyBanner;
