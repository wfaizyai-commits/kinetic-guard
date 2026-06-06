#!/usr/bin/env node
/**
 * build-static.js — pre-renders the homepage so its content exists in the served
 * HTML (SEO + GEO). The source (website-preview.html) fills content via JS
 * (data-i / data-i-ph / data-i-al + applyLang). Crawlers and AI answer engines
 * don't run JS, so we "bake" the Arabic (default) strings into the static HTML.
 * applyLang still runs at runtime and re-applies / switches language.
 *
 * Usage:  node build-static.js   →  writes dist-site/index.html
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'website-preview.html');
const OUT = path.join(ROOT, 'dist-site', 'index.html');

let html = fs.readFileSync(SRC, 'utf8');

/* 1) Extract the `T` translation object with string-aware brace matching. */
const anchor = html.indexOf('const T = {');
if (anchor < 0) throw new Error('Could not find `const T = {` in source.');
let i = html.indexOf('{', anchor);
const litStart = i;
let depth = 0, quote = null, esc = false, litEnd = -1;
for (; i < html.length; i++) {
  const c = html[i];
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
const literal = html.slice(litStart, litEnd + 1);
// It's our own data-only object literal → safe to eval in this build tool.
const T = eval('(' + literal + ')');
const ar = T.ar || {};
if (!ar.h1) throw new Error('T.ar looks empty — aborting to avoid a blank build.');

const attrEsc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

let injected = 0, missing = new Set();

/* 2) data-i → element innerHTML (elements are empty in source). */
html = html.replace(/(\sdata-i="([a-zA-Z0-9]+)"[^>]*>)(\s*<\/)/g, (m, open, key, close) => {
  if (ar[key] == null) { missing.add(key); return m; }
  injected++;
  return open + ar[key] + close;
});

/* 3) data-i-ph → add placeholder; data-i-al → add aria-label. */
html = html.replace(/data-i-ph="([a-zA-Z0-9]+)"/g, (m, key) =>
  ar[key] != null ? `${m} placeholder="${attrEsc(ar[key])}"` : m);
html = html.replace(/data-i-al="([a-zA-Z0-9]+)"/g, (m, key) =>
  ar[key] != null ? `${m} aria-label="${attrEsc(ar[key])}"` : m);

fs.writeFileSync(OUT, html);
console.log(`✓ built ${path.relative(ROOT, OUT)} — injected ${injected} strings` +
  (missing.size ? `, ${missing.size} keys had no ar value (${[...missing].slice(0,6).join(', ')}…)` : ''));
