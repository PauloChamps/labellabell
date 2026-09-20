#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const mode = arg('--mode', 'preview');
if (!['preview', 'public'].includes(mode)) throw new Error('Use --mode preview ou --mode public.');

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const site = readJson('config/site.json');
const menu = readJson('content/menu.json');
const footerData = readJson('content/footer.json');
const pages = readJson('content/pages.json');
const template = fs.readFileSync(path.join(root, 'templates/page.html'), 'utf8');
const outputDir = path.join(root, 'dist');
const normalizeBase = (value) => value === '/' ? '/' : `/${value.replace(/^\/+|\/+$/g, '')}/`;
const base = normalizeBase(arg('--base', mode === 'public' ? site.basePath : '/'));
const escapeHtml = (value = '') => String(value).replace(/[&<>"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
const url = (relative = '') => `${base}${relative.replace(/^\//, '')}`;
const absoluteUrl = (relative = '') => `${site.siteUrl.replace(/\/$/, '')}${url(relative)}`;

function renderLink(item, className = '') {
  if (item.comingSoon || !item.url) {
    return `<span class="${className} unavailable">${escapeHtml(item.label)} <small>Em breve</small></span>`;
  }
  return `<a class="${className}" href="${url(item.url)}">${escapeHtml(item.label)}</a>`;
}

function renderHeader() {
  const countries = menu.map((item) => `<li><a href="${url(item.url)}">${escapeHtml(item.label)}</a></li>`).join('');
  const identity = site.logo
    ? `<img class="brand-logo" src="${url(site.logo)}" alt="${escapeHtml(site.name)}">`
    : `<span class="brand-text">Imigra<span>Europa</span></span>`;
  return `<header class="site-header">
    <button class="menu-toggle" type="button" aria-controls="site-sidebar" aria-expanded="false" data-menu-open><span aria-hidden="true">☰</span><span>Menu</span></button>
    <a class="brand" href="${url()}">${identity}</a>
    <nav class="country-nav" aria-label="Acesso rápido aos países"><ul>${countries}</ul></nav>
  </header>`;
}

function renderSidebar(page) {
  const groups = menu.map((item, index) => {
    const active = page.output.startsWith(item.url);
    const children = item.children.length ? `<ul>${item.children.map((child) => `<li>${renderLink(child)}</li>`).join('')}</ul>` : '<p class="empty-note">Novas categorias em breve.</p>';
    return `<details ${active || index === 0 ? 'open' : ''}><summary>${escapeHtml(item.label)}</summary><a class="country-overview" href="${url(item.url)}">Visão geral</a>${children}</details>`;
  }).join('');
  return `<aside class="sidebar" id="site-sidebar" aria-label="Navegação principal" data-sidebar>
    <div class="sidebar-heading"><strong>Explorar</strong><button type="button" aria-label="Fechar menu" data-menu-close>×</button></div>
    <nav>${groups}</nav>
  </aside>`;
}

function adPlaceholder(label) {
  return `<aside class="ad-placeholder" aria-label="Espaço publicitário"><span>Publicidade</span><p>${escapeHtml(label)} — desativada nesta prévia</p></aside>`;
}

function renderContent(page) {
  const draft = page.status === 'draft' ? '<p class="draft-badge" role="status">Rascunho — conteúdo não publicado</p>' : '';
  const sections = page.sections.map((section, index) => `<section class="content-section"><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.body)}</p>${index === 0 ? adPlaceholder('Entre seções') : ''}</section>`).join('');
  const image = page.image?.src ? `<figure><img src="${url(page.image.src)}" alt="${escapeHtml(page.image.alt)}"><figcaption>${escapeHtml(page.image.caption || '')}</figcaption></figure>` : `<div class="media-slot"><strong>Espaço para imagem</strong><span>Configure src e alt em content/pages.json.</span></div>`;
  const video = page.videoId ? `<section class="content-section"><h2>Vídeo</h2><div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(page.videoId)}" title="Vídeo: ${escapeHtml(page.title)}" loading="lazy" allowfullscreen></iframe></div></section>` : '';
  const relatedPages = (page.related || []).map((id) => pages.find((item) => item.id === id)).filter(Boolean);
  const related = relatedPages.length ? `<nav class="related" aria-labelledby="related-title"><h2 id="related-title">Conteúdos relacionados</h2><ul>${relatedPages.map((item) => `<li><a href="${url(item.output.replace(/index\.html$/, ''))}">${escapeHtml(item.title)}</a>${item.status === 'draft' ? ' <small>Rascunho</small>' : ''}</li>`).join('')}</ul></nav>` : '';
  return `<article>
    <header class="page-intro"><p class="eyebrow">${escapeHtml(page.eyebrow)}</p>${draft}<h1>${escapeHtml(page.title)}</h1><p class="lead">${escapeHtml(page.intro)}</p></header>
    ${adPlaceholder('Após a introdução')}
    ${page.type === 'home' ? '' : image}
    ${sections}${video}${related}
    ${adPlaceholder('Próximo ao final do conteúdo')}
  </article>`;
}

function renderFooter() {
  const links = footerData.links.map((item) => `<li>${renderLink(item)}</li>`).join('');
  const socials = site.socialLinks.length ? `<ul class="social-links">${site.socialLinks.map((item) => `<li><a href="${escapeHtml(item.url)}">${escapeHtml(item.label)}</a></li>`).join('')}</ul>` : '';
  return `<footer class="site-footer"><div><a class="footer-brand" href="${url()}">${escapeHtml(site.name)}</a><p>${escapeHtml(footerData.note)}</p></div><nav aria-label="Links do rodapé"><ul>${links}</ul></nav>${socials}<p class="copyright">© ${new Date().getUTCFullYear()} ${escapeHtml(site.name)}.</p></footer>`;
}

function fill(values) {
  return template.replace(/{{(\w+)}}/g, (_, key) => values[key] ?? '');
}

fs.rmSync(outputDir, {recursive: true, force: true});
fs.mkdirSync(outputDir, {recursive: true});
for (const page of pages) {
  if (mode === 'public' && page.status === 'draft') continue;
  const pageUrl = page.output.replace(/index\.html$/, '');
  const html = fill({
    language: site.language, metaTitle: `${page.title} | ${site.name}`,
    description: page.description, robots: mode === 'preview' || page.status === 'draft' ? 'noindex, nofollow' : 'index, follow',
    canonical: absoluteUrl(pageUrl), siteName: site.name, base,
    header: renderHeader(), sidebar: renderSidebar(page), content: renderContent(page), footer: renderFooter()
  });
  const destination = path.join(outputDir, page.output);
  fs.mkdirSync(path.dirname(destination), {recursive: true});
  fs.writeFileSync(destination, html);
}
fs.cpSync(path.join(root, 'src/assets'), path.join(outputDir, 'assets'), {recursive: true});
const publicPages = pages.filter((page) => page.status === 'published');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicPages.map((page) => `  <url><loc>${escapeHtml(absoluteUrl(page.output.replace(/index\.html$/, '')))}</loc></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(outputDir, 'robots.txt'), mode === 'public' ? `User-agent: *\nAllow: /\nSitemap: ${absoluteUrl('sitemap.xml')}\n` : 'User-agent: *\nDisallow: /\n');
fs.writeFileSync(path.join(outputDir, 'build-info.json'), JSON.stringify({mode, base, generatedPages: pages.filter((p) => mode === 'preview' || p.status === 'published').map((p) => p.output)}, null, 2));
console.log(`ImigraEuropa: ${mode} gerado em dist/ com base ${base}`);

