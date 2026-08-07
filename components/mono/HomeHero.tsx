import React from 'react';
import { PERSONAL_INFO, EXPERIENCE } from '../../constants';
import { MONO_COPY, FEATURED_PROJECT_IDS, two } from './copy';

const HomeHero: React.FC = () => {
  const contents = [
    { n: '01', href: '#work', title: 'Selected Work', note: `${two(FEATURED_PROJECT_IDS.length)} Entries` },
    { n: '02', href: '#about', title: 'About', note: 'Background' },
    { n: '03', href: '#history', title: 'Work History', note: `${two(EXPERIENCE.length)} Entries` },
    { n: '04', href: '#contact', title: 'Contact', note: 'Email + Links' },
  ];

  return (
    <section className="hero sheet" aria-labelledby="name">
      <div className="hero-meta label">
        <span>{MONO_COPY.hero.kicker}</span>
        <span className="status">
          <span className="dot" aria-hidden="true" />{PERSONAL_INFO.location}
        </span>
      </div>

      <div className="hero-grid">
        <div>
          <h1 id="name">
            <span className="ln">Joji</span>
            <span className="ln">Shiotsuki</span>
          </h1>

          <p className="role">{MONO_COPY.hero.role}</p>
          <p className="sub">{MONO_COPY.hero.sub}</p>

          <div className="cta">
            <a className="btn btn--solid" href="#work">
              <span className="btn-in">View Work <span className="arw" aria-hidden="true">&#8595;</span></span>
            </a>
            <a className="btn btn--ghost" href="/resume.pdf">
              <span className="btn-in">Resume <span className="arw" aria-hidden="true">&#8599;</span></span>
            </a>
          </div>
        </div>

        <dl className="spec">
          {MONO_COPY.spec.map(row => (
            <div className="r" key={row.term}>
              <dt>{row.term}</dt>
              <span className="leader" aria-hidden="true" />
              <dd>{row.value}</dd>
            </div>
          ))}
          <div className="r">
            <dt>Email</dt>
            <span className="leader" aria-hidden="true" />
            <dd><a href={`mailto:${PERSONAL_INFO.email}`}>{PERSONAL_INFO.email}</a></dd>
          </div>
        </dl>
      </div>

      <nav className="toc" aria-label="Contents">
        <p className="toc-cap">Contents</p>
        <ul>
          {contents.map(c => (
            <li key={c.n}>
              <a href={c.href}>
                <span className="n">{c.n}</span>
                <span className="t">{c.title}</span>
                <span className="leader" aria-hidden="true" />
                <span className="c">{c.note}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
};

export default HomeHero;
