import React from 'react';
import { PERSONAL_INFO } from '../../constants';
import { MONO_COPY } from './copy';

const Colophon: React.FC = () => (
  <footer className="sheet">
    <div className="colophon">
      <div className="colophon-grid">
        <p className="tag">{MONO_COPY.colophon.tag}</p>
        <p>{MONO_COPY.colophon.setIn}</p>
        <p>&copy; {new Date().getFullYear()} {PERSONAL_INFO.name}</p>
      </div>
    </div>
  </footer>
);

export default Colophon;
