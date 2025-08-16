const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      'synthwave',      // Current theme - retro/vibrant
      'cyberpunk',      // Futuristic comic style
      'halloween',      // Dark/spooky comics
      'dracula',        // Dark theme
      'light',          // Clean/light theme
      'dark',           // Dark theme
      'cupcake',        // Soft/pastel theme
      'bumblebee',      // Yellow/black theme
      'emerald',        // Green theme
      'corporate',      // Professional theme
      'retro',          // Vintage comic style
      'valentine',      // Pink/romance comics
      'garden',         // Nature theme
      'forest',         // Dark green theme
      'aqua',           // Blue theme
      'lofi',           // Minimalist
      'pastel',         // Soft colors
      'fantasy',        // Fantasy comics
      'wireframe',      // Sketch style
      'black',          // Pure black
      'luxury',         // Premium feel
      'cmyk',           // Print colors
      'autumn',         // Warm colors
      'business',       // Professional
      'acid',           // Neon colors
      'lemonade',       // Fresh/yellow
      'night',          // Dark blue
      'coffee',         // Brown theme
      'winter',         // Cool colors
      {
        'comic-book': {
          "primary": "#dc2626",           // Red - classic comic book red
          "secondary": "#2563eb",         // Blue - superhero blue
          "accent": "#fbbf24",            // Yellow - golden age comics
          "neutral": "#1f2937",           // Dark gray
          "base-100": "#ffffff",          // White background
          "base-200": "#f3f4f6",          // Light gray
          "base-300": "#e5e7eb",          // Lighter gray
          "info": "#06b6d4",              // Cyan
          "success": "#10b981",           // Green
          "warning": "#f59e0b",           // Orange
          "error": "#ef4444",             // Red error
        },
      },
      {
        'superhero': {
          "primary": "#1e40af",           // Deep blue - like Superman
          "secondary": "#dc2626",         // Red - like Spider-Man
          "accent": "#fbbf24",            // Gold - like Wonder Woman
          "neutral": "#111827",           // Dark
          "base-100": "#ffffff",          // White
          "base-200": "#f9fafb",          // Light
          "base-300": "#f3f4f6",          // Lighter
          "info": "#0ea5e9",              // Sky blue
          "success": "#059669",           // Green
          "warning": "#d97706",           // Orange
          "error": "#dc2626",             // Red
        },
      },
      {
        'vintage-comic': {
          "primary": "#7c2d12",           // Brown - vintage feel
          "secondary": "#1e40af",         // Blue
          "accent": "#fbbf24",            // Gold
          "neutral": "#374151",           // Gray
          "base-100": "#fef3c7",          // Cream - vintage paper
          "base-200": "#fde68a",          // Light cream
          "base-300": "#fcd34d",          // Lighter cream
          "info": "#0d9488",              // Teal
          "success": "#059669",           // Green
          "warning": "#d97706",           // Orange
          "error": "#b91c1c",             // Red
        },
      }
    ],
  },
};
