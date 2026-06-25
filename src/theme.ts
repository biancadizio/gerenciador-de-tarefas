import { hs, vs, ms } from './utils/responsive';

/**
 * Shared visual tokens for colors, spacing, radii, and font sizes.
 * Components import this object to keep the dark interface consistent.
 */
export const theme = {
  colors: {
    background: '#0A0A0A',
    modalBackground: '#1F1F1F', 
    selectorBackground: '#333333',
    primary: '#00FF88',
    secondary: '#7C3AED',
    text: '#FFFFFF',
    inputBackground: '#1A1A1A',
    border: '#2D2D2D',
    danger: '#FF4654',
    completedText: '#808080',
    urgent: '#FF0000',
    important: '#FFA500',
    remember: '#FFFF00',
    'no-urgency': '#00FF88',
  },
  spacing: {
    xs: vs(4),
    s: vs(8),
    m: vs(16),
    l: vs(24),
  },
  radii: {
    s: hs(4),
    m: hs(8),
    l: hs(16),
  },
  fontSize: {
    small: ms(12),
    medium: ms(16),
    large: ms(24),
  },
};
