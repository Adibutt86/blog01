import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  site: 'https://frenzy.vercel.app',
  integrations: [
    mdx(), 
    sitemap(),
    compress({
      CSS: true,
      HTML: true,
      Image: true, // Enable build-time compression and WebP conversion for local assets
      JavaScript: true,
      SVG: true
    })
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});