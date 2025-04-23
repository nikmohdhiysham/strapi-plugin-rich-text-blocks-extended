import { Option } from './types';

// Font Family Options
export const FONT_FAMILY_OPTIONS: Option[] = [
  { label: 'Default', value: 'default' },
  { label: 'Sans Serif', value: 'sans' },
  { label: 'Serif', value: 'serif' },
  { label: 'Monospace', value: 'mono' }
];

// Font Color Options
export const FONT_COLOR_OPTIONS: Option[] = [
  { label: 'Default', value: 'default' },
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Accent', value: 'accent' }
];

// Font Size Options
export const FONT_SIZE_OPTIONS: Option[] = [
  { label: 'Default', value: 'default' },
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
  { label: 'Extra Large', value: 'xl' }
];

// Font Leading Options
export const FONT_LEADING_OPTIONS: Option[] = [
  { label: 'Default', value: 'default' },
  { label: 'Tight', value: 'tight' },
  { label: 'Normal', value: 'normal' },
  { label: 'Relaxed', value: 'relaxed' },
  { label: 'Loose', value: 'loose' }
];

// Font Alignment Options
export const FONT_ALIGNMENT_OPTIONS: Option[] = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
  { label: 'Justify', value: 'justify' }
];

// Viewport Options
export const VIEWPORT_OPTIONS: Option[] = [
  { label: 'Mobile', value: 'mobile' },
  { label: 'Tablet', value: 'tablet' },
  { label: 'Desktop', value: 'desktop' }
];

// Default values (first item in each options array)
export const DEFAULT_FONT_FAMILY = FONT_FAMILY_OPTIONS[0].value;
export const DEFAULT_FONT_COLOR = FONT_COLOR_OPTIONS[0].value;
export const DEFAULT_FONT_SIZE = FONT_SIZE_OPTIONS[0].value;
export const DEFAULT_FONT_LEADING = FONT_LEADING_OPTIONS[0].value;
export const DEFAULT_FONT_ALIGNMENT = FONT_ALIGNMENT_OPTIONS[0].value;
export const DEFAULT_VIEWPORT = VIEWPORT_OPTIONS[0].value; 