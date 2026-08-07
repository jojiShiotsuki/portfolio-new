import React from 'react';
import { MONO_COPY } from './copy';

const AboutSection: React.FC = () => (
  <section id="about" className="sec sheet" aria-labelledby="about-h">
    <div className="sec-head">
      <span className="n">02</span>
      <h2 id="about-h">About</h2>
      <span className="leader" aria-hidden="true" />
      <span className="count">Background</span>
    </div>

    <div className="about-grid">
      <p className="about-lead">{MONO_COPY.about.lead}</p>
      <div className="about-body">
        {MONO_COPY.about.body.map((para, i) => <p key={i}>{para}</p>)}
      </div>
    </div>
  </section>
);

export default AboutSection;
