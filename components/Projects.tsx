import React, { useState } from 'react';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: index % 2 === 0 ? '1.2fr 1fr' : '1fr 1.2fr',
    gap: '60px',
    padding: '60px 0',
    borderBottom: '1px solid rgba(245, 240, 232, 0.08)',
    alignItems: 'center',
  };

  const imageContainerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: '#141414',
    order: index % 2 === 0 ? 0 : 1,
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    filter: isHovered ? 'grayscale(0)' : 'grayscale(100%)',
    opacity: isHovered ? 1 : 0.7,
    transition: 'all 0.6s ease',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: isHovered
      ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, transparent 50%)'
      : 'transparent',
    transition: 'all 0.4s ease',
  };

  const contentStyle: React.CSSProperties = {
    order: index % 2 === 0 ? 1 : 0,
  };

  const categoryStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '11px',
    color: '#FF6B4A',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: '16px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(32px, 4vw, 48px)',
    fontWeight: 800,
    color: '#f5f0e8',
    letterSpacing: '-1px',
    marginBottom: '24px',
    lineHeight: 1.1,
    transition: 'color 0.3s ease',
  };

  const descStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: '18px',
    lineHeight: 1.8,
    color: 'rgba(245, 240, 232, 0.5)',
    marginBottom: '32px',
  };

  const techStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '32px',
  };

  const techTagStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '10px',
    color: 'rgba(245, 240, 232, 0.4)',
    letterSpacing: '1px',
    padding: '8px 12px',
    border: '1px solid rgba(245, 240, 232, 0.1)',
    textTransform: 'uppercase',
  };

  const resultsStyle: React.CSSProperties = {
    marginBottom: '32px',
  };

  const resultItemStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '12px',
    color: '#00F0FF',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const linksStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
  };

  const linkStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '11px',
    color: '#f5f0e8',
    textDecoration: 'none',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 0',
    borderBottom: '1px solid rgba(245, 240, 232, 0.2)',
    transition: 'all 0.3s ease',
  };

  return (
    <div
      style={cardStyle}
      className="project-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={imageContainerStyle}>
        <img src={project.image} alt={project.title} style={imageStyle} />
        <div style={overlayStyle} />
        <div style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          fontFamily: "'Space Mono', monospace",
          fontSize: '72px',
          fontWeight: 700,
          color: 'rgba(0, 240, 255, 0.1)',
          lineHeight: 1,
        }}>
          0{index + 1}
        </div>
      </div>

      <div style={contentStyle}>
        <div style={categoryStyle}>{project.category}</div>
        <h3 style={{ ...titleStyle, color: isHovered ? '#00F0FF' : '#f5f0e8' }}>
          {project.title}
        </h3>
        <p style={descStyle}>{project.description}</p>

        <div style={techStyle}>
          {project.tech.map(t => (
            <span key={t} style={techTagStyle}>{t}</span>
          ))}
        </div>

        {project.results && (
          <div style={resultsStyle}>
            {project.results.slice(0, 2).map((result, i) => (
              <div key={i} style={resultItemStyle}>
                <span style={{ color: '#00F0FF' }}>+</span>
                {result}
              </div>
            ))}
          </div>
        )}

        <div style={linksStyle}>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#00F0FF';
                e.currentTarget.style.borderColor = '#00F0FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#f5f0e8';
                e.currentTarget.style.borderColor = 'rgba(245, 240, 232, 0.2)';
              }}
            >
              View Live <ArrowUpRight size={14} />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#00F0FF';
                e.currentTarget.style.borderColor = '#00F0FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#f5f0e8';
                e.currentTarget.style.borderColor = 'rgba(245, 240, 232, 0.2)';
              }}
            >
              Source <Github size={14} />
            </a>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 968px) {
          .project-card {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .project-card > div {
            order: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

const Projects: React.FC = () => {
  const sectionStyle: React.CSSProperties = {
    padding: '160px 48px',
    background: '#0a0a0a',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '80px',
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
    fontSize: 'clamp(40px, 6vw, 72px)',
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: '-2px',
    color: '#f5f0e8',
  };

  return (
    <section id="projects" style={sectionStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div style={labelStyle}>
            <span style={{ width: '40px', height: '1px', background: '#00F0FF' }} />
            Selected Work
          </div>
          <h2 style={titleStyle}>
            Featured<br />
            <span style={{ color: 'transparent', WebkitTextStroke: '2px #FF6B4A' }}>Projects</span>
          </h2>
        </div>

        <div>
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
