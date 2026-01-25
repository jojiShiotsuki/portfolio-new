import { 
  Github, 
  Linkedin, 
  Globe, 
  Instagram, 
  Code2, 
  Layout, 
  LineChart, 
  ShoppingCart, 
  Wrench, 
  Bot 
} from 'lucide-react';
import { NavItem, SocialLink, Project, Experience, Service } from './types';

// --- PERSONAL BRANDING DATA ---

export const PERSONAL_INFO = {
  name: "Joji Shiotsuki",
  role: "Senior WordPress Developer & Software Engineer",
  email: "jojishiotsuki0@gmail.com",
  location: "Cebu, Philippines",
  tagline: "I Build High-Performance Websites That Turn Visitors Into Revenue.",
  subHeadline: "Helping construction, real estate, and e-commerce businesses scale in the US and Philippines through SEO-first development and custom software solutions.",
  availability: "Available for projects",
  agency: "Spark Your Designs"
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: 'LinkedIn', url: 'https://linkedin.com/in/jojishiotsuki', icon: Linkedin },
  { platform: 'GitHub', url: 'https://github.com/jojiShiotsuki', icon: Github },
  { platform: 'Website', url: 'https://jojishiotsuki.com', icon: Globe },
  { platform: 'Instagram', url: 'https://instagram.com/_shiotsuki', icon: Instagram },
];

// --- SERVICES STRATEGY ---

export const SERVICES: Service[] = [
  {
    id: 'wordpress',
    title: 'Custom WordPress Dev',
    description: 'Bespoke themes and plugins using Bricks, Elementor, or Divi. No bloat, just speed and conversion-focused design.',
    icon: Layout
  },
  {
    id: 'webapp',
    title: 'Full-Stack Applications',
    description: 'When WordPress isn\'t enough. Custom React/Node.js applications for complex business logic, portals, and SaaS products.',
    icon: Code2
  },
  {
    id: 'seo',
    title: 'SEO & Performance',
    description: 'Technical SEO and core web vitals optimization to ensure you rank locally and load instantly on all devices.',
    icon: LineChart
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Solutions',
    description: 'High-converting WooCommerce stores optimized for sales, integrated with payment gateways and inventory systems.',
    icon: ShoppingCart
  },
  {
    id: 'maintenance',
    title: 'Maintenance & Support',
    description: 'Keep your business secure. Regular updates, backups, and security monitoring so you never face downtime.',
    icon: Wrench
  },
  {
    id: 'ai',
    title: 'AI Integrations',
    description: 'Leverage OpenAI and Anthropic to automate customer support, content generation, and data analysis.',
    icon: Bot
  }
];

// --- PORTFOLIO STRATEGY ---

