import React from 'react';
import Button from './Button';
import { PERSONAL_INFO } from '../constants';
import { ArrowRight, Download } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-950">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-300 text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-accent-400 mr-2 animate-pulse"></span>
              {PERSONAL_INFO.availability}
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white">
              Hi, I'm Joji. <br />
              I Build <span className="gradient-text">Revenue-Driving</span> Web Solutions.
            </h1>
            
            <p className="text-xl text-slate-400 max-w-xl">
              {PERSONAL_INFO.subHeadline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact">
                <Button size="lg" className="w-full sm:w-auto group">
                  Book a Strategy Call
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <a href="#projects">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  View Work
                </Button>
              </a>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center gap-6 text-slate-500 text-sm">
              <div className="flex -space-x-2">
                 {[1,2,3,4].map((i) => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs text-white">
                     {/* Placeholder for client avatars */}
                   </div>
                 ))}
              </div>
              <p>Trusted by businesses in the US & Philippines</p>
            </div>
          </div>

          {/* Visual/Image */}
          <div className="hidden lg:block relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900/50 backdrop-blur-sm p-6 transform rotate-2 hover:rotate-0 transition-all duration-500">
              <div className="aspect-[4/3] bg-slate-800 rounded-lg overflow-hidden relative">
                 <img 
                   src="https://picsum.photos/800/800?grayscale" 
                   alt="Joji Shiotsuki" 
                   className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                 <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-2xl font-bold">Spark Your Designs</p>
                    <p className="text-primary-400">Founder & CEO</p>
                 </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;