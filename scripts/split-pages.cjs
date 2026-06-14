/* split-pages.cjs — one-shot refactor: single-page → 3 pages + shared site.css/site.js */
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..');
const src=fs.readFileSync(path.join(ROOT,'website-preview.html'),'utf8');

const idx=(m,from=0)=>{const i=src.indexOf(m,from);if(i<0)throw new Error('marker not found: '+m);return i;};

/* 1) extract css + js */
const styleOpen=idx('<style>'),styleClose=idx('</style>');
const css=src.slice(styleOpen+7,styleClose).trim()+'\n';
const scriptOpen=src.indexOf('<script>\n/* ─── i18n strings');
if(scriptOpen<0)throw new Error('main script not found');
const scriptClose=src.indexOf('</script>',scriptOpen);
const js=src.slice(scriptOpen+9,scriptClose).trim()+'\n';
fs.writeFileSync(path.join(ROOT,'site.css'),css);
fs.writeFileSync(path.join(ROOT,'site.js'),js);

/* 2) chrome parts */
const bodyOpen=idx('<body dir="rtl">');
const topbarStart=idx('<div class="topbar"');
const skipStart=idx('<a class="skip"');
const mainOpen=idx('<main id="main">');
const mainClose=idx('\n</main>');
const footStart=idx('<footer>');
const footEnd=idx('</footer>')+'</footer>'.length;

const spriteChrome=src.slice(bodyOpen+'<body dir="rtl">'.length,topbarStart).trimEnd(); // sprite + colorwash/particles/cursor/scrollprog
const topbar=src.slice(topbarStart,skipStart).trimEnd();
let skipNav=src.slice(skipStart,mainOpen).trimEnd();
/* inject nav links before nav-women */
skipNav=skipNav.replace('    <a class="nav-women"',
`    <a class="nav-link" href="features.html" data-i="navFeat"></a>
    <a class="nav-link" href="academy.html" data-i="navAcad"></a>
    <a class="nav-women"`);
const footer=src.slice(footStart,footEnd);

/* 3) split main into sections */
const mainContent=src.slice(mainOpen+'<main id="main">'.length,mainClose);
const parts=mainContent.split(/\n(?=<header class="hero"|<section)/).filter(p=>p.trim());
const names=['hero','statband','gap','story','how','aisec','cap','aicoach','rewards','featgrid','prayer','women','vision','trust','faq','final'];
if(parts.length!==names.length)throw new Error('expected 16 sections, got '+parts.length);
const S={};names.forEach((n,i)=>S[n]=parts[i].trimEnd());
/* sanity */
const expect={hero:'class="hero"',statband:'statband',gap:'class="gap"',story:'class="story"',how:'howTag',aisec:'ai-sec',cap:'capTag',aicoach:'aicoach',rewards:'rewTag',featgrid:'featTag',prayer:'spot-prayer',women:'spot-women',vision:'class="vision"',trust:'class="trust"',faq:'class="faq"',final:'id="join"'};
for(const k in expect) if(!S[k].includes(expect[k])) throw new Error('section mismatch: '+k);

/* 4) shared tail */
const tail=`
${footer}

<script src="site.js"></script>
</body>
</html>
`;

/* 5) HOME — original head minus inline style, lean main */
const headHome=src.slice(0,styleOpen)+'<link rel="stylesheet" href="site.css"/>\n</head>\n';
const home=headHome+'<body dir="rtl">\n'+spriteChrome+'\n\n'+topbar+'\n'+skipNav+'\n\n<main id="main">\n'
  +[S.hero,S.how,S.trust,S.faq,S.final].join('\n\n')+'\n</main>\n'+tail;
fs.writeFileSync(path.join(ROOT,'website-preview.html'),home);

/* 6) sub-page head factory */
const subHead=(t,d,slug,extra='')=>`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${t}</title>
<meta name="description" content="${d}"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="FitGuard"/>
<meta property="og:title" content="${t}"/>
<meta property="og:description" content="${d}"/>
<meta property="og:image" content="https://www.fitguardapp.com/og-image.png"/>
<meta property="og:url" content="https://www.fitguardapp.com/${slug}"/>
<meta property="og:locale" content="ar_SA"/>
<meta name="twitter:card" content="summary_large_image"/>
<link rel="canonical" href="https://www.fitguardapp.com/${slug}"/>
<link rel="alternate" hreflang="ar-SA" href="https://www.fitguardapp.com/${slug}"/>
<link rel="alternate" hreflang="x-default" href="https://www.fitguardapp.com/${slug}"/>
<meta name="theme-color" content="#0C0A08"/>
<link rel="icon" href="favicon.svg" type="image/svg+xml"/>
<link rel="apple-touch-icon" href="apple-touch-icon.png"/>
<script defer data-domain="fitguardapp.com" src="https://plausible.io/js/script.js"></script>
<script>window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}</script>
<link rel="preload" href="fonts/ibm-plex-sans-arabic-arabic-700-normal.woff2" as="font" type="font/woff2" crossorigin/>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" defer></script>
${extra}<link rel="stylesheet" href="site.css"/>
</head>
`;
const mark=(nav,href)=>nav.replace(`href="${href}"`,`href="${href}" aria-current="page"`);

