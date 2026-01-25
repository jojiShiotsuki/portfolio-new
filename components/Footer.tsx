import React from 'react';
import { SOCIAL_LINKS, PERSONAL_INFO } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="text-center md:text-left">
            <span className="font-bold text-xl text-white tracking-tighter">
              JS<span className="text-primary-500">.</span>
            </span>
            <p className="text-slate-500 text-sm mt-2">
              © {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.
            </p>
          </div>

          <div className="flex space-x-6">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label={social.platform}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;