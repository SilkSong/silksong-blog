import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://silksong.me',
  markdown: {
    shikiConfig: { theme: 'github-dark-default' },
  },
});
