# FitGuard — Technical, SEO & GEO Remediation Tasks

> ملف مهام تقني لموقع FitGuard. سلّمه لـ Claude Code وخلّيه يشتغل من فوق لتحت بالترتيب (P0 → P1 → GEO).
> A prioritized, executable checklist. Each task has: **Why**, **How** (with snippets), and **Done when** (acceptance criteria).

---

## 0. How to use this document (Claude Code)

1. **Detect the stack first.** Inspect the repo before changing anything. Identify: is it plain static HTML, or a generator/framework (Astro, Next.js, Eleventy, Vite, etc.)? Where does the homepage content come from (a JS bundle? a template?) Where is the hosting config (`netlify.toml`, `vercel.json`, `_redirects`, nginx, Cloudflare Pages)? Report findings before editing.
2. **Work top-down by priority.** Finish all P0 before P1. GEO depends on P0-1 being done.
3. **After each task:** build the site, verify the "Done when" criteria, then commit with a clear message (e.g. `fix(seo): canonical now matches served host`).
4. **Do not break the pages that already work.** `women`, `privacy`, and `terms` render their full bilingual content in static HTML — preserve that behavior. The problem is concentrated in the homepage (`index.html`).
5. **Test in both languages** (Arabic RTL and English LTR) after every change.
6. **Don't invent data.** No fake review counts, ratings, prices, or testimonials in markup. Pre-launch = no `aggregateRating`.

---

## Project context (known facts)

- **Product:** FitGuard — positioned as the first Arabic AI fitness *safety* coach (readiness check + injury prevention). Pre-launch landing page. Target launch: KSA, Q4 2026.
- **Pages:** `index.html` (home), `women` (`women.html`), `privacy` (`privacy.html`), `terms` (`terms.html`).
- **Stack signals:** Supabase (waitlist email store), TestFlight (iOS early access), cookieless analytics, mostly static HTML. **Homepage main content is injected by JavaScript** and is missing from the static HTML.
- **Domain:** site is served on `https://www.fitguardapp.com/` but the `<link rel="canonical">` currently points to the non-www `https://fitguardapp.com/` → **host/canonical conflict.**
- **i18n:** bilingual Arabic/English. **Before doing hreflang (P0-4), determine the architecture:** are AR and EN on *separate URLs* (e.g. `/` vs `/en/`) or the *same URL* with an in-page toggle? The fix differs — see P0-4.

---

## P0 — Critical (ship these first)

### ☐ P0-1 — Render the homepage content in static HTML (stop JS-only content)
**Why:** The static `index.html` is nearly empty (icons/numbers only); the headline, value props, and CTA copy are injected by JS. Most search crawlers and **almost all AI answer-engine crawlers do not execute JavaScript**, so they see a blank page. This is the single biggest issue and it blocks both SEO and GEO.
**How:**
- Preferred: pre-render / SSG / SSR the homepage so the real H1, hero copy, feature sections, and CTA exist in the served HTML (matches what `women`/`privacy` already do).
- If keeping a JS-driven page: at minimum emit the critical above-the-fold content (H1, sub-headline, primary value props, CTA, footer links) into the static HTML, and let JS only enhance/animate it.
- Keep exactly one `<h1>` per page and a logical heading order (`h1 → h2 → h3`).
**Done when:** Loading the homepage with JavaScript disabled (or `curl https://www.fitguardapp.com/ | less`, or "View Source") shows the real headline, the core feature copy, the CTA text, and footer links — not just emoji/icons.

