import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../ThemeContext';

const UrgencyBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { theme } = useTheme();
  const tickingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          setIsVisible(window.scrollY < 50);
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
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
        {`Currently booking for ${new Date().toLocaleString('default', { month: 'long' })}`}
        <span style={highlightStyle}>2 SPOTS LEFT</span>
      </p>

    </div>
  );
};

export default UrgencyBanner;
