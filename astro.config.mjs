import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Static pages (spec option A) + one server route: /api/enquiry (prerender = false).
export default defineConfig({
  site: 'https://newporthomeopathy.com',
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'ignore', // pages use trailing slashes; /api/enquiry must not redirect a POST
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [
    sitemap({
      // /book-appointment/ is server-rendered (shows form errors without JS), so list it explicitly.
      customPages: ['https://newporthomeopathy.com/book-appointment/'],
      filter: (page) => !page.includes('/thank-you/') && !page.includes('/404') && !page.includes('/api/'),
      lastmod: new Date(),
    }),
  ],
});
