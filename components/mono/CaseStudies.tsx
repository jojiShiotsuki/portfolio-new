import React from 'react';
import { Link } from 'react-router-dom';
import { PROJECTS, PERSONAL_INFO } from '../../constants';
import type { Project } from '../../types';
import MonoLayout from './MonoLayout';
import { two, yearOf, isConcept, projectAlt } from './copy';
import { dimsFor } from './imageDims';

/* Counts for the spec sheet, derived from the data so nothing here can be out of date. */
const useSpec = () => React.useMemo(() => {
  const byCat = new Map<string, number>();
  PROJECTS.forEach(p => byCat.set(p.category, (byCat.get(p.category) ?? 0) + 1));
  const years = PROJECTS.map(p => yearOf(p.date)).filter(Boolean).sort();
  return {
    rows: [...byCat.entries()].sort((a, b) => b[1] - a[1]),
    span: years.length ? `${years[0]} – ${years[years.length - 1]}` : '',
  };
}, []);

const CaseStudy: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const n = two(index + 1);
  const concept = isConcept(project.category);
  const dims = dimsFor(project.image);

  return (
    <details className="cs" id={`p${n}`}>
      <summary className="cs-sum">
        <span className="num">{n}</span>
        {project.image && (
          <img className="cs-thumb" src={project.image} alt="" {...dims} loading="lazy" decoding="async" />
        )}
        <span className="cs-main">
          <span className="cs-line">
            <h3 className="cs-name">{project.title}</h3>
            <span className="leader" aria-hidden="true" />
            <span className="cs-meta">{project.category} / {yearOf(project.date)}</span>
          </span>
          <span className="cs-blurb">{project.description}</span>
        </span>
        <span className="cs-sign" aria-hidden="true"><i /><i /></span>
      </summary>

      <div className="cs-body">
        {project.image && (
          <img
            className="cs-shot"
            src={project.image}
            alt={projectAlt(project.title, project.category)}
            {...dims}
            loading="lazy"
            decoding="async"
          />
        )}

        {project.challenge && (
          <div className="cs-part"><h4 className="cs-lab">Challenge</h4><p>{project.challenge}</p></div>
        )}
        {project.solution && (
          <div className="cs-part"><h4 className="cs-lab">Approach</h4><p>{project.solution}</p></div>
        )}
        {project.results?.length ? (
          <div className="cs-part">
            <h4 className="cs-lab">Results</h4>
            <ul className="cs-res">{project.results.map(r => <li key={r}>{r}</li>)}</ul>
          </div>
        ) : null}

        {project.testimonial && (
          <figure className="quote">
            <p>&ldquo;{project.testimonial.quote}&rdquo;</p>
            <figcaption>
              {project.testimonial.author}
              {project.testimonial.role ? ` · ${project.testimonial.role}` : ''}
            </figcaption>
          </figure>
        )}

        <ul className="tech">{project.tech.map(t => <li key={t}>{t}</li>)}</ul>

        {/* The live link sits in the body, not the summary: a link inside a summary fights
            the toggle for the same click and is a nesting problem for screen readers.
            The project name is inside the label so 13 links do not all announce as
            "Visit the site", and a concept is never described as a live site. */}
        {project.link && (
          <a className="cs-visit" href={project.link} target="_blank" rel="noopener noreferrer">
            {concept ? 'View' : 'Visit'} {project.title}
            <span className="sr">, opens in a new tab</span>
            <span className="arw" aria-hidden="true">&#8599;</span>
          </a>
        )}
      </div>
    </details>
  );
};

const CaseStudies: React.FC = () => {
  const spec = useSpec();

  return (
    <MonoLayout page="work" skipLabel="Skip to the work">
      <section className="hero sheet">
        <div className="hero-meta">
          <span className="label">All work // {two(PROJECTS.length)} entries</span>
          <span className="status">
            <span className="dot" aria-hidden="true" />{PERSONAL_INFO.location}
          </span>
        </div>

        <div className="hero-grid">
          <div>
            <h1><span className="ln">Selected</span><span className="ln">Work</span></h1>
            <p className="role">Case studies &middot; {spec.span}</p>
            <p className="sub">
              A mix of agency client builds, custom apps, and SEO-led sites. WordPress and
              React, mostly. Open any row to read the case study.
            </p>
            <Link className="back" to="/">&larr; Back to the front page</Link>
          </div>

          <dl className="spec">
            {spec.rows.map(([cat, count]) => (
              <div className="r" key={cat}>
                <dt>{cat}</dt>
                <span className="leader" aria-hidden="true" />
                <dd>{two(count)}</dd>
              </div>
            ))}
            <div className="r">
              <dt>Span</dt>
              <span className="leader" aria-hidden="true" />
              <dd>{spec.span}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="sec sheet" id="work" aria-labelledby="work-h">
        <div className="sec-head">
          <span className="n">01</span>
          <h2 id="work-h">Case Studies</h2>
          <span className="leader" aria-hidden="true" />
          <span className="count">{two(PROJECTS.length)} Entries</span>
        </div>

        {PROJECTS.map((p, i) => <CaseStudy key={p.id} project={p} index={i} />)}

        <Link className="back" to="/">&larr; Back to the front page</Link>
      </section>
    </MonoLayout>
  );
};

export default CaseStudies;
