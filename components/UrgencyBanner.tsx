import React, { useState, useEffect } from 'react';

const UrgencyBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bannerStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, #00F0FF 0%, #00F0FF 100%)',
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
    fontFamily: "'Space Mono', monospace",
    fontSize: '13px',
    fontWeight: 700,
    color: '#0a0a0a',
    letterSpacing: '1px',
    margin: 0,
  };

  const highlightStyle: React.CSSProperties = {
    background: '#0a0a0a',
    color: '#00F0FF',
    padding: '2px 8px',
    marginLeft: '8px',
    fontSize: '11px',
  };

  return (
    <div style={bannerStyle}>
      <p style={textStyle}>
        Currently booking for February
        <span style={highlightStyle}>2 SPOTS LEFT</span>
      </p>
    </div>
  );
};

export default UrgencyBanner;
