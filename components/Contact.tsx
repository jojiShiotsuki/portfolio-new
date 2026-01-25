import React from 'react';
import Button from './Button';
import { PERSONAL_INFO } from '../constants';
import { Mail, Calendar, ArrowRight } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to scale your business?
        </h2>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          Whether you need a high-performance WordPress site or a custom application, 
          I'm ready to help you hit your goals.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <a 
            href={`mailto:${PERSONAL_INFO.email}`} 
            className="flex items-center justify-center gap-3 p-8 bg-slate-800 rounded-2xl border border-slate-700 hover:border-primary-500/50 hover:bg-slate-800/80 transition-all group w-full sm:w-auto"
          >
            <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform">
              <Mail size={24} />
            </div>
            <div className="text-left">
              <p className="text-sm text-slate-400">Email Me</p>
              <p className="text-lg font-bold text-white">{PERSONAL_INFO.email}</p>
            </div>
          </a>

          <a 
            href="#" 
            className="flex items-center justify-center gap-3 p-8 bg-gradient-to-br from-primary-900/20 to-accent-900/20 rounded-2xl border border-primary-500/30 hover:border-primary-500/60 transition-all group w-full sm:w-auto"
          >
             <div className="h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Calendar size={24} />
            </div>
            <div className="text-left">
              <p className="text-sm text-primary-200">Book a Call</p>
              <p className="text-lg font-bold text-white">Free Consultation</p>
            </div>
          </a>
        </div>
        
        <div className="mt-16 p-6 bg-slate-900/50 rounded-lg inline-block border border-slate-800">
            <p className="text-slate-500 text-sm">
                Looking for the agency site? Visit <a href="https://sparkyourdesigns.com" className="text-primary-400 hover:underline">Spark Your Designs</a>
            </p>
        </div>

      </div>
    </section>
  );
};

export default Contact;