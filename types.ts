import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: LucideIcon;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  challenge: string;
  solution: string;
  tech: string[];
  image: string;
  link?: string;
  github?: string;
  results?: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}