/* 7) FEATURES page */
const featHero=`<section class="page-hero"><div class="wrap">
  <div class="sec-tag reveal" data-i="featPTag"></div>
  <h1 class="sec-title reveal d1" data-i="featPTitle"></h1>
  <p class="sec-sub reveal d2" data-i="featPSub"></p>
</div></section>`;
const features=subHead('مميزات FitGuard — فحص الجاهزية والحماية من الإصابة','كل مميزات FitGuard: جاهزية يومية، مسح بالذكاء الاصطناعي، مدرّب ذكي بالعربي، برنامج نسائي، أوقات الصلاة ووضع رمضان.','features')
  +'<body dir="rtl">\n'+spriteChrome+'\n'+mark(skipNav,'features.html')+'\n\n<main id="main">\n'
  +[featHero,S.statband,S.gap,S.story,S.aisec,S.cap,S.aicoach,S.rewards,S.featgrid,S.prayer,S.women,S.vision,S.final].join('\n\n')+'\n</main>\n'+tail;
fs.writeFileSync(path.join(ROOT,'features.html'),features);

/* 8) ACADEMY page */
const blogLD=`<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Blog","name":"FitGuard Academy","inLanguage":"ar","url":"https://www.fitguardapp.com/academy","publisher":{"@type":"Organization","name":"Vigzag"}}
</script>
`;
const card=(n,cat,icon)=>`    <article class="ag-card reveal d${(n-1)%3+1}" data-cat="${cat}">
      <div class="ag-media c-${cat}"><svg class="icon"><use href="#${icon}"/></svg></div>
      <div class="ag-body">
        <span class="ag-tag c-${cat}" data-i="af${cat[0].toUpperCase()+cat.slice(1)}"></span>
        <h3 class="ag-t" data-i="ar${n}t"></h3>
        <p class="ag-p" data-i="ar${n}p"></p>
        <span class="ag-meta" data-i="ar${n}m"></span>
      </div>
    </article>`;
const acadSection=`<section class="acad"><div class="wrap">
  <div class="sec-tag reveal" data-i="acadTag"></div>
  <h1 class="sec-title reveal d1" data-i="acadTitle"></h1>
  <p class="sec-sub reveal d2" data-i="acadSub"></p>
  <div class="acad-filter reveal d2" role="tablist" aria-label="تصنيفات المقالات">
    <button class="af on" data-cat="all" data-i="afAll"></button>
    <button class="af" data-cat="fit" data-i="afFit"></button>
    <button class="af" data-cat="health" data-i="afHealth"></button>
    <button class="af" data-cat="injury" data-i="afInjury"></button>
  </div>
  <div class="acad-grid">
${card(1,'injury','ic-bandage')}
${card(2,'fit','ic-dumbbell')}
${card(3,'health','ic-moon')}
${card(4,'injury','ic-heart')}
${card(5,'fit','ic-chart')}
${card(6,'health','ic-check')}
  </div>
  <p class="acad-note reveal" data-i="acadNote"></p>
</div></section>`;
const academy=subHead('أكاديمية FitGuard — لياقة، صحة، ووقاية من الإصابات','مقالات قصيرة بالعربي في اللياقة والصحة والوقاية من الإصابات والتعافي — من فريق FitGuard.','academy',blogLD)
  +'<body dir="rtl">\n'+spriteChrome+'\n'+mark(skipNav,'academy.html')+'\n\n<main id="main">\n'
  +[acadSection,S.final].join('\n\n')+'\n</main>\n'+tail;
fs.writeFileSync(path.join(ROOT,'academy.html'),academy);

console.log('✓ site.css '+(css.length/1024).toFixed(1)+'KB · site.js '+(js.length/1024).toFixed(1)+'KB');
console.log('✓ home sections: hero,how,trust,faq,final · features: 12 · academy: grid+final');
