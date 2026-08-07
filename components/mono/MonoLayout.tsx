import React from 'react';
import Masthead from './Masthead';
import Colophon from './Colophon';
import { useMagneticButtons } from '../../hooks/useMagneticButtons';

interface MonoLayoutProps {
  page: 'home' | 'work' | 'other';
  skipLabel: string;
  /* Where the skip link jumps to. Defaults to the work index, which is the first real
     content on the two pages that have one. */
  skipHref?: string;
  children: React.ReactNode;
}

/*
  The shell every Mono Index page shares. The `.mono` class is what scopes the whole
  design system in mono.css — without it nothing on the page is styled, and with it
  nothing on the page can style /freelance or /talk.
*/
const MonoLayout: React.FC<MonoLayoutProps> = ({ page, skipLabel, skipHref = '#work', children }) => {
  useMagneticButtons([page]);

  return (
    <div className="mono">
      <a className="skip" href={skipHref}>{skipLabel}</a>
      <Masthead page={page} />
      <main>{children}</main>
      <Colophon />
    </div>
  );
};

export default MonoLayout;
