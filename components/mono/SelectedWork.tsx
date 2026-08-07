import React from 'react';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../../constants';
import type { Project } from '../../types';
import { FEATURED_PROJECT_IDS, FEATURED_QUOTE_IDS, two, yearOf, projectAlt } from './copy';

/* The shortlist, in the order it was chosen. An id that no longer exists is dropped
   rather than rendering an empty row. */
const featured: Project[] = FEATURED_PROJECT_IDS
  .map(id => PROJECTS.find(p => p.id === id))
  .filter((p): p is Project => Boolean(p));

const Entry: React.FC<{ project: Project; index: number }> = ({ project, index }) => (
  <article className="entry">
    <div className="entry-idx">
      <span className="num">{two(index + 1)}</span>
      <img
        className="shot"
        src={project.image}
        alt={projectAlt(project.title, project.category)}
        loading="lazy"
        decoding="async"
      />
    </div>
    <div>
      <div className="entry-head">
        <h3 className="entry-title">
          {project.link ? (
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              {project.title}<span className="arw" aria-hidden="true">&#8599;</span>
              <span className="sr">, opens in a new tab</span>
            </a>
          ) : project.title}
        </h3>
        <span className="leader" aria-hidden="true" />
        <span className="entry-cat">{project.category} / {yearOf(project.date)}</span>
      </div>

      <p className="entry-desc">{project.description}</p>

      <ul className="tech">
        {project.tech.map(t => <li key={t}>{t}</li>)}
      </ul>

      {project.testimonial && FEATURED_QUOTE_IDS.includes(project.id) && (
        <figure className="quote">
          <p>&ldquo;{project.testimonial.quote}&rdquo;</p>
          <figcaption>{project.testimonial.author} &middot; {project.testimonial.role}</figcaption>
        </figure>
      )}
    </div>
  </article>
);

const SelectedWork: React.FC = () => (
  <section id="work" className="sec sheet" aria-labelledby="work-h">
    <div className="sec-head">
      <span className="n">01</span>
      <h2 id="work-h">Selected Work</h2>
      <span className="leader" aria-hidden="true" />
      <span className="count">{two(featured.length)} Entries</span>
    </div>

    {featured.map((p, i) => <Entry key={p.id} project={p} index={i} />)}

    <Link className="all-work" to="/projects">
      <span className="t">All work and case studies</span>
      <span className="leader" aria-hidden="true" />
      <span className="c">{PROJECTS.length} entries &#8599;</span>
    </Link>
  </section>
);

export default SelectedWork;
