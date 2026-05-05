import { useLocation } from 'react-router-dom';
import type { Mode } from '../types';

export const useMode = (): Mode =>
  useLocation().pathname.startsWith('/freelance') ? 'freelance' : 'developer';
