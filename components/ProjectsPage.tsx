import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import { Github, ArrowUpRight, ArrowLeft, CheckCircle } from 'lucide-react';

const ProjectGridCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const cardStyle: React.CSSProperties = {
    background: '#0f0f0f',
    border: '1px solid rgba(245, 240, 232, 0.08)',
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
    fontFamily: "'Space Mono', monospace",
    fontSize: '10px',
    color: '#FF6B4A',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: '28px',
    fontWeight: 800,
    color: isHovered ? '#00F0FF' : '#f5f0e8',
    letterSpacing: '-1px',
    marginBottom: '16px',
    lineHeight: 1.2,
    transition: 'color 0.3s ease',
  };

  const descStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: '14px',
    lineHeight: 1.7,
    color: 'rgba(245, 240, 232, 0.5)',
    marginBottom: '24px',
  };

  const techStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '24px',
  };

  const techTagStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '9px',
    color: 'rgba(245, 240, 232, 0.4)',
    letterSpacing: '1px',
    padding: '6px 10px',
    border: '1px solid rgba(245, 240, 232, 0.1)',
    textTransform: 'uppercase',
  };

  const linksStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
  };

  const linkStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '10px',
    color: '#f5f0e8',
    textDecoration: 'none',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    border: '1px solid rgba(245, 240, 232, 0.2)',
    transition: 'all 0.3s ease',
  };

  const numberStyle: React.CSSProperties = {
    position: 'absolute',
    top: '16px',
    left: '16px',
    fontFamily: "'Space Mono', monospace",
    fontSize: '14px',
    fontWeight: 700,
    color: '#00F0FF',
    background: 'rgba(0, 0, 0, 0.6)',
    padding: '8px 12px',
    backdropFilter: 'blur(10px)',
    zIndex: 2,
  };

  const detailsOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'rgba(10, 10, 10, 0.98)',
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
            <span style={{ ...techTagStyle, color: '#00F0FF' }}>+{project.tech.length - 4}</span>
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
                  e.currentTarget.style.borderColor = '#00F0FF';
                  e.currentTarget.style.color = '#00F0FF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(245, 240, 232, 0.2)';
                  e.currentTarget.style.color = '#f5f0e8';
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
                  e.currentTarget.style.borderColor = '#00F0FF';
                  e.currentTarget.style.color = '#00F0FF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(245, 240, 232, 0.2)';
                  e.currentTarget.style.color = '#f5f0e8';
                }}
              >
                Code <Github size={12} />
              </a>
            )}
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              color: showDetails ? '#0a0a0a' : '#00F0FF',
              background: showDetails ? '#00F0FF' : 'rgba(0, 240, 255, 0.1)',
              border: '1px solid #00F0FF',
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
                e.currentTarget.style.background = '#00F0FF';
                e.currentTarget.style.color = '#0a0a0a';
              }
            }}
            onMouseLeave={(e) => {
              if (!showDetails) {
                e.currentTarget.style.background = 'rgba(0, 240, 255, 0.1)';
                e.currentTarget.style.color = '#00F0FF';
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
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              color: 'rgba(245, 240, 232, 0.5)',
              background: 'transparent',
              border: '1px solid rgba(245, 240, 232, 0.2)',
              padding: '8px 16px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Close ✕
          </button>
        </div>
        <h3 style={{ ...titleStyle, color: '#00F0FF', marginBottom: '24px', fontSize: '24px' }}>{project.title}</h3>

        {project.challenge && (
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              color: '#FF6B4A',
              marginBottom: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}>
              ◆ The Challenge
            </h4>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '15px',
              lineHeight: 1.8,
              color: 'rgba(245, 240, 232, 0.7)',
            }}>{project.challenge}</p>
          </div>
        )}

        {project.solution && (
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              color: '#00F0FF',
              marginBottom: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}>
              ◆ The Solution
            </h4>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '15px',
              lineHeight: 1.8,
              color: 'rgba(245, 240, 232, 0.7)',
            }}>{project.solution}</p>
          </div>
        )}

        {project.results && (
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              color: '#00F0FF',
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
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '13px',
                  color: '#f5f0e8',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px 16px',
                  background: 'rgba(0, 240, 255, 0.05)',
                  border: '1px solid rgba(0, 240, 255, 0.15)',
                }}>
                  <CheckCircle size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#00F0FF' }} />
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
            background: 'rgba(255, 107, 74, 0.05)',
            borderLeft: '3px solid #FF6B4A',
          }}>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '15px',
              fontStyle: 'italic',
              lineHeight: 1.8,
              color: 'rgba(245, 240, 232, 0.8)',
              marginBottom: '16px',
            }}>"{project.testimonial.quote}"</p>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              color: '#FF6B4A',
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
              style={{ ...linkStyle, background: '#00F0FF', color: '#0a0a0a', border: 'none' }}
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
    fontFamily: "'Space Mono', monospace",
    fontSize: '12px',
    color: 'rgba(245, 240, 232, 0.5)',
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
    fontFamily: "'Space Mono', monospace",
    fontSize: '12px',
    color: '#00F0FF',
    letterSpacing: '4px',
    textTransform: 'uppercase',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(48px, 8vw, 100px)',
    fontWeight: 800,
    lineHeight: 0.95,
    letterSpacing: '-3px',
    color: '#f5f0e8',
    marginBottom: '40px',
  };

  const descStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: '18px',
    lineHeight: 1.7,
    color: 'rgba(245, 240, 232, 0.5)',
    maxWidth: '600px',
  };

  const filterContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '60px',
  };

  const filterBtnStyle = (isActive: boolean): React.CSSProperties => ({
    fontFamily: "'Space Mono', monospace",
    fontSize: '11px',
    color: isActive ? '#0a0a0a' : 'rgba(245, 240, 232, 0.5)',
    background: isActive ? '#00F0FF' : 'transparent',
    border: `1px solid ${isActive ? '#00F0FF' : 'rgba(245, 240, 232, 0.15)'}`,
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
    borderTop: '1px solid rgba(245, 240, 232, 0.08)',
  };

  const statStyle: React.CSSProperties = {
    textAlign: 'center',
  };

  const statValueStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: '48px',
    fontWeight: 800,
    color: '#00F0FF',
    lineHeight: 1,
  };

  const statLabelStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '11px',
    color: 'rgba(245, 240, 232, 0.4)',
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
            onMouseEnter={(e) => { e.currentTarget.style.color = '#00F0FF'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(245, 240, 232, 0.5)'; }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div style={labelStyle}>
            <span style={{ width: '40px', height: '1px', background: '#00F0FF' }} />
            Portfolio
          </div>

          <h1 style={titleStyle}>
            All<br />
            <span style={{ color: 'transparent', WebkitTextStroke: '2px #FF6B4A' }}>Projects</span>
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
                  e.currentTarget.style.borderColor = '#00F0FF';
                  e.currentTarget.style.color = '#00F0FF';
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== cat) {
                  e.currentTarget.style.borderColor = 'rgba(245, 240, 232, 0.15)';
                  e.currentTarget.style.color = 'rgba(245, 240, 232, 0.5)';
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
