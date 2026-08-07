import React from 'react';
import { EXPERIENCE } from '../../constants';
import { two } from './copy';

const HistorySection: React.FC = () => (
  <section id="history" className="sec sheet" aria-labelledby="history-h">
    <div className="sec-head">
      <span className="n">03</span>
      <h2 id="history-h">Work History</h2>
      <span className="leader" aria-hidden="true" />
      <span className="count">{two(EXPERIENCE.length)} Entries</span>
    </div>

    {EXPERIENCE.map(job => (
      <article className="job" key={job.id}>
        <p className="job-when">{job.period}</p>
        <div>
          <div className="job-head">
            <h3 className="job-role">{job.role}</h3>
            <span className="leader" aria-hidden="true" />
            <span className="job-co">{job.company}</span>
          </div>
          <p className="job-desc">{job.description}</p>
        </div>
      </article>
    ))}
  </section>
);

export default HistorySection;
