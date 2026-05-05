import React from 'react';
import Hero from './Hero';
import Results from './Results';
import Services from './Services';
import HowItWorks from './HowItWorks';
import WhoIWorkWith from './WhoIWorkWith';
import ProjectsPreview from './ProjectsPreview';
import About from './About';
import Contact from './Contact';

const FreelancePage: React.FC = () => (
  <>
    <Hero />
    <Results />
    <Services />
    <HowItWorks />
    <WhoIWorkWith />
    <ProjectsPreview />
    <About />
    <Contact />
  </>
);

export default FreelancePage;
