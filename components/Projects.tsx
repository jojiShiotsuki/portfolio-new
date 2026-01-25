import React, { useState } from 'react';
import SectionHeading from './SectionHeading';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import Button from './Button';
import { 
  ExternalLink, 
  Github, 
  CheckCircle, 
  Quote, 
  ChevronDown, 
  ChevronUp, 
  Trophy, 
  Target, 
  Zap,
  Code2,
  Cpu,
  ArrowRight
} from 'lucide-react';

const CaseStudyCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      {/* Connector Line for desktop flow */}
      {index !== PROJECTS.length - 1 && (
        <div className="hidden lg:block absolute left-1/2 bottom-[-128px] w-px h-32 bg-gradient-to-b from-slate-800 to-transparent z-0"></div>
      )}

      <div className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-start ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} relative z-10`}>
        
        {/* Image & Main Tech - Sticky on Desktop */}
        <div className="w-full lg:w-5/12 lg:sticky lg:top-24 group">
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800">
            <div className="aspect-[16/10] overflow-hidden bg-slate-900">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              />
            </div>
            
            {/* Quick Tech Tags Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent">
              <div className="flex flex-wrap gap-2">
                 {project.tech.slice(0, 3).map(t => (
                  <span key={t} className="px-2 py-1 bg-slate-950/80 backdrop-blur text-xs font-mono text-primary-300 rounded border border-slate-700">
                    {t}
                  </span>
                ))}
                {project.tech.length > 3 && (
                  <span className="px-2 py-1 bg-slate-950/80 backdrop-blur text-xs font-mono text-slate-400 rounded border border-slate-700">
                    +{project.tech.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>

           <div className="mt-6 flex gap-4 justify-center lg:justify-start">
            {project.link && (
              <a 
                href={project.link} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 lg:flex-none"
              >
                <Button variant="primary" size="md" className="w-full flex gap-2">
                  <ExternalLink size={18} />
                  Live Site
                </Button>
              </a>
            )}
            {project.github && (
              <a 
                href={project.github}
                target="_blank" 
                rel="noreferrer" 
                className="flex-1 lg:flex-none"
              >
                <Button variant="secondary" size="md" className="w-full flex gap-2">
                  <Github size={18} />
                  Code
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Content Side */}
        <div className="w-full lg:w-7/12 space-y-8">
          
          {/* Header & Overview */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-accent-400"></span>
              <span className="text-accent-400 font-bold uppercase tracking-widest text-xs">
                {project.category}
              </span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">{project.title}</h3>
            
            <div className="mb-2">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Project Overview</h4>
              <p className="text-slate-300 text-lg leading-relaxed border-l-2 border-slate-700 pl-4">
                {project.description}
              </p>
            </div>
          </div>

          {/* Key Results - Always Visible - EMPHASIZED */}
          {project.results && (
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-slate-700 shadow-lg relative overflow-hidden group hover:border-accent-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              
              <h4 className="flex items-center gap-2 text-white font-bold mb-4 relative z-10">
                <Trophy className="text-yellow-500" size={20} />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500">
                  Measurable Outcomes
                </span>
              </h4>
              <div className="grid gap-3 relative z-10">
                {project.results.map((result, i) => (
                  <div key={i} className="flex items-start gap-3 text-slate-200">
                    <CheckCircle className="text-accent-500 shrink-0 mt-1 drop-shadow-sm" size={18} />
                    <span className="font-medium">{result}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collapsible Case Study Details */}
          <div className="border-t border-slate-800 pt-6">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-primary-400 font-semibold hover:text-primary-300 transition-colors mb-6 group w-full sm:w-auto"
            >
              {isExpanded ? 'Hide Case Study Details' : 'Read Full Case Study'}
              {isExpanded ? (
                <ChevronUp size={20} className="group-hover:-translate-y-1 transition-transform" />
              ) : (
                <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform" />
              )}
            </button>

            <div className={`space-y-8 overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Challenge */}
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors">
                  <h4 className="flex items-center gap-2 text-white font-bold mb-3">
                    <Target className="text-red-400" size={20} />
                    The Challenge
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {project.challenge}
                  </p>
                </div>

                {/* Solution */}
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors">
                  <h4 className="flex items-center gap-2 text-white font-bold mb-3">
                    <Zap className="text-primary-400" size={20} />
                    The Solution
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              </div>

              {/* Technologies Full List */}
              <div>
                <h4 className="flex items-center gap-2 text-white font-bold mb-3">
                  <Cpu className="text-slate-400" size={20} />
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map(t => (
                    <span key={t} className="px-3 py-1.5 bg-slate-900 text-slate-300 text-sm font-medium rounded-lg border border-slate-700 flex items-center gap-2 hover:border-primary-500/50 transition-colors cursor-default">
                      <Code2 size={14} className="text-slate-500" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Conversion CTA in Expanded View */}
              <div className="p-4 bg-primary-900/10 border border-primary-500/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-primary-200 font-medium text-sm">Need a solution like this?</p>
                  <p className="text-slate-400 text-xs">I can build a custom strategy for your business.</p>
                </div>
                <a href="#contact" className="flex-shrink-0">
                  <Button variant="outline" size="sm" className="text-xs group">
                    Book Consultation 
                    <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform"/>
                  </Button>
                </a>
              </div>

            </div>
          </div>

          {/* Testimonial */}
          {project.testimonial && (
            <div className="relative mt-4 pt-6">
              <div className="absolute top-0 left-0 w-12 h-px bg-slate-700"></div>
              <div className="flex gap-4">
                <Quote className="text-slate-600 shrink-0" size={32} />
                <div>
                  <p className="text-slate-300 italic text-lg mb-3">"{project.testimonial.quote}"</p>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {project.testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <span className="text-white font-semibold block leading-tight">{project.testimonial.author}</span>
                      <span className="text-primary-400 text-xs">{project.testimonial.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-24 bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Case Studies" 
          subtitle="A deep dive into how I solve complex problems and drive business growth through technology."
        />

        <div className="space-y-32">
          {PROJECTS.map((project, index) => (
            <CaseStudyCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;