export const PROJECTS: Project[] = [
  {
    id: 'fuji-peak',
    title: 'Fuji Peak Realty',
    category: 'Real Estate Platform',
    description: 'A comprehensive real estate platform facilitating property browsing, virtual tours, and agent appointments.',
    challenge: 'The client faced high bounce rates due to slow loading times with high-res images. They also lacked a centralized system for agents to manage appointments, leading to lost leads.',
    solution: 'I built a custom WordPress solution with an optimized database structure for property listings. I implemented aggressive image caching/CDN integration and developed a custom appointment booking engine for agents.',
    tech: ['WordPress', 'PHP', 'JavaScript', 'MySQL', 'ACF Pro'],
    results: [
      'Reduced page load time by 60% (from 5s to under 2s)',
      'Increased agent booking inquiries by 40% in the first month',
      'Seamlessly handles 500+ high-resolution property listings'
    ],
    testimonial: {
      quote: "Joji transformed our digital presence. Our agents are booking more appointments than ever, and clients love how fast the site is.",
      author: "Sarah M.",
      role: "Marketing Director"
    },
    image: 'https://picsum.photos/800/600?random=1',
    link: '#'
  },
  {
    id: 'shiotsuki-interior',
    title: 'Shiotsuki Interior Manager',
    category: 'Construction ERP',
    description: 'Internal project management system for a construction flooring company to manage inventory and workflows.',
    challenge: 'The company relied on disjointed spreadsheets, causing frequent material shortages, data loss, and miscommunication between on-site teams and the office.',
    solution: 'I engineered a secure MERN stack application with strict role-based access control. Features include real-time inventory tracking, project status dashboards, and automated low-stock alerts.',
    tech: ['Node.js', 'Express', 'React', 'Tailwind CSS', 'MongoDB'],
    results: [
      'Eliminated inventory tracking errors by ~95%',
      'Saved project managers 10+ hours per week on manual data entry',
      'Real-time updates improved team coordination across 3 concurrent job sites'
    ],
    testimonial: {
      quote: "We finally have clarity on our materials and deadlines. This tool has become the backbone of our daily operations.",
      author: "Kenji S.",
      role: "Operations Manager"
    },
    image: 'https://picsum.photos/800/600?random=2',
    github: 'https://github.com/jojiShiotsuki'
  },
  {
    id: 'vertex',
    title: 'Vertex CMS',
    category: 'Video Asset App',
    description: 'A specialized content management system focused on organizing and streaming video assets.',
    challenge: 'Standard CMS platforms struggled with heavy video content organization, leading to buffering issues and poor admin user experience.',
    solution: 'Engineered a lightweight full-stack application focused specifically on video metadata handling and optimized delivery via Cloudinary.',
    tech: ['React', 'Node.js', 'Cloudinary API', 'PostgreSQL'],
    results: [
      'Streamlined video asset retrieval time by 50%',
      'Supports 4K video streaming with zero buffer on client side',
      'Simplified workflow for creative teams'
    ],
    image: 'https://picsum.photos/800/600?random=3',
    github: 'https://github.com/jojiShiotsuki'
  },
  {
    id: 'client-roofing',
    title: 'Best Roofing Now',
    category: 'Local SEO Lead Gen',
    description: 'High-performance lead generation site for the roofing industry focused on local search dominance.',
    challenge: 'The client had zero local visibility and an outdated site that frightened away premium customers, resulting in high CPAs for paid ads.',
    solution: 'Redesigned using Bricks Builder for 100/100 PageSpeed scores and implemented a comprehensive local SEO schema strategy.',
    tech: ['Bricks Builder', 'WordPress', 'Schema Markup', 'Redis Object Cache'],
    results: [
      'Achieved perfect 100/100 PageSpeed Insights score',
      'Ranked #1 for local keywords within 3 months',
      'Doubled monthly lead volume without increasing ad spend'
    ],
    testimonial: {
      quote: "Our phone started ringing again. Joji knows how to build sites that actually make money.",
      author: "Mike T.",
      role: "Owner"
    },
    image: 'https://picsum.photos/800/600?random=4',
    link: '#'
  }
];

// --- CAREER STORY ---

export const EXPERIENCE: Experience[] = [
  {
    id: 'spark',
    role: 'CEO & Co-Founder',
    company: 'Spark Your Designs',
    period: 'Dec 2024 - Present',
    description: 'Leading a boutique agency focused on conversion-optimized web solutions for US/PH clients.'
  },
  {
    id: 'best-roofing',
    role: 'Full-Stack WordPress Developer',
    company: 'Best Roofing Now',
    period: 'Oct 2024 - Present',
    description: 'Driving web infrastructure and SEO strategy for a major roofing company.'
  },
  {
    id: 'polianna',
    role: 'Web Developer',
    company: 'Polianna, LLC',
    period: 'May 2024 - Oct 2024',
    description: 'Specialized in SEO implementation and site speed optimization services.'
  },
  {
    id: '100devs',
    role: 'Software Engineer',
    company: '100Devs',
    period: 'Jun 2023 - May 2024',
    description: 'Intensive full-stack bootcamp mastering the MERN stack and software engineering principles.'
  },
  {
    id: 'interior',
    role: 'Flooring Specialist',
    company: 'Shiotsuki Interior',
    period: 'Mar 2022 - May 2023',
    description: 'Gained deep construction industry insight while optimizing operational workflows.'
  },
  {
    id: 'toyota',
    role: 'Team Lead',
    company: 'Toyota Inter Japan',
    period: 'Apr 2018 - Aug 2020',
    description: 'Led retail operations, developing strong leadership and process management skills.'
  }
];