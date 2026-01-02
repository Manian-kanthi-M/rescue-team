import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/rescue-team',
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
  },
})