import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import { Github, ArrowUpRight, ArrowLeft, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { AnimatePresence, motion } from 'motion/react';

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const hasCaseStudy = project.challenge || project.solution || project.results;

  return (
    <div style={{ borderBottom: `1px solid ${theme.borderPrimary}` }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          padding: '60px 0',
          alignItems: 'center',
        }}
        className="project-row"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <div style={{
          overflow: 'hidden',
          border: `1px solid ${theme.borderPrimary}`,
          order: index % 2 === 0 ? 0 : 1,
        }} className="project-img">
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            style={{
              width: '100%',
              height: '320px',
              objectFit: 'cover',
              display: 'block',
              transition: 'all 0.5s ease',
              transform: isHovered ? 'scale(1.03)' : 'scale(1)',
            }}
          />
        </div>

        {/* Content */}
        <div style={{ order: index % 2 === 0 ? 1 : 0 }} className="project-content">
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            color: theme.accent,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>{project.category}</div>

          <h3 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: '32px',
            fontWeight: 800,
            color: isHovered ? theme.accent : theme.textPrimary,
            letterSpacing: '-1px',
            marginBottom: '16px',
            lineHeight: 1.1,
            transition: 'color 0.3s ease',
          }}>{project.title}</h3>

          <p style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: '16px',
            lineHeight: 1.8,
            color: theme.textSecondary,
            marginBottom: '24px',
          }}>{project.description}</p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '24px',
          }}>
            {project.tech.slice(0, 4).map(t => (
              <span key={t} style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                color: theme.textTertiary,
                letterSpacing: '1px',
                padding: '6px 10px',
                border: `1px solid ${theme.borderPrimary}`,
                textTransform: 'uppercase',
              }}>{t}</span>
            ))}
            {project.tech.length > 4 && (
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                color: theme.accent,
                letterSpacing: '1px',
                padding: '6px 10px',
                border: `1px solid ${theme.borderPrimary}`,
              }}>+{project.tech.length - 4}</span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
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
                }}
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
                style={{
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
                }}
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
            {hasCaseStudy && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  color: showDetails ? theme.btnPrimaryText : theme.btnPrimaryText,
                  background: theme.accent,
                  border: 'none',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginLeft: 'auto',
                  transition: 'opacity 0.3s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              >
                Case Study {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable case study */}
      <AnimatePresence>
        {showDetails && hasCaseStudy && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 0 60px',
              display: 'grid',
              gridTemplateColumns: project.results ? '1fr 1fr' : '1fr',
              gap: '48px',
            }} className="case-study-grid">
              <div>
                {project.challenge && (
                  <div style={{ marginBottom: '32px' }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '11px',
                      fontWeight: 700,
                      color: theme.accent,
                      marginBottom: '12px',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                    }}>The Challenge</div>
                    <p style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: '15px',
                      lineHeight: 1.8,
                      color: theme.textSecondary,
                    }}>{project.challenge}</p>
                  </div>
                )}

                {project.solution && (
                  <div style={{ marginBottom: '32px' }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '11px',
                      fontWeight: 700,
                      color: theme.accent,
                      marginBottom: '12px',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                    }}>The Solution</div>
                    <p style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: '15px',
                      lineHeight: 1.8,
                      color: theme.textSecondary,
                    }}>{project.solution}</p>
                  </div>
                )}

                {project.testimonial && (
                  <div style={{
                    borderLeft: `2px solid ${theme.accent}`,
                    paddingLeft: '20px',
                  }}>
                    <p style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: '15px',
                      fontStyle: 'italic',
                      lineHeight: 1.8,
                      color: theme.textTertiary,
                      marginBottom: '8px',
                    }}>"{project.testimonial.quote}"</p>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '11px',
                      color: theme.textMuted,
                    }}>{project.testimonial.author}, {project.testimonial.role}</div>
                  </div>
                )}
              </div>

              {project.results && (
                <div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    fontWeight: 700,
                    color: theme.accent,
                    marginBottom: '20px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                  }}>Key Results</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {project.results.map((result, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                      }}>
                        <CheckCircle size={16} style={{ flexShrink: 0, marginTop: '3px', color: theme.accent }} />
                        <span style={{
                          fontFamily: "'Instrument Sans', sans-serif",
                          fontSize: '15px',
                          lineHeight: 1.6,
                          color: theme.textSecondary,
                        }}>{result}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProjectsPage: React.FC = () => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', ...new Set(PROJECTS.map(p => p.category))];

  const filteredProjects = filter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === filter);

  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>

        {/* Header */}
        <div style={{ marginBottom: '80px' }}>
          <Link
            to="/"
            style={{
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
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = theme.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = theme.textSecondary; }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            color: theme.labelColor,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            <span style={{ width: '40px', height: '1px', background: theme.accent }} />
            Portfolio
          </div>

          <h1 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 'clamp(48px, 8vw, 100px)',
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: '-3px',
            color: theme.textPrimary,
            marginBottom: '32px',
          }}>
            All<br />
            <span style={{ color: 'transparent', WebkitTextStroke: `2px ${theme.headingStroke}` }}>Projects</span>
          </h1>

          <p style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: '18px',
            lineHeight: 1.7,
            color: theme.textSecondary,
            maxWidth: '500px',
          }}>
            Web development, custom applications, and SEO. Each project a unique challenge solved with precision.
          </p>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '20px',
        }}>
          {categories.map(cat => {
            const isActive = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  color: isActive ? theme.bgPrimary : theme.textMuted,
                  background: isActive ? theme.accent : 'transparent',
                  border: 'none',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = theme.textPrimary;
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = theme.textMuted;
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Projects list */}
        <div>
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: '60px',
          marginTop: '80px',
        }}>
          {[
            { value: PROJECTS.length, label: 'Projects' },
            { value: `${new Set(PROJECTS.flatMap(p => p.tech)).size}+`, label: 'Technologies' },
            { value: categories.length - 1, label: 'Categories' },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: '48px',
                fontWeight: 800,
                color: theme.accent,
                lineHeight: 1,
              }}>{stat.value}</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: theme.textMuted,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginTop: '8px',
              }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProjectsPage;
