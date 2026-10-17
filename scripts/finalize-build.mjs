import { cpSync, copyFileSync, writeFileSync } from 'node:fs'
cpSync('public', 'build', { recursive: true })
copyFileSync('src/og_image.png', 'build/og_image.png')
writeFileSync('build/robots.txt', 'User-agent: *\nAllow: /\nSitemap: https://creativehack.ilyamedve.dev/sitemap.xml\n')
writeFileSync('build/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://creativehack.ilyamedve.dev/</loc></url></urlset>\n')
