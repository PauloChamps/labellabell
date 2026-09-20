const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, 'dist', file), 'utf8');
const build = (...args) => execFileSync(process.execPath, ['scripts/build.js', ...args], {cwd: root});

test('prévia gera todas as páginas com componentes compartilhados e noindex', () => {
  build('--mode', 'preview');
  const info = JSON.parse(read('build-info.json'));
  assert.equal(info.generatedPages.length, 6);
  for (const file of info.generatedPages) {
    const html = read(file);
    assert.match(html, /data-sidebar/);
    assert.match(html, /class="site-footer"/);
    assert.match(html, /noindex, nofollow/);
    assert.doesNotMatch(html, /pagead2\.googlesyndication/);
  }
});

test('build público respeita base path e exclui rascunhos', () => {
  build('--mode', 'public', '--base', '/repositorio-teste/');
  const info = JSON.parse(read('build-info.json'));
  assert.deepEqual(info.generatedPages, ['index.html']);
  assert.match(read('index.html'), /href="\/repositorio-teste\/assets\/css\/styles\.css"/);
  assert.equal(fs.existsSync(path.join(root, 'dist/portugal/index.html')), false);
  const sitemap = read('sitemap.xml');
  assert.match(sitemap, /<url>/);
  assert.doesNotMatch(sitemap, /portugal/);
});

test('links locais da prévia apontam para destinos gerados', () => {
  build('--mode', 'preview');
  const info = JSON.parse(read('build-info.json'));
  const generated = new Set(info.generatedPages);
  for (const file of info.generatedPages) {
    for (const match of read(file).matchAll(/href="\/([^"#?]*)"/g)) {
      const target = match[1];
      if (target.startsWith('assets/')) assert.ok(fs.existsSync(path.join(root, 'dist', target)), `${file}: ${target}`);
      else assert.ok(generated.has(target ? `${target.replace(/\/$/, '')}/index.html` : 'index.html'), `${file}: /${target}`);
    }
  }
});

