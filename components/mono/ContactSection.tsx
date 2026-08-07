import React from 'react';
import { PERSONAL_INFO } from '../../constants';
import { MONO_COPY } from './copy';

const ContactSection: React.FC = () => (
  <section id="contact" className="sec sheet" aria-labelledby="contact-h">
    <div className="sec-head">
      <span className="n">04</span>
      <h2 id="contact-h">Contact</h2>
      <span className="leader" aria-hidden="true" />
      <span className="count">Email + Links</span>
    </div>

    <p className="contact-lead">{MONO_COPY.contact.lead}</p>
    <p className="contact-body">{MONO_COPY.contact.body}</p>

    <a className="mail" href={`mailto:${PERSONAL_INFO.email}`}>{PERSONAL_INFO.email}</a>

    <ul className="links">
      {MONO_COPY.links.map(l => (
        <li key={l.name}>
          <a href={l.url} target="_blank" rel="noopener noreferrer">
            <span className="p">{l.name}</span>
            <span className="leader" aria-hidden="true" />
            <span className="h">{l.handle} &#8599;</span>
            <span className="sr">, opens in a new tab</span>
          </a>
        </li>
      ))}
    </ul>
  </section>
);

export default ContactSection;
