import React from 'react';
import { Mail } from 'lucide-react';
import { SOCIAL_LINKS, PERSONAL_INFO } from '../constants';
import { useTheme } from '../ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();

  const footerStyle: React.CSSProperties = {
    padding: '48px',
    background: theme.bgPrimary,
    borderTop: `1px solid ${theme.borderSecondary}`,
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
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '14px',
    fontWeight: 700,
    color: theme.accent,
    letterSpacing: '2px',
  };

  const copyrightStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    color: theme.textTertiary,
    letterSpacing: '1px',
    marginTop: '8px',
  };

  const socialContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  };

  const socialLinkStyle: React.CSSProperties = {
    color: theme.textTertiary,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    border: `1px solid ${theme.borderPrimary}`,
  };

  const dividerStyle: React.CSSProperties = {
    width: '1px',
    height: '24px',
    background: theme.borderPrimary,
  };

  const creditsStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '10px',
    color: theme.textMuted,
    letterSpacing: '1px',
    textTransform: 'uppercase',
  };

  return (
    <footer style={footerStyle} className="site-footer">
      <div style={containerStyle} className="footer-container">
        <div className="footer-brand">
          <div style={logoStyle}>
            <span style={{ color: theme.accentLight }}>[</span>
            JOJI.DEV
            <span style={{ color: theme.accentLight }}>]</span>
          </div>
          <div style={{
            ...copyrightStyle,
            fontSize: '12px',
            color: theme.textTertiary,
            marginTop: '12px',
            maxWidth: '400px',
            lineHeight: 1.6,
          }}>
            I help Australian tradies get found on Google and generate leads.
          </div>
          <div style={copyrightStyle}>
            &copy; {new Date().getFullYear()} {PERSONAL_INFO.name}
          </div>
        </div>

        <div style={socialContainerStyle} className="footer-social">
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            style={socialLinkStyle}
            aria-label="Email"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = theme.accent;
              e.currentTarget.style.borderColor = theme.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.textTertiary;
              e.currentTarget.style.borderColor = theme.borderPrimary;
            }}
          >
            <Mail size={18} />
          </a>
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              style={socialLinkStyle}
              aria-label={social.platform}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.accent;
                e.currentTarget.style.borderColor = theme.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.textTertiary;
                e.currentTarget.style.borderColor = theme.borderPrimary;
              }}
            >
              <social.icon size={18} />
            </a>
          ))}

          <div style={dividerStyle} className="footer-divider" />

          <div style={creditsStyle} className="footer-location">
            Australia | United States | Philippines
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
