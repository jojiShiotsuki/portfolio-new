import React from 'react';
import SectionHeading from './SectionHeading';
import { EXPERIENCE, PERSONAL_INFO } from '../constants';
import { MapPin, Target, Award, Dumbbell } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="My Journey" 
          subtitle="From retail leadership in Japan to founding a tech agency in the Philippines. I bring a unique blend of business acumen and technical expertise."
        />

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Story & Personal Brand */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white">More Than Just Code</h3>
            <p className="text-slate-400 leading-relaxed">
              My path hasn't been linear, and that's my biggest asset. I started in leadership at Toyota, learning the importance of 
              <span className="text-white font-medium"> process and reliability</span>. After running my own businesses and working in the construction industry, 
              I realized most businesses struggle to bridge the gap between "having a website" and "getting sales."
            </p>
            <p className="text-slate-400 leading-relaxed">
              Today, I run <span className="text-primary-400 font-bold">Spark Your Designs</span>, where I combine full-stack engineering with conversion psychology.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
               <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3 mb-2 text-accent-400">
                    <Target size={24} />
                    <span className="font-bold">600+ Days</span>
                  </div>
                  <p className="text-sm text-slate-400">Sober & Disciplined</p>
               </div>
               <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3 mb-2 text-primary-400">
                    <Dumbbell size={24} />
                    <span className="font-bold">Fitness</span>
                  </div>
                  <p className="text-sm text-slate-400">Gym & Running Lifestyle</p>
               </div>
               <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3 mb-2 text-indigo-400">
                    <Award size={24} />
                    <span className="font-bold">Continuous</span>
                  </div>
                  <p className="text-sm text-slate-400">Daily LeetCode & Learning</p>
               </div>
               <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3 mb-2 text-teal-400">
                    <MapPin size={24} />
                    <span className="font-bold">Global</span>
                  </div>
                  <p className="text-sm text-slate-400">Serving US & PH Clients</p>
               </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative pl-8 border-l border-slate-800 space-y-12">
            {EXPERIENCE.map((exp, index) => (
              <div key={exp.id} className="relative group">
                {/* Timeline Dot */}
                <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-2 border-slate-900 bg-primary-600 group-hover:scale-125 transition-transform"></span>
                
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                  <h4 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">{exp.role}</h4>
                  <span className="text-sm font-mono text-slate-500">{exp.period}</span>
                </div>
                <div className="text-accent-400 text-sm font-medium mb-2">{exp.company}</div>
                <p className="text-slate-400 text-sm">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;