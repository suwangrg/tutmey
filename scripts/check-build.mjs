import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const root = resolve('dist');
const siteUrl = (process.env.SITE_URL || 'https://tutmey.com').replace(/^http:\/\//, 'https://').replace(/\/$/, '') + '/';
const pages = readdirSync(root).filter(file => file.endsWith('.html'));
const failures = [];
const idsByPage = new Map(pages.map(page => [page, new Set([...readFileSync(resolve(root,page),'utf8').matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]))]));
const titles = new Set();

for (const page of pages) {
  const html = readFileSync(resolve(root,page),'utf8');
  if (html.includes('<!-- include:')) failures.push(page+': unresolved HTML partial');
  if (/src="[^\"]*\.ts"/.test(html)) failures.push(page+': uncompiled TypeScript in public HTML');
  if (!/<link[^>]+rel="stylesheet"/.test(html)) failures.push(page+': missing compiled stylesheet');
  if (!html.includes('<header') || !html.includes('<footer')) failures.push(page+': missing shared header or footer');
  if ((html.match(/<h1[\s>]/g)||[]).length !== 1) failures.push(page+': requires exactly one h1');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  if (!title || titles.has(title)) failures.push(page+': missing or duplicate title');
  titles.add(title);
  if (!html.includes('name="description"') || !html.includes('application/ld+json')) failures.push(page+': missing SEO metadata');
  if (!html.includes('info@tutmey.com') || !html.includes('tel:+971555172530') || !html.includes('901-A63, Iris Bay')) failures.push(page+': missing contact details');
  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const url = match[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
    const [base, fragment] = url.split('#');
    const file = decodeURIComponent(base.split('?')[0]);
    const target = file ? resolve(dirname(resolve(root,page)),file) : resolve(root,page);
    if (!target.startsWith(root)) { failures.push(page+': asset escapes output '+url); continue; }
    if (!existsSync(target)) { failures.push(page+': missing local target '+url); continue; }
    if (fragment && target.endsWith('.html') && !idsByPage.get(target.slice(root.length+1))?.has(fragment)) failures.push(page+': missing anchor '+url);
  }
  for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    try { JSON.parse(match[1]); } catch { failures.push(page+': invalid structured data'); }
  }
}

// GitHub serves 404.html at the original bad path; relative URLs would otherwise break there.
const notFound = resolve(root,'404.html');
writeFileSync(notFound, readFileSync(notFound,'utf8').replace(/\b(src|href)="\.\/([^"#]+)"/g, (_,attr,path)=>attr+'="'+siteUrl+path+'"'));

const assets = readdirSync(resolve(root,'assets')).map(name => ({ name, bytes:statSync(resolve(root,'assets',name)).size }));
const js = assets.filter(asset => asset.name.endsWith('.js'));
const css = assets.filter(asset => asset.name.endsWith('.css'));
for (const asset of css) {
  const cssPath = resolve(root,'assets',asset.name);
  for (const match of readFileSync(cssPath,'utf8').matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) {
    const url = match[1];
    if (/^(data:|https?:|#)/.test(url)) continue;
    if (!existsSync(resolve(dirname(cssPath),decodeURIComponent(url.split('?')[0])))) failures.push(asset.name+': missing CSS asset '+url);
  }
}
if (js.reduce((sum,asset)=>sum+asset.bytes,0)>120_000) failures.push('JavaScript exceeded 120 KB uncompressed budget');
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log('Verified '+pages.length+' HTML pages, unique metadata, local links, anchors, structured data and footer contacts.');
console.log('JavaScript: '+js.reduce((sum,asset)=>sum+asset.bytes,0)+' bytes. CSS: '+css.reduce((sum,asset)=>sum+asset.bytes,0)+' bytes (uncompressed).');
