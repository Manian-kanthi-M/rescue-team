import tailwindcss from '@tailwindcss/postcss'; // <-- CRITICAL FIX: Changed 'tailwindcss' to '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer';

export default {
  // We explicitly list the plugins to be used by PostCSS
  plugins: [
    tailwindcss,
    autoprefixer,
  ],
};