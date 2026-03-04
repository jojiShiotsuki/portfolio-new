import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import { Github, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();

  const cardStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: index % 2 === 0 ? '1.2fr 1fr' : '1fr 1.2fr',
    gap: '60px',
    padding: '60px 0',
    borderBottom: `1px solid ${theme.borderPrimary}`,
    alignItems: 'center',
  };

  const imageContainerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: theme.bgTertiary,
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
      ? `linear-gradient(135deg, ${theme.accentBorder} 0%, transparent 50%)`
      : 'transparent',
    transition: 'all 0.4s ease',
  };

  const contentStyle: React.CSSProperties = {
    order: index % 2 === 0 ? 1 : 0,
  };

  const categoryStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    color: theme.accentLight,
    letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: '16px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: 'clamp(32px, 4vw, 48px)',
    fontWeight: 800,
    color: theme.textPrimary,
    letterSpacing: '-1px',
    marginBottom: '24px',
    lineHeight: 1.1,
    transition: 'color 0.3s ease',
  };

  const descStyle: React.CSSProperties = {
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: '18px',
    lineHeight: 1.8,
    color: theme.textSecondary,
    marginBottom: '32px',
  };

  const techStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '32px',
  };

  const techTagStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '10px',
    color: theme.textTertiary,
    letterSpacing: '1px',
    padding: '8px 12px',
    border: `1px solid ${theme.borderPrimary}`,
    textTransform: 'uppercase',
  };

  const resultsStyle: React.CSSProperties = {
    marginBottom: '32px',
  };

  const resultItemStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: theme.accent,
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
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    color: theme.textPrimary,
    textDecoration: 'none',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 0',
    borderBottom: `1px solid ${theme.borderHover}`,
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
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '72px',
          fontWeight: 700,
          color: theme.accentBorder,
          lineHeight: 1,
        }}>
          0{index + 1}
        </div>
      </div>

      <div style={contentStyle}>
        <div style={categoryStyle}>{project.category}</div>
        <h3 style={{ ...titleStyle, color: isHovered ? theme.accent : theme.textPrimary }}>
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
                <span style={{ color: theme.accent }}>+</span>
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
                e.currentTarget.style.color = theme.accent;
                e.currentTarget.style.borderColor = theme.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.textPrimary;
                e.currentTarget.style.borderColor = theme.borderHover;
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
                e.currentTarget.style.color = theme.accent;
                e.currentTarget.style.borderColor = theme.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.textPrimary;
                e.currentTarget.style.borderColor = theme.borderHover;
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

const ProjectsPreview: React.FC = () => {
  const { theme } = useTheme();

  const sectionStyle: React.CSSProperties = {
    padding: '160px 48px',
    background: theme.bgPrimary,
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '80px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: '24px',
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
    fontSize: 'clamp(40px, 6vw, 72px)',
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: '-2px',
    color: theme.textPrimary,
  };

  const viewAllStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    color: theme.textPrimary,
    textDecoration: 'none',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 32px',
    border: `1px solid ${theme.borderHover}`,
    transition: 'all 0.3s ease',
  };

  // Only show first 2 projects on homepage
  const previewProjects = PROJECTS.slice(0, 2);

  return (
    <section id="projects" style={sectionStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <div style={labelStyle}>
              <span style={{ width: '40px', height: '1px', background: theme.accent }} />
              Portfolio
            </div>
            <h2 style={titleStyle}>
              Other<br />
              <span style={{ color: 'transparent', WebkitTextStroke: `2px ${theme.accentLight}` }}>Projects</span>
            </h2>
            <p style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: '18px',
              lineHeight: 1.7,
              color: theme.textSecondary,
              marginTop: '24px',
              maxWidth: '500px',
            }}>
              While I specialise in tradie websites, here's some other work I've done showcasing my technical skills.
            </p>
          </div>

          <Link
            to="/projects"
            style={viewAllStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.accent;
              e.currentTarget.style.color = theme.accent;
              e.currentTarget.style.background = theme.accentBorder;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.borderHover;
              e.currentTarget.style.color = theme.textPrimary;
              e.currentTarget.style.background = 'transparent';
            }}
          >
            View All Projects
            <ArrowRight size={16} />
          </Link>
        </div>

        <div>
          {previewProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* CTA to view all */}
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <Link
            to="/projects"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '14px',
              fontWeight: 700,
              color: theme.bgPrimary,
              background: theme.accent,
              padding: '20px 48px',
              textDecoration: 'none',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.textPrimary;
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 10px 40px ${theme.accentGlow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = theme.accent;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Explore All {PROJECTS.length} Projects
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #projects { padding: 80px 24px !important; }
        }
        @media (max-width: 480px) {
          #projects { padding: 60px 16px !important; }
        }
      `}</style>
    </section>
  );
};

export default ProjectsPreview;
