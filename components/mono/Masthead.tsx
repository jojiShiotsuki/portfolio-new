import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../ThemeContext';
import { PERSONAL_INFO } from '../../constants';

interface MastheadProps {
  /* 'home' shows the name as plain text and links the sections in-page.
     'work' links the name back home, keeps #work local and marks it as the current page.
     'other' is any page with none of those sections on it, so all four go home. */
  page: 'home' | 'work' | 'other';
}

const SECTIONS = [
  { n: '01', label: 'Work', hash: '#work' },
  { n: '02', label: 'About', hash: '#about' },
  { n: '03', label: 'History', hash: '#history' },
  { n: '04', label: 'Contact', hash: '#contact' },
];

const Masthead: React.FC<MastheadProps> = ({ page }) => {
  const { mode, toggleTheme } = useTheme();
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const isDark = mode === 'dark';

  const handleToggle = () => {
    // Anchor the reveal on the button itself, so the new theme grows out of the thing
    // that was pressed rather than from the middle of the screen.
    toggleTheme(btnRef.current?.getBoundingClientRect());
  };

  return (
    <header className="masthead">
      <div className="sheet">
        {page === 'home'
          ? <span className="mast-name">{PERSONAL_INFO.name}</span>
          : <Link className="mast-name" to="/">{PERSONAL_INFO.name}</Link>}

        <nav className="mast-nav" aria-label="Primary">
          {SECTIONS.map(s => {
            // On the work page only #work exists locally; the rest live on the front page.
            // On any other page none of them do.
            const local = page === 'home' || (page === 'work' && s.hash === '#work');
            const current = page === 'work' && s.hash === '#work';
            const body = <><span className="n">{s.n}</span>{s.label}</>;
            return local ? (
              <a
                key={s.n}
                className="desk"
                href={s.hash}
                aria-current={current ? 'page' : undefined}
              >{body}</a>
            ) : (
              <Link key={s.n} className="desk" to={`/${s.hash}`}>{body}</Link>
            );
          })}

          <a className="cv" href="/resume.pdf">Resume</a>

          <button
            className="theme-btn"
            type="button"
            ref={btnRef}
            onClick={handleToggle}
            aria-label={`Switch to the ${isDark ? 'light' : 'dark'} theme`}
            aria-pressed={isDark}
          >
            <span className="theme-orb" aria-hidden="true" />
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Masthead;
