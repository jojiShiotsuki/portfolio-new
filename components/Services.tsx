import React from 'react';
import SectionHeading from './SectionHeading';
import { SERVICES } from '../constants';

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="How I Help You Win" 
          subtitle="Technical excellence meets marketing strategy. I don't just write code; I build business assets."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div 
              key={service.id}
              className="group bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-primary-500/50 hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-12 w-12 bg-slate-800 rounded-lg flex items-center justify-center text-primary-400 mb-6 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                <service.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;