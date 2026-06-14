#!/usr/bin/env node
/**
 * build-static.cjs — pre-renders the site pages so their content exists in the
 * served HTML (SEO + GEO). Sources fill content via JS (data-i / data-i-ph /
 * data-i-al + applyLang in site.js). Crawlers and AI answer engines don't run
 * JS, so we "bake" the Arabic (default) strings into the static HTML.
 * applyLang still runs at runtime and re-applies / switches language.
 *
 * Usage:  node build-static.cjs
 *   website-preview.html → dist-site/index.html
 *   features.html        → dist-site/features.html
 *   academy.html         → dist-site/academy.html
 *   + copies shared assets (site.css, site.js, fonts/, exercise images)
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUTDIR = path.join(ROOT, 'dist-site');

/* 1) Extract the `T` translation object from site.js with string-aware brace matching. */
const jsSrc = fs.readFileSync(path.join(ROOT, 'site.js'), 'utf8');
const anchor = jsSrc.indexOf('const T = {');
if (anchor < 0) throw new Error('Could not find `const T = {` in site.js.');
let i = jsSrc.indexOf('{', anchor);
const litStart = i;
let depth = 0, quote = null, esc = false, litEnd = -1;
for (; i < jsSrc.length; i++) {
  const c = jsSrc[i];
  if (esc) { esc = false; continue; }
  if (quote) {
    if (c === '\\') esc = true;
    else if (c === quote) quote = null;
    continue;
  }
  if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
  if (c === '{') depth++;
  else if (c === '}') { depth--; if (depth === 0) { litEnd = i; break; } }
}
if (litEnd < 0) throw new Error('Could not balance the T object braces.');
// It's our own data-only object literal → safe to eval in this build tool.
const T = eval('(' + jsSrc.slice(litStart, litEnd + 1) + ')');
const ar = T.ar || {};
if (!ar.h1) throw new Error('T.ar looks empty — aborting to avoid a blank build.');

const attrEsc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/* 2) Bake each page. */
const PAGES = [
  ['website-preview.html', 'index.html'],
  ['features.html', 'features.html'],
  ['academy.html', 'academy.html'],
  ['women.html', 'women.html'],
  ['academy-warmup-mistakes.html', 'academy-warmup-mistakes.html'],
  ['academy-first-weight.html', 'academy-first-weight.html'],
  ['academy-sleep-results.html', 'academy-sleep-results.html'],
  ['academy-return-from-injury.html', 'academy-return-from-injury.html'],
  ['academy-beginner-split.html', 'academy-beginner-split.html'],
];
for (const [srcName, outName] of PAGES) {
  let html = fs.readFileSync(path.join(ROOT, srcName), 'utf8');
  let injected = 0; const missing = new Set();

  // data-i → element innerHTML (elements are empty in source).
  html = html.replace(/(\sdata-i="([a-zA-Z0-9]+)"[^>]*>)(\s*<\/)/g, (m, open, key, close) => {
    if (ar[key] == null) { missing.add(key); return m; }
    injected++;
    return open + ar[key] + close;
  });
  // data-i-ph → placeholder; data-i-al → aria-label.
  html = html.replace(/data-i-ph="([a-zA-Z0-9]+)"/g, (m, key) =>
    ar[key] != null ? `${m} placeholder="${attrEsc(ar[key])}"` : m);
  html = html.replace(/data-i-al="([a-zA-Z0-9]+)"/g, (m, key) =>
    ar[key] != null ? `${m} aria-label="${attrEsc(ar[key])}"` : m);

  fs.writeFileSync(path.join(OUTDIR, outName), html);
  console.log(`✓ ${srcName} → dist-site/${outName} — ${injected} strings` +
    (missing.size ? ` (${missing.size} keys missing: ${[...missing].slice(0, 5).join(', ')}…)` : ''));
}

/* 3) Copy shared assets so relative paths resolve from dist-site/. */
for (const f of ['site.css', 'site.js', 'favicon.svg']) {
  fs.copyFileSync(path.join(ROOT, f), path.join(OUTDIR, f));
}
const copyDir = (from, to) => {
  fs.mkdirSync(to, { recursive: true });
  for (const f of fs.readdirSync(from)) {
    const s = path.join(from, f);
    if (fs.statSync(s).isFile()) fs.copyFileSync(s, path.join(to, f));
  }
};
copyDir(path.join(ROOT, 'fonts'), path.join(OUTDIR, 'fonts'));
// hero exercise thumbnails (referenced as public/exercises/*_sm.jpg)
const exDirOut = path.join(OUTDIR, 'public', 'exercises');
fs.mkdirSync(exDirOut, { recursive: true });
for (const f of fs.readdirSync(path.join(ROOT, 'public', 'exercises'))) {
  if (f.endsWith('_sm.jpg')) fs.copyFileSync(path.join(ROOT, 'public', 'exercises', f), path.join(exDirOut, f));
}
console.log('✓ assets copied: site.css, site.js, favicon, fonts/, public/exercises/*_sm.jpg');
