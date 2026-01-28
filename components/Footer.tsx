import React from 'react';
import { SOCIAL_LINKS, PERSONAL_INFO } from '../constants';

const Footer: React.FC = () => {
  const footerStyle: React.CSSProperties = {
    padding: '48px',
    background: '#0a0a0a',
    borderTop: '1px solid rgba(245, 240, 232, 0.05)',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '24px',
  };

  const logoStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '14px',
    fontWeight: 700,
    color: '#00F0FF',
    letterSpacing: '2px',
  };

  const copyrightStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '11px',
    color: 'rgba(245, 240, 232, 0.3)',
    letterSpacing: '1px',
    marginTop: '8px',
  };

  const socialContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  };

  const socialLinkStyle: React.CSSProperties = {
    color: 'rgba(245, 240, 232, 0.4)',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    border: '1px solid rgba(245, 240, 232, 0.1)',
  };

  const dividerStyle: React.CSSProperties = {
    width: '1px',
    height: '24px',
    background: 'rgba(245, 240, 232, 0.1)',
  };

  const creditsStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '10px',
    color: 'rgba(245, 240, 232, 0.2)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  };

  return (
    <footer style={footerStyle} className="site-footer">
      <div style={containerStyle} className="footer-container">
        <div className="footer-brand">
          <div style={logoStyle}>
            <span style={{ color: '#FF6B4A' }}>[</span>
            JOJI.DEV
            <span style={{ color: '#FF6B4A' }}>]</span>
          </div>
          <div style={copyrightStyle}>
            &copy; {new Date().getFullYear()} {PERSONAL_INFO.name}
          </div>
        </div>

        <div style={socialContainerStyle} className="footer-social">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              style={socialLinkStyle}
              aria-label={social.platform}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#00F0FF';
                e.currentTarget.style.borderColor = '#00F0FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(245, 240, 232, 0.4)';
                e.currentTarget.style.borderColor = 'rgba(245, 240, 232, 0.1)';
              }}
            >
              <social.icon size={18} />
            </a>
          ))}

          <div style={dividerStyle} className="footer-divider" />

          <div style={creditsStyle} className="footer-location">
            Cebu, Philippines
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .site-footer {
            padding: 32px 24px !important;
          }
          .footer-container {
            flex-direction: column !important;
            text-align: center !important;
            gap: 24px !important;
          }
          .footer-social {
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 16px !important;
          }
          .footer-divider {
            display: none !important;
          }
          .footer-location {
            width: 100% !important;
            margin-top: 8px !important;
          }
        }
        @media (max-width: 480px) {
          .site-footer {
            padding: 24px 16px !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
