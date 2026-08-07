import React from 'react';
import MonoLayout from './MonoLayout';
import HomeHero from './HomeHero';
import SelectedWork from './SelectedWork';
import AboutSection from './AboutSection';
import HistorySection from './HistorySection';
import ContactSection from './ContactSection';

const MonoHome: React.FC = () => (
  <MonoLayout page="home" skipLabel="Skip to selected work">
    <HomeHero />
    <SelectedWork />
    <AboutSection />
    <HistorySection />
    <ContactSection />
  </MonoLayout>
);

export default MonoHome;
