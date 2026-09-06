import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/postcss';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const siteUrl = (process.env.SITE_URL || 'https://tutmey.com').replace(/\/$/, '') + '/';
let isBuild = false;

/** Build-time partials keep every delivered page complete HTML, including all SEO content. */
export default defineConfig({
  base: './',
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [{
    name: 'tutmey-html-partials',
    configResolved(config) { isBuild = config.command === 'build'; },
    transformIndexHtml: { order: 'pre', handler(html) {
      return html.replace(/<!-- include:([a-z-]+) -->/g, (_, name: string) =>
        readFileSync(resolve('partials', name + '.html'), 'utf8'))
        .replaceAll('https://tutmey.com/', siteUrl);
    }},
    generateBundle() {
      const pages = readdirSync('.').filter(file => file.endsWith('.html') && file !== '404.html');
      const urls = pages.map(page => '<url><loc>' + siteUrl + (page === 'index.html' ? '' : page) + '</loc></url>').join('');
      this.emitFile({ type:'asset', fileName:'sitemap.xml', source:'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls + '</urlset>' });
      this.emitFile({ type:'asset', fileName:'robots.txt', source:'User-agent: *\nAllow: /\nSitemap: ' + siteUrl + 'sitemap.xml\n' });
      this.emitFile({ type:'asset', fileName:'.nojekyll', source:'' });
    },
    handleHotUpdate({ file, server }) {
      if (file.includes('/partials/') || file.includes('\\partials\\')) {
        server.ws.send({ type:'full-reload' }); return [];
      }
    },
  }],
  // A second pass makes the 404 work even when an unknown URL has multiple path segments.
  // Ordinary page assets remain relative, so project Pages paths work without client routing.
  build: {
    target: 'es2022',
    rolldownOptions: { input: Object.fromEntries(readdirSync('.').filter(file => file.endsWith('.html')).map(file => [file.replace('.html',''), resolve(file)])) },
  },
});