### ☐ P0-2 — Resolve www vs non-www and fix the canonical
**Why:** Serving on `www` while the canonical claims non-www splits ranking signals and confuses crawlers.
**How:**
- Pick ONE canonical host. Recommended: keep `www.fitguardapp.com` (what's served today).
- Add a 301 redirect from the other host to the chosen one (host-level config — `_redirects`, `netlify.toml`, `vercel.json`, or DNS/CDN rule).
- Set a self-referencing canonical on **every** page to the chosen host:
```html
<link rel="canonical" href="https://www.fitguardapp.com/" />
```
- Update `og:url` and all internal links to use the same host, and drop `.html` if you standardize on clean URLs (`/women`, `/privacy`, `/terms`).
**Done when:** Every page's canonical and `og:url` use the same host; the non-canonical host 301-redirects to it; internal links are consistent (no mix of `index.html` + clean URLs).

### ☐ P0-3 — Add `robots.txt` and an XML sitemap
**Why:** Gives crawlers an explicit map and crawl policy; required baseline for SEO and for being discoverable by AI crawlers.
**How — `/robots.txt`:**
```
User-agent: *
Allow: /

# AI answer engines (GEO) — allow so FitGuard can be cited in AI answers
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: https://www.fitguardapp.com/sitemap.xml
```
**How — `/sitemap.xml`:** list only canonical URLs (`/`, `/women`, `/privacy`, `/terms`) with `<lastmod>`.
**Done when:** `/robots.txt` and `/sitemap.xml` both return 200; robots references the sitemap; sitemap validates and contains only canonical URLs.

### ☐ P0-4 — hreflang (conditional on i18n architecture — decide first)
**Why:** Tells search engines which language/region version to show and prevents duplicate-content issues across AR/EN.
**How:**
- **Case A — separate URLs per language** (e.g. `/` Arabic, `/en/` English): add reciprocal hreflang in the `<head>` of *every* page:
```html
<link rel="alternate" hreflang="ar-SA" href="https://www.fitguardapp.com/" />
<link rel="alternate" hreflang="en"    href="https://www.fitguardapp.com/en/" />
<link rel="alternate" hreflang="x-default" href="https://www.fitguardapp.com/" />
```
- **Case B — one URL shows both languages (in-page toggle):** hreflang does NOT apply (there's one URL). Instead: set the primary `<html lang>`/`dir` to the dominant language, ensure both languages exist in static HTML, and skip hreflang. Longer term, consider splitting into language-specific URLs for cleaner targeting.
**Done when:** Either reciprocal, validating hreflang tags exist on all pages (Case A), or a documented decision that the site is single-URL bilingual and hreflang is intentionally omitted (Case B).

### ☐ P0-5 — Fix `lang`/`dir`, Arabic-first meta, and titles
**Why:** The primary `meta description` is in English even though the target is Arabic-first KSA; `og:description` is Arabic (mismatch). Correct language attributes also help crawlers and accessibility.
**How:**
- Set `<html lang="ar" dir="rtl">` on Arabic pages (and `lang="en" dir="ltr"` on English ones, per the i18n decision).
- Make the primary `<title>` and `<meta name="description">` Arabic-first, keyword-relevant, and aligned with `og:`/`twitter:` values. Example:
```html
<title>FitGuard — مدرب اللياقة الذكي بالعربي يحميك من الإصابة</title>
<meta name="description" content="أول مدرب لياقة ذكي بالعربي يفحص جاهزيتك ويحميك من الإصابة. قريباً في السعودية — انضم لقائمة الانتظار." />
```
- Replace the generic "Coming Soon" homepage `<title>` with a descriptive, query-relevant one (keep a "قريباً" cue if desired).
**Done when:** `lang`/`dir` are correct per page; title + meta description are Arabic-first and consistent across `<meta>`, `og:`, and `twitter:`.

---

## P1 — High priority

### ☐ P1-1 — Structured data (JSON-LD) — Organization, WebSite, MobileApplication
**Why:** Helps Google understand the entity and unlocks rich results; **also a primary GEO signal** (LLMs lean on structured, machine-readable facts).
**How:** Add to `<head>` (or end of `<body>`). Use real values; omit anything unknown.
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "FitGuard",
  "legalName": "Laft Co.",
  "url": "https://www.fitguardapp.com/",
  "logo": "https://www.fitguardapp.com/og-image.png",
  "email": "hello@fitguardapp.com",
  "sameAs": []  /* add real social/profile URLs when available */
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  "name": "FitGuard",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "iOS",
  "inLanguage": ["ar", "en"],
  "description": "أول مدرب لياقة ذكي بالعربي يفحص جاهزيتك ويحميك من الإصابة.",
  "url": "https://www.fitguardapp.com/"
  /* NO aggregateRating / reviewCount pre-launch */
}
</script>
```
- Add a `WebSite` node too. Only include `SearchAction` if the site actually has search.
**Done when:** Google Rich Results Test and the Schema.org validator pass with no errors for Organization + MobileApplication; no fabricated rating/price fields.

### ☐ P1-2 — Image alt text, lazy-loading, and modern formats
**Why:** Images currently have empty `alt` (accessibility + SEO loss); unoptimized images hurt performance.
**How:**
- Add meaningful `alt` to every content image; mark purely decorative images `alt=""` + `aria-hidden="true"`.
- Add `loading="lazy"` to below-the-fold images and explicit `width`/`height` (prevents layout shift).
- Serve WebP/AVIF with fallbacks; compress the OG image.
**Done when:** No content image has a missing/empty `alt`; below-fold images are lazy-loaded with dimensions set; Lighthouse "Properly size images" / "Serve images in next-gen formats" pass.

### ☐ P1-3 — Core Web Vitals / performance
**Why:** Ranking factor and a real UX issue given the heavy animation/mockups; matters on mid/low-end phones common in the target market.
**How:**
- `defer` (or `async`) non-critical JS; inline critical CSS; preconnect to font origins.
- Set explicit dimensions on media to keep CLS ≈ 0.
- Minimize the JS that builds the homepage once P0-1 makes content static.
- Audit third-party scripts (analytics, Supabase client) — load lazily where possible.
**Done when:** Mobile Lighthouse: Performance ≥ 80, LCP < 2.5s, CLS < 0.1, INP healthy; verified in PageSpeed Insights (field or lab).

### ☐ P1-4 — Accessibility pass (WCAG 2.1 AA)
**Why:** Legal/UX baseline and overlaps with SEO/GEO (semantic structure).
**How:** Verify color contrast ≥ 4.5:1 on the dark theme; visible focus states on all interactive elements; the "تخطّ إلى المحتوى" skip link works and targets `#main` (keep it); form inputs have associated `<label>`s; the waitlist input has an accessible name and error/success messages are announced.
**Done when:** Lighthouse Accessibility ≥ 95 and a manual keyboard-only pass can reach and submit the waitlist form.

### ☐ P1-5 — Custom 404 page
**Why:** Avoids dead-ends and soft-404 issues with crawlers.
**How:** Add a branded `/404` (bilingual) with links back to home and the waitlist; ensure the host returns a real 404 status.
**Done when:** An unknown URL returns HTTP 404 and renders the branded page with working nav.

---

## GEO — Generative Engine Optimization (be citable by AI answer engines)

> Goal: when someone asks ChatGPT / Perplexity / Google AI Overviews / Claude "what is the best Arabic fitness safety app" or "what is FitGuard", the answer surfaces FitGuard accurately. **Prerequisite: P0-1 (static content) and P1-1 (structured data) must be done — AI crawlers generally can't see JS-rendered content.**

### ☐ GEO-1 — Add `/llms.txt`
**Why:** Emerging convention giving LLMs a clean, curated markdown summary of the site.
**How — create `/llms.txt`:**
```
# FitGuard

> FitGuard is the first Arabic-language AI fitness *safety* coach. It checks a user's readiness before training and helps prevent injury. Launching in Saudi Arabia in Q4 2026. Built by Laft Co.

## What it is
- An Arabic-first (also English) fitness app focused on safety and injury prevention, not just weight loss.
- Adapts training to readiness; emphasizes data privacy (PDPL-compliant).

## For women
- A cycle-aware program that adjusts intensity across the menstrual cycle.
- Culturally-mindful, modest, home-friendly workouts; no mandatory photos; encrypted data.

## Status
- Pre-launch waitlist; early access via TestFlight (iOS).

## Links
- Home: https://www.fitguardapp.com/
- For women: https://www.fitguardapp.com/women
- Privacy: https://www.fitguardapp.com/privacy
- Terms: https://www.fitguardapp.com/terms
- Contact: hello@fitguardapp.com
```
**Done when:** `/llms.txt` returns 200 as `text/plain` markdown and accurately summarizes the product with working links.

### ☐ GEO-2 — Crawler access policy (confirm in robots.txt)
**Why:** To be cited, the answer-engine bots must be allowed. (This is a strategic choice — confirm you want it.)
**How:** Ensure the AI user-agents in P0-3 are `Allow: /` (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended). If any should be blocked, document the decision.
**Done when:** robots.txt explicitly states the policy for each major AI crawler.

### ☐ GEO-3 — Add an FAQ section + FAQPage schema
**Why:** LLMs extract direct question→answer pairs extremely well; this is one of the highest-leverage GEO tactics.
**How:** Add a short visible bilingual FAQ to the homepage (e.g. "ما هو FitGuard؟", "كيف يحميني من الإصابة؟", "هل يناسب النساء؟", "متى يُطلق؟", "كيف أنضم لقائمة الانتظار؟") and mirror it in `FAQPage` JSON-LD:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "ما هو FitGuard؟",
    "acceptedAnswer": { "@type": "Answer", "text": "FitGuard هو أول مدرب لياقة ذكي بالعربي يركّز على السلامة ومنع الإصابة..." }
  }]
}
</script>
```
**Done when:** The visible FAQ and the FAQPage schema match 1:1, and the schema validates.

### ☐ GEO-4 — Entity clarity & extractable facts
**Why:** AI engines answer better when key facts are stated plainly in prose (not only in graphics).
**How:** Ensure the static HTML states, in plain sentences: what FitGuard is, who makes it (Laft Co.), what makes it different (Arabic-first, safety/injury-prevention, cycle-aware women's mode, privacy), where/when it launches (KSA, Q4 2026), and how to join. Avoid burying these facts inside images/emoji.
**Done when:** A plain-text extraction of each page contains these facts as readable sentences.

### ☐ GEO-5 — (Optional) `llms-full.txt` for deeper context
**Why:** A longer companion to `llms.txt` with full feature descriptions, useful as the product matures.
**How:** Add `/llms-full.txt` with expanded sections once launch content is finalized.
**Done when:** Deferred until post-MVP; tracked but not required now.

---

## Final verification checklist (run all at the end)

- ☐ Homepage shows real content with JS disabled (P0-1)
- ☐ One canonical host; non-canonical 301-redirects; self-referencing canonicals everywhere (P0-2)
- ☐ `/robots.txt` and `/sitemap.xml` return 200 and are consistent (P0-3)
- ☐ hreflang valid OR single-URL-bilingual decision documented (P0-4)
- ☐ `lang`/`dir` correct; Arabic-first title + description consistent with og/twitter (P0-5)
- ☐ Organization + MobileApplication (+ WebSite) JSON-LD pass Rich Results Test (P1-1)
- ☐ All content images have alt; below-fold lazy + dimensioned; next-gen formats (P1-2)
- ☐ Mobile Lighthouse: Performance ≥ 80, SEO ≥ 95, Accessibility ≥ 95; CWV in range (P1-3, P1-4)
- ☐ Branded 404 returns HTTP 404 (P1-5)
- ☐ `/llms.txt` live and accurate (GEO-1)
- ☐ AI-crawler policy explicit in robots.txt (GEO-2)
- ☐ FAQ + FAQPage schema match and validate (GEO-3)
- ☐ Key entity facts present as plain text on each page (GEO-4)

**Suggested tools:** Google Search Console (URL Inspection → compare crawled vs rendered), Rich Results Test, Schema.org Validator, Lighthouse / PageSpeed Insights, `curl`/View-Source for the JS-off check. **GEO smoke test:** after the site is indexed, ask ChatGPT, Perplexity, and Claude "what is FitGuard?" and check accuracy/citation.

---

## Out of scope (don't do here)

- No fake reviews, ratings, prices, or testimonials in markup.
- Don't make medical/clinical "injury prevention" guarantees in copy — keep claims measured and add a brief disclaimer (product/legal task, not a code task).
- App Store listing / TestFlight setup is separate from this site work.
