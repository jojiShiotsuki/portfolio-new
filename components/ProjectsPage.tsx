import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import { Github, ArrowUpRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const ProjectGridCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const cardStyle: React.CSSProperties = {
    background: theme.bgSecondary,
    border: `1px solid ${theme.borderPrimary}`,
    overflow: 'hidden',
    transition: 'all 0.4s ease',
    cursor: 'pointer',
    position: 'relative',
  };

  const imageContainerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    height: '280px',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: isHovered ? 'grayscale(0)' : 'grayscale(100%)',
    opacity: isHovered ? 1 : 0.7,
    transition: 'all 0.6s ease',
    transform: isHovered ? 'scale(1.08)' : 'scale(1)',
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: isHovered
      ? 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)'
      : 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 100%)',
    transition: 'all 0.4s ease',
  };

  const contentStyle: React.CSSProperties = {
    padding: '32px',
  };

  const categoryStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '10px',
    color: theme.accentLight,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '28px',
    fontWeight: 800,
    color: isHovered ? theme.accent : theme.textPrimary,
    letterSpacing: '-1px',
    marginBottom: '16px',
    lineHeight: 1.2,
    transition: 'color 0.3s ease',
  };

  const descStyle: React.CSSProperties = {
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: '14px',
    lineHeight: 1.7,
    color: theme.textSecondary,
    marginBottom: '24px',
  };

  const techStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '24px',
  };

  const techTagStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '9px',
    color: theme.textTertiary,
    letterSpacing: '1px',
    padding: '6px 10px',
    border: `1px solid ${theme.borderPrimary}`,
    textTransform: 'uppercase',
  };

  const linksStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
  };

  const linkStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '10px',
    color: theme.textPrimary,
    textDecoration: 'none',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    border: `1px solid ${theme.borderHover}`,
    transition: 'all 0.3s ease',
  };

  const numberStyle: React.CSSProperties = {
    position: 'absolute',
    top: '16px',
    left: '16px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '14px',
    fontWeight: 700,
    color: theme.accent,
    background: 'rgba(0, 0, 0, 0.6)',
    padding: '8px 12px',
    backdropFilter: 'blur(10px)',
    zIndex: 2,
  };

  const detailsOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: theme.bgMobileMenu,
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    opacity: showDetails ? 1 : 0,
    visibility: showDetails ? 'visible' : 'hidden',
    transition: 'all 0.3s ease',
    zIndex: 10,
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setShowDetails(false); }}
    >
      <div style={numberStyle}>0{index + 1}</div>

      <div style={imageContainerStyle}>
        <img src={project.image} alt={project.title} style={imageStyle} />
        <div style={overlayStyle} />
      </div>

      <div style={contentStyle}>
        <div style={categoryStyle}>{project.category}</div>
        <h3 style={titleStyle}>{project.title}</h3>
        <p style={descStyle}>{project.description}</p>

        <div style={techStyle}>
          {project.tech.slice(0, 4).map(t => (
            <span key={t} style={techTagStyle}>{t}</span>
          ))}
          {project.tech.length > 4 && (
            <span style={{ ...techTagStyle, color: theme.accent }}>+{project.tech.length - 4}</span>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={linksStyle}>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.accent;
                  e.currentTarget.style.color = theme.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.borderHover;
                  e.currentTarget.style.color = theme.textPrimary;
                }}
              >
                Live <ArrowUpRight size={12} />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.accent;
                  e.currentTarget.style.color = theme.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.borderHover;
                  e.currentTarget.style.color = theme.textPrimary;
                }}
              >
                Code <Github size={12} />
              </a>
            )}
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              color: showDetails ? theme.bgPrimary : theme.accent,
              background: showDetails ? theme.accent : theme.accentBorder,
              border: `1px solid ${theme.accent}`,
              padding: '10px 16px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => {
              if (!showDetails) {
                e.currentTarget.style.background = theme.accent;
                e.currentTarget.style.color = theme.bgPrimary;
              }
            }}
            onMouseLeave={(e) => {
              if (!showDetails) {
                e.currentTarget.style.background = theme.accentBorder;
                e.currentTarget.style.color = theme.accent;
              }
            }}
          >
            {showDetails ? '✕ Close' : '📋 Case Study'}
          </button>
        </div>
      </div>

      {/* Details Overlay */}
      <div style={detailsOverlayStyle}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px'
        }}>
          <div style={categoryStyle}>{project.category}</div>
          <button
            onClick={() => setShowDetails(false)}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              color: theme.textSecondary,
              background: 'transparent',
              border: `1px solid ${theme.borderHover}`,
              padding: '8px 16px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Close ✕
          </button>
        </div>
        <h3 style={{ ...titleStyle, color: theme.accent, marginBottom: '24px', fontSize: '24px' }}>{project.title}</h3>

        {project.challenge && (
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              color: theme.accentLight,
              marginBottom: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}>
              ◆ The Challenge
            </h4>
            <p style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: '15px',
              lineHeight: 1.8,
              color: theme.textSecondary,
            }}>{project.challenge}</p>
          </div>
        )}

        {project.solution && (
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              color: theme.accent,
              marginBottom: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}>
              ◆ The Solution
            </h4>
            <p style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: '15px',
              lineHeight: 1.8,
              color: theme.textSecondary,
            }}>{project.solution}</p>
          </div>
        )}

        {project.results && (
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              color: theme.accent,
              marginBottom: '16px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}>
              ◆ Key Results
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
            }}>
              {project.results.map((result, i) => (
                <div key={i} style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: '13px',
                  color: theme.textPrimary,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px 16px',
                  background: 'rgba(245, 183, 49, 0.05)',
                  border: `1px solid ${theme.accentBorder}`,
                }}>
                  <CheckCircle size={16} style={{ flexShrink: 0, marginTop: '2px', color: theme.accent }} />
                  <span style={{ lineHeight: 1.5 }}>{result}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {project.testimonial && (
          <div style={{
            marginBottom: '28px',
            padding: '24px',
            background: 'rgba(245, 183, 49, 0.05)',
            borderLeft: `3px solid ${theme.accentLight}`,
          }}>
            <p style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: '15px',
              fontStyle: 'italic',
              lineHeight: 1.8,
              color: theme.textPrimary,
              marginBottom: '16px',
            }}>"{project.testimonial.quote}"</p>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: theme.accentLight,
              letterSpacing: '1px',
            }}>
              — {project.testimonial.author}, {project.testimonial.role}
            </div>
          </div>
        )}

        <div style={{ ...linksStyle, marginTop: 'auto', paddingTop: '16px' }}>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...linkStyle, background: theme.accent, color: theme.bgPrimary, border: 'none' }}
            >
              View Live <ArrowUpRight size={12} />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              Source Code <Github size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectsPage: React.FC = () => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<string>('all');

  // Get unique categories
  const categories = ['all', ...new Set(PROJECTS.map(p => p.category))];

  const filteredProjects = filter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === filter);

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    paddingTop: '120px',
    paddingBottom: '100px',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 48px',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '80px',
  };

  const backLinkStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: theme.textSecondary,
    textDecoration: 'none',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '40px',
    transition: 'color 0.3s ease',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: theme.accent,
    letterSpacing: '4px',
    textTransform: 'uppercase',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: 'clamp(48px, 8vw, 100px)',
    fontWeight: 800,
    lineHeight: 0.95,
    letterSpacing: '-3px',
    color: theme.textPrimary,
    marginBottom: '40px',
  };

  const descStyle: React.CSSProperties = {
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: '18px',
    lineHeight: 1.7,
    color: theme.textSecondary,
    maxWidth: '600px',
  };

  const filterContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '60px',
  };

  const filterBtnStyle = (isActive: boolean): React.CSSProperties => ({
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    color: isActive ? theme.bgPrimary : theme.textSecondary,
    background: isActive ? theme.accent : 'transparent',
    border: `1px solid ${isActive ? theme.accent : theme.borderPrimary}`,
    padding: '12px 24px',
    cursor: 'pointer',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    transition: 'all 0.3s ease',
  });

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '32px',
  };

  const statsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '48px',
    marginTop: '60px',
    paddingTop: '40px',
    borderTop: `1px solid ${theme.borderPrimary}`,
  };

  const statStyle: React.CSSProperties = {
    textAlign: 'center',
  };

  const statValueStyle: React.CSSProperties = {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '48px',
    fontWeight: 800,
    color: theme.accent,
    lineHeight: 1,
  };

  const statLabelStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    color: theme.textTertiary,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginTop: '8px',
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <Link
            to="/"
            style={backLinkStyle}
            onMouseEnter={(e) => { e.currentTarget.style.color = theme.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = theme.textSecondary; }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div style={labelStyle}>
            <span style={{ width: '40px', height: '1px', background: theme.accent }} />
            Portfolio
          </div>

          <h1 style={titleStyle}>
            All<br />
            <span style={{ color: 'transparent', WebkitTextStroke: `2px ${theme.accentLight}` }}>Projects</span>
          </h1>

          <p style={descStyle}>
            A collection of projects spanning web development, custom applications, and SEO optimization.
            Each project represents a unique challenge solved with precision and creativity.
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={filterContainerStyle}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={filterBtnStyle(filter === cat)}
              onMouseEnter={(e) => {
                if (filter !== cat) {
                  e.currentTarget.style.borderColor = theme.accent;
                  e.currentTarget.style.color = theme.accent;
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== cat) {
                  e.currentTarget.style.borderColor = theme.borderPrimary;
                  e.currentTarget.style.color = theme.textSecondary;
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div style={gridStyle} className="projects-grid">
          {filteredProjects.map((project, index) => (
            <ProjectGridCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Stats */}
        <div style={statsStyle} className="stats-container">
          <div style={statStyle}>
            <div style={statValueStyle}>{PROJECTS.length}</div>
            <div style={statLabelStyle}>Projects</div>
          </div>
          <div style={statStyle}>
            <div style={statValueStyle}>{new Set(PROJECTS.flatMap(p => p.tech)).size}+</div>
            <div style={statLabelStyle}>Technologies</div>
          </div>
          <div style={statStyle}>
            <div style={statValueStyle}>{categories.length - 1}</div>
            <div style={statLabelStyle}>Categories</div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 968px) {
          .projects-grid {
            grid-template-columns: 1fr !important;
          }
          .stats-container {
            flex-wrap: wrap;
            gap: 32px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectsPage;
