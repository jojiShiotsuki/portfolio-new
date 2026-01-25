import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle: string;
  alignment?: 'left' | 'center';
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle, alignment = 'center' }) => {
  return (
    <div className={`mb-12 ${alignment === 'center' ? 'text-center' : 'text-left'}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        {title}
      </h2>
      <div className={`h-1.5 w-24 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full mb-6 ${alignment === 'center' ? 'mx-auto' : ''}`} />
      <p className="text-slate-400 text-lg max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};

export default SectionHeading;