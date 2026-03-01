const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const SITE_URL = 'https://dopamint.app';
const LOGO_URL = 'https://dopamint.app/logo.png';
const contentDir = path.join(__dirname, 'content/blog');
const blogOutputDir = path.join(__dirname, 'blog');

if (!fs.existsSync(blogOutputDir)) fs.mkdirSync(blogOutputDir, { recursive: true });

// ─────────────────────────────────────────────
// READ & PARSE POSTS
// ─────────────────────────────────────────────
const posts = [];
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
files.forEach(file => {
  const raw = fs.readFileSync(path.join(contentDir, file), 'utf8');
  const { data, content } = matter(raw);
  if (!data.slug) return;
  posts.push({ ...data, content, htmlContent: marked(content) });
});
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// ─────────────────────────────────────────────
// SHARED CSS (Light Recap-inspired theme)
// ─────────────────────────────────────────────
const sharedCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --mint: #00e5a0;
    --mint-dark: #00b87d;
    --bg: #f4f5f7;
    --card: #ffffff;
    --text: #111318;
    --muted: #6b7280;
    --light: #9ca3af;
    --border: #e5e7eb;
    --font: 'Inter', system-ui, sans-serif;
  }
  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: var(--font); font-size: 16px; line-height: 1.7; -webkit-font-smoothing: antialiased; }
  a { text-decoration: none; color: inherit; }
  img { display: block; max-width: 100%; }
  #progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: var(--mint); width: 0%; z-index: 9999; transition: width .1s linear; }
  nav { background: #fff; border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; }
  .nav-inner { max-width: 1160px; margin: 0 auto; padding: 0 24px; height: 62px; display: flex; align-items: center; justify-content: space-between; }
  .nav-logo { display: flex; align-items: center; gap: 9px; font-weight: 800; font-size: 1.1rem; color: var(--text); }
  .logo-mark { width: 30px; height: 30px; background: var(--mint); border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .nav-links { display: flex; align-items: center; gap: 28px; }
  .nav-links a { font-size: .9rem; color: var(--muted); font-weight: 500; }
  .nav-links a:hover { color: var(--text); }
  .nav-cta { background: var(--text); color: #fff; font-weight: 700; font-size: .88rem; padding: 8px 20px; border-radius: 8px; }
  .nav-cta:hover { background: #222; }
  .cat-tag { display: inline-flex; align-items: center; gap: 5px; color: var(--mint-dark); font-size: .78rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }
  .author-avatar { background: var(--mint); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  footer { background: #fff; border-top: 1px solid var(--border); padding: 56px 24px 36px; margin-top: 0; }
  .footer-inner { max-width: 1160px; margin: 0 auto; display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 40px; }
  .footer-brand p { color: var(--muted); font-size: .87rem; line-height: 1.7; margin-top: 10px; max-width: 200px; }
  .footer-col h4 { font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--light); margin-bottom: 14px; }
  .footer-col a { display: block; color: var(--muted); font-size: .88rem; margin-bottom: 9px; }
  .footer-col a:hover { color: var(--text); }
  .footer-bottom { max-width: 1160px; margin: 32px auto 0; padding-top: 24px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  .footer-bottom p { font-size: .82rem; color: var(--light); }
  @media (max-width: 640px) {
    .nav-links { display: none; }
    .footer-inner { grid-template-columns: 1fr 1fr; gap: 24px; }
    .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
  }
`;

// ─────────────────────────────────────────────
// NAV & FOOTER
// ─────────────────────────────────────────────
const navHTML = `
<nav>
  <div class="nav-inner">
    <a href="/" class="nav-logo">
      <div class="logo-mark">🧠</div>
      DopaMint
    </a>
    <div class="nav-links">
      <a href="/blog/">Blog</a>
      <a href="https://app.dopamint.app">App</a>
      <a href="https://app.dopamint.app">Sign In</a>
    </div>
    <a href="https://app.dopamint.app" class="nav-cta">Try Free →</a>
  </div>
</nav>`;

const footerHTML = `
<footer>
  <div class="footer-inner">
    <div class="footer-brand">
      <a href="/" class="nav-logo"><div class="logo-mark">🧠</div>DopaMint</a>
      <p>Science-backed tools to help ADHD brains actually start — and finish.</p>
    </div>
    <div class="footer-col">
      <h4>Blog</h4>
      <a href="/blog/">All Articles</a>
      <a href="/blog/">ADHD Tips</a>
      <a href="/blog/">Productivity</a>
    </div>
    <div class="footer-col">
      <h4>Product</h4>
      <a href="https://app.dopamint.app">Try DopaMint</a>
      <a href="https://app.dopamint.app">Sign In</a>
    </div>
    <div class="footer-col">
      <h4>Company</h4>
      <a href="/">Home</a>
      <a href="https://app.dopamint.app">Contact</a>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© ${new Date().getFullYear()} DopaMint. All rights reserved.</p>
    <p>Built for ADHD brains 🧠</p>
  </div>
</footer>`;

const progressBarJS = `
<script>
window.addEventListener('scroll',()=>{
  const d=document.documentElement;
  document.getElementById('progress-bar').style.width=(d.scrollTop/(d.scrollHeight-d.clientHeight))*100+'%';
});
</script>`;

// ─────────────────────────────────────────────
// COVER IMAGE / PLACEHOLDER
// ─────────────────────────────────────────────
const gradients = [
  ['#e0f7ef','#a7f3d0','🧠'],
  ['#ede9fe','#c4b5fd','⚡'],
  ['#fef3c7','#fcd34d','🎯'],
  ['#fee2e2','#fca5a5','🔥'],
  ['#dbeafe','#93c5fd','💡'],
  ['#fce7f3','#f9a8d4','🚀'],
];
function imgPlaceholder(slug, h, fontSize) {
  const g = gradients[Math.abs((slug||'x').charCodeAt(0)) % gradients.length];
  return `<div style="width:100%;height:${h}px;background:linear-gradient(135deg,${g[0]},${g[1]});display:flex;align-items:center;justify-content:center;font-size:${fontSize}px">${g[2]}</div>`;
}
function coverImg(post, h, fontSize) {
  if (post.coverImage) return `<img src="${post.coverImage}" alt="${post.h1||post.title}" style="width:100%;height:${h}px;object-fit:cover">`;
  return imgPlaceholder(post.slug, h, fontSize);
}
function ogImage(post) {
  if (post.coverImage) return post.coverImage;
  return LOGO_URL;
}

// ─────────────────────────────────────────────
// TOC HELPERS
// ─────────────────────────────────────────────
function generateTOC(html) {
  const items = [];
  const re = /<h2[^>]*>(.*?)<\/h2>/gi;
  let m, i = 0;
  while ((m = re.exec(html)) !== null) {
    items.push({ text: m[1].replace(/<[^>]+>/g,''), id: `s${i++}` });
  }
  return items;
}
function injectIds(html) {
  let i = 0;
  return html.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (_,a,c) => `<h2${a} id="s${i++}">${c}</h2>`);
}

// ─────────────────────────────────────────────
// SOURCES SECTION
// ─────────────────────────────────────────────
function sourcesSection(sources) {
  if (!sources || !sources.length) return '';
  const items = sources.map((s, i) => `
    <li class="source-item">
      <span class="source-verified" title="Verified external source">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-.723 3.065 3.745 3.745 0 01-3.065.723A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.065-.723 3.745 3.745 0 01-.723-3.065A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 01.723-3.065 3.745 3.745 0 013.065-.723A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.065.723 3.745 3.745 0 01.723 3.065A3.745 3.745 0 0121 12z" stroke="#00b87d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Verified
      </span>
      <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="source-link">${s.label || s.url}</a>
    </li>`).join('');
  return `
  <div class="sources-section">
    <h2 class="sources-title">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0">
        <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke="#111318" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Sources & References
    </h2>
    <p class="sources-note">All sources are linked to original research, studies, or publications.</p>
    <ol class="sources-list">${items}</ol>
  </div>`;
}

// ─────────────────────────────────────────────
// DOPAMINT TOOL WIDGET
// ─────────────────────────────────────────────
const toolWidget = `
<div class="dm-widget">
  <div class="dm-widget-inner">
    <span class="dm-badge">⚡ Try DopaMint Free</span>
    <h3 class="dm-widget-title">What task are you avoiding right now?</h3>
    <p class="dm-widget-sub">Type it below — get a dopamine-backed nudge to start.</p>
    <div class="dm-row">
      <input type="text" id="dm-input" class="dm-input" placeholder="e.g. Write the intro for my report..." maxlength="100">
      <button class="dm-btn" onclick="dmNudge()">Get Nudge →</button>
    </div>
    <div id="dm-result" class="dm-result" style="display:none">
      <p id="dm-result-text"></p>
      <a href="https://app.dopamint.app" class="dm-result-link">Open DopaMint for the full experience →</a>
    </div>
  </div>
</div>
<style>
  .dm-widget{background:#f0fdf8;border:1px solid #6ee7b7;border-radius:14px;padding:28px 32px;margin:2.5rem 0}
  .dm-badge{display:inline-block;background:#d1fae5;color:#065f46;padding:3px 12px;border-radius:100px;font-size:.72rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:12px}
  .dm-widget-title{font-size:1.15rem;font-weight:700;color:#111318;margin-bottom:7px}
  .dm-widget-sub{color:#6b7280;font-size:.9rem;margin-bottom:14px}
  .dm-row{display:flex;gap:10px;flex-wrap:wrap}
  .dm-input{flex:1;min-width:200px;border:1px solid #d1d5db;border-radius:8px;padding:10px 14px;font-size:.95rem;font-family:inherit;outline:none;background:#fff;transition:border-color .2s}
  .dm-input:focus{border-color:#00e5a0}
  .dm-btn{background:#00b87d;color:#fff;font-weight:700;padding:10px 20px;border-radius:8px;border:none;font-size:.9rem;font-family:inherit;cursor:pointer;white-space:nowrap}
  .dm-btn:hover{background:#009966}
  .dm-result{margin-top:14px;padding:14px 16px;background:#fff;border-radius:10px;border:1px solid #d1fae5}
  .dm-result p{color:#111318;font-size:.93rem;line-height:1.65;margin-bottom:10px}
  .dm-result-link{color:#00b87d;font-size:.87rem;font-weight:600}
  @media(max-width:480px){.dm-widget{padding:20px}}
</style>
<script>
const _nudges=[
  t=>\`Starting "\${t}" feels hard because your brain craves certainty before it acts. Set a 2-minute timer and just open the file — that's your only goal. DopaMint tracks each tiny start so momentum builds automatically.\`,
  t=>\`Your brain flagged "\${t}" as overwhelming, not impossible. The fix: shrink the first action to just 30 seconds. Not the task — just the opening move. DopaMint's nudges make that first step feel rewarding.\`,
  t=>\`"\${t}" is draining mental energy sitting in your head. Spend 5 guilt-free minutes on it right now. DopaMint's focus sessions are built exactly for this moment.\`,
  t=>\`ADHD brains avoid "\${t}" because the reward feels too distant. DopaMint closes that gap with streaks and nudges that make starting feel good instead of daunting.\`,
  t=>\`The hardest part of "\${t}" is the second before you start. Give yourself permission to do just 10% today. DopaMint helps turn that into a habit.\`
];
function dmNudge(){
  const t=document.getElementById('dm-input').value.trim();
  if(!t){document.getElementById('dm-input').focus();return;}
  document.getElementById('dm-result-text').textContent=_nudges[Math.floor(Math.random()*_nudges.length)](t);
  document.getElementById('dm-result').style.display='block';
  document.getElementById('dm-result').scrollIntoView({behavior:'smooth',block:'nearest'});
}
document.getElementById('dm-input').addEventListener('keydown',e=>{if(e.key==='Enter')dmNudge();});
</script>`;

// ─────────────────────────────────────────────
// SIDEBAR: RELATED POSTS
// ─────────────────────────────────────────────
function spotlightSidebar(currentSlug) {
  const others = posts.filter(p => p.slug !== currentSlug).slice(0, 4);
  if (!others.length) return '';
  return `
  <div class="sidebar-card">
    <div class="sidebar-label">Spotlight</div>
    ${others.map(p => `
    <a href="/blog/${p.slug}/" class="spot-item">
      <div class="spot-thumb">${coverImg(p, 58, 22)}</div>
      <div>
        <div class="spot-cat">${p.tags||'ADHD'}</div>
        <div class="spot-title">${p.h1||p.title}</div>
        <div class="spot-date">${new Date(p.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
      </div>
    </a>`).join('')}
  </div>`;
}

// ─────────────────────────────────────────────
// SCHEMA HELPERS
// ─────────────────────────────────────────────
function articleSchema(post) {
  const author = post.author || 'DopaMint Team';
  const image = ogImage(post);
  const citations = (post.sources||[]).filter(s=>s.url).map(s => s.url);
  const wordCount = (post.content||'').split(/\s+/).filter(Boolean).length;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.h1 || post.title,
    "description": post.description || '',
    "image": image,
    "datePublished": post.date ? new Date(post.date).toISOString() : '',
    "dateModified": post.date ? new Date(post.date).toISOString() : '',
    "wordCount": wordCount,
    "author": {
      "@type": "Person",
      "name": author,
      "url": SITE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": "DopaMint",
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": LOGO_URL
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}/`
    }
  };
  if (citations.length) schema.citation = citations.map(url => ({ "@type": "CreativeWork", "url": url }));
  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}

function websiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DopaMint",
    "url": SITE_URL,
    "description": "Science-backed tools to help ADHD brains actually start — and finish.",
    "publisher": {
      "@type": "Organization",
      "name": "DopaMint",
      "logo": {
        "@type": "ImageObject",
        "url": LOGO_URL
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/blog/?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}

// ─────────────────────────────────────────────
// POST PAGE CSS
// ─────────────────────────────────────────────
const postCSS = `
  .breadcrumb{max-width:1160px;margin:0 auto;padding:20px 24px 0;display:flex;align-items:center;gap:7px;font-size:.82rem;color:var(--muted)}
  .breadcrumb a{color:var(--muted)}
  .breadcrumb a:hover{color:var(--text)}
  .breadcrumb .sep{opacity:.4}
  .post-header{max-width:1160px;margin:0 auto;padding:20px 24px 0}
  .post-h1{font-size:clamp(1.8rem,4vw,2.6rem);font-weight:800;line-height:1.18;letter-spacing:-.02em;color:var(--text);margin:14px 0 12px}
  .post-deck{color:var(--muted);font-size:1rem;line-height:1.7;max-width:680px;margin-bottom:18px}
  .post-meta-bar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;padding:16px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:0}
  .meta-left{display:flex;align-items:center;gap:10px}
  .meta-left .author-avatar{width:34px;height:34px;font-size:17px}
  .meta-author-name{font-size:.88rem;font-weight:600;color:var(--text)}
  .meta-author-role{font-size:.76rem;color:var(--muted)}
  .meta-details{font-size:.8rem;color:var(--muted)}
  .share-row{display:flex;align-items:center;gap:8px}
  .share-label{font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--muted)}
  .share-btn{width:30px;height:30px;border:1px solid var(--border);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:.78rem;cursor:pointer;color:var(--text);background:#fff;transition:border-color .2s}
  .share-btn:hover{border-color:var(--mint-dark)}
  .post-cover{max-width:1160px;margin:0 auto}
  .post-cover img,.post-cover>div{width:100%;border-radius:0}
  .post-body{max-width:1160px;margin:0 auto;padding:32px 24px 0;display:grid;grid-template-columns:200px 1fr 268px;gap:48px;align-items:start}
  /* TOC */
  .toc-wrap{position:sticky;top:78px}
  .toc-label{font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);margin-bottom:14px}
  .toc-readtime{font-size:.82rem;color:var(--muted);margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:5px}
  .toc-list{list-style:none;display:flex;flex-direction:column;gap:2px}
  .toc-list a{font-size:.84rem;color:var(--muted);line-height:1.5;display:block;padding:4px 0 4px 10px;border-left:2px solid transparent;transition:color .2s,border-color .2s}
  .toc-list a:hover,.toc-list a.active{color:var(--mint-dark);border-color:var(--mint-dark)}
  /* Article */
  .article h2{font-size:1.4rem;font-weight:700;margin:2.5rem 0 1rem;color:var(--text);letter-spacing:-.01em}
  .article h3{font-size:1.15rem;font-weight:600;margin:2rem 0 .75rem;color:var(--text)}
  .article p{margin-bottom:1.4rem;color:#374151;font-size:1rem;line-height:1.8}
  .article ul,.article ol{margin:0 0 1.4rem 1.5rem;color:#374151}
  .article li{margin-bottom:.6rem;font-size:1rem;line-height:1.75}
  .article blockquote{border-left:3px solid var(--mint);padding:14px 20px;background:#f0fdf8;border-radius:0 10px 10px 0;margin:2rem 0;font-style:italic;color:var(--muted)}
  .article strong{color:var(--text);font-weight:600}
  .article img{border-radius:10px;margin:1.5rem 0;width:100%;border:1px solid var(--border)}
  /* Sources */
  .sources-section{margin-top:2.5rem;padding-top:2rem;border-top:2px solid var(--border)}
  .sources-title{display:flex;align-items:center;gap:8px;font-size:1.05rem;font-weight:700;color:var(--text);margin-bottom:8px}
  .sources-note{font-size:.8rem;color:var(--muted);margin-bottom:16px;font-style:italic}
  .sources-list{list-style:none;display:flex;flex-direction:column;gap:10px;padding:0}
  .source-item{display:flex;align-items:flex-start;gap:10px;padding:10px 14px;background:#f9fafb;border:1px solid var(--border);border-radius:10px;transition:border-color .2s}
  .source-item:hover{border-color:var(--mint-dark)}
  .source-verified{display:inline-flex;align-items:center;gap:4px;color:var(--mint-dark);font-size:.72rem;font-weight:700;white-space:nowrap;padding-top:2px;flex-shrink:0}
  .source-link{font-size:.88rem;color:#2563eb;line-height:1.5;word-break:break-word}
  .source-link:hover{color:var(--mint-dark);text-decoration:underline}
  /* Post sidebar */
  .post-sidebar{position:sticky;top:78px;display:flex;flex-direction:column;gap:20px}
  .sidebar-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .sidebar-label{font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);margin-bottom:14px}
  .spot-item{display:flex;gap:11px;align-items:flex-start;padding:11px 0;border-bottom:1px solid var(--border)}
  .spot-item:first-of-type{padding-top:0}
  .spot-item:last-child{border-bottom:none;padding-bottom:0}
  .spot-item:hover .spot-title{color:var(--mint-dark)}
  .spot-thumb{flex-shrink:0;width:58px;height:58px;border-radius:8px;overflow:hidden}
  .spot-thumb img,.spot-thumb>div{width:58px;height:58px;border-radius:8px}
  .spot-cat{font-size:.68rem;font-weight:700;color:var(--mint-dark);text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px}
  .spot-title{font-size:.83rem;font-weight:600;line-height:1.4;color:var(--text);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .spot-date{font-size:.73rem;color:var(--light);margin-top:3px}
  /* DM sidebar card */
  .dm-side-card{background:linear-gradient(140deg,#0b0c10,#1a2e22);border-radius:14px;padding:22px;color:#fff}
  .dm-side-badge{display:inline-block;background:rgba(0,229,160,.18);color:var(--mint);padding:3px 11px;border-radius:100px;font-size:.7rem;font-weight:700;letter-spacing:.06em;margin-bottom:12px}
  .dm-side-title{font-size:1rem;font-weight:700;line-height:1.35;margin-bottom:8px;color:#fff}
  .dm-side-sub{font-size:.83rem;line-height:1.65;color:rgba(255,255,255,.6);margin-bottom:16px}
  .dm-side-btn{display:inline-block;background:var(--mint);color:#000;font-weight:700;padding:9px 17px;border-radius:8px;font-size:.85rem}
  .dm-side-btn:hover{opacity:.85}
  /* Post end */
  .post-end{max-width:1160px;margin:0 auto;padding:32px 24px 0}
  .post-tags{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:28px}
  .post-tag-chip{background:#f3f4f6;border:1px solid var(--border);color:var(--muted);padding:5px 14px;border-radius:100px;font-size:.8rem}
  .post-nav{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:48px}
  .post-nav-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px;color:var(--text);transition:border-color .2s}
  .post-nav-card:hover{border-color:var(--mint-dark)}
  .post-nav-dir{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:6px}
  .post-nav-title{font-size:.9rem;font-weight:600;color:var(--text);line-height:1.4}
  .post-nav-card.next{text-align:right}
  /* Read Next */
  .read-next{max-width:1160px;margin:0 auto;padding:0 24px 60px}
  .read-next-label{font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);margin-bottom:20px}
  .rn-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  .rn-card{background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden;transition:box-shadow .2s,transform .2s}
  .rn-card:hover{box-shadow:0 6px 24px rgba(0,0,0,.09);transform:translateY(-2px)}
  .rn-card-img{height:160px;overflow:hidden}
  .rn-card-img img,.rn-card-img>div{width:100%;height:160px}
  .rn-body{padding:16px}
  .rn-cat{font-size:.7rem;font-weight:700;color:var(--mint-dark);text-transform:uppercase;letter-spacing:.05em;margin-bottom:7px}
  .rn-title{font-size:.95rem;font-weight:700;line-height:1.4;color:var(--text);margin-bottom:7px}
  .rn-meta{font-size:.78rem;color:var(--muted)}
  /* Responsive */
  @media(max-width:1000px){.post-body{grid-template-columns:160px 1fr 230px;gap:32px}}
  @media(max-width:780px){
    .post-body{grid-template-columns:1fr}
    .toc-wrap{display:none}
    .post-sidebar{position:static;margin-top:36px}
    .rn-grid{grid-template-columns:1fr 1fr}
    .post-nav{grid-template-columns:1fr}
  }
  @media(max-width:520px){
    .post-h1{font-size:1.65rem}
    .rn-grid{grid-template-columns:1fr}
    .post-header,.post-body,.post-end,.read-next{padding-left:16px;padding-right:16px}
  }
`;

// ─────────────────────────────────────────────
// BUILD INDIVIDUAL POST PAGES
// ─────────────────────────────────────────────
posts.forEach((post, idx) => {
  const postDir = path.join(blogOutputDir, post.slug);
  if (!fs.existsSync(postDir)) fs.mkdirSync(postDir, { recursive: true });

  const author = post.author || 'DopaMint Team';
  const authorRole = post.authorRole || 'ADHD Tools & Research';
  const fmtDate = new Date(post.date).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  const tocItems = generateTOC(post.htmlContent);
  let articleHTML = injectIds(post.htmlContent);
  articleHTML = articleHTML.replace(/<p>\[tool\]<\/p>/gi, toolWidget);

  const tocHTML = tocItems.length ? `
    <div class="toc-wrap">
      <div class="toc-readtime">⏱ ${post.readTime||'5 min read'}</div>
      <div class="toc-label">Contents</div>
      <ul class="toc-list">
        ${tocItems.map(h=>`<li><a href="#${h.id}">${h.text}</a></li>`).join('')}
      </ul>
    </div>` : `<div></div>`;

  const prev = posts[idx+1]||null;
  const next = posts[idx-1]||null;
  const postNavHTML = (prev||next) ? `
    <div class="post-nav">
      ${prev?`<a href="/blog/${prev.slug}/" class="post-nav-card prev">
        <div class="post-nav-dir">← Previous</div>
        <div class="post-nav-title">${prev.h1||prev.title}</div>
      </a>`:'<div></div>'}
      ${next?`<a href="/blog/${next.slug}/" class="post-nav-card next">
        <div class="post-nav-dir">Next →</div>
        <div class="post-nav-title">${next.h1||next.title}</div>
      </a>`:'<div></div>'}
    </div>` : '';

  const readNext = posts.filter(p=>p.slug!==post.slug).slice(0,3);
  const readNextHTML = readNext.length ? `
    <div class="read-next">
      <div class="read-next-label">Read Next</div>
      <div class="rn-grid">
        ${readNext.map(p=>`
        <a href="/blog/${p.slug}/" class="rn-card">
          <div class="rn-card-img">${coverImg(p,160,36)}</div>
          <div class="rn-body">
            <div class="rn-cat">${p.tags||'ADHD'}</div>
            <div class="rn-title">${p.h1||p.title}</div>
            <div class="rn-meta">${new Date(p.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})} · ${p.readTime||'5 min read'}</div>
          </div>
        </a>`).join('')}
      </div>
    </div>` : '';

  const tocActiveJS = tocItems.length ? `<script>
  const _tl=document.querySelectorAll('.toc-list a');
  const _sc=${JSON.stringify(tocItems.map(h=>h.id))}.map(id=>document.getElementById(id)).filter(Boolean);
  window.addEventListener('scroll',()=>{
    let cur='';
    _sc.forEach(s=>{if(window.scrollY>=s.offsetTop-100)cur=s.id;});
    _tl.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur));
  });
  </script>` : '';

  const postOgImage = ogImage(post);
  const twitterCard = `
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${post.title}">
  <meta name="twitter:description" content="${post.description||''}">
  <meta name="twitter:image" content="${postOgImage}">`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="index, follow">
  <title>${post.title}</title>
  <meta name="description" content="${post.description}">
  <meta property="og:title" content="${post.title}">
  <meta property="og:description" content="${post.description||''}">
  <meta property="og:url" content="${SITE_URL}/blog/${post.slug}/">
  <meta property="og:type" content="article">
  <meta property="og:image" content="${postOgImage}">
  <meta property="article:published_time" content="${new Date(post.date).toISOString()}">
  <meta property="article:author" content="${author}">
  ${twitterCard}
  <link rel="canonical" href="${SITE_URL}/blog/${post.slug}/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  ${articleSchema(post)}
  <style>${sharedCSS}${postCSS}</style>
</head>
<body>
  <div id="progress-bar"></div>
  ${navHTML}

  <div class="breadcrumb">
    <a href="/">Home</a><span class="sep">›</span>
    <a href="/blog/">Blog</a><span class="sep">›</span>
    <span>${post.tags||'ADHD'}</span>
  </div>

  <div class="post-header">
    <div class="cat-tag">⊕ ${post.tags||'ADHD'}</div>
    <h1 class="post-h1">${post.h1||post.title}</h1>
    <p class="post-deck">${post.description}</p>
    <div class="post-meta-bar">
      <div class="meta-left">
        <div class="author-avatar" style="width:34px;height:34px;font-size:17px">🧠</div>
        <div>
          <div class="meta-author-name">${author}</div>
          <div class="meta-author-role">${authorRole}</div>
          <div class="meta-details">${fmtDate} · ${post.readTime||'5 min read'}</div>
        </div>
      </div>
      <div class="share-row">
        <span class="share-label">Share</span>
        <a href="https://twitter.com/intent/tweet?url=${SITE_URL}/blog/${post.slug}/&text=${encodeURIComponent(post.title)}" target="_blank" rel="noopener" class="share-btn">𝕏</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${SITE_URL}/blog/${post.slug}/" target="_blank" rel="noopener" class="share-btn">f</a>
        <button class="share-btn" onclick="navigator.clipboard.writeText(window.location.href).then(()=>alert('Link copied!'))">🔗</button>
      </div>
    </div>
  </div>

  <div class="post-cover">${coverImg(post, 480, 72)}</div>

  <div class="post-body">
    ${tocHTML}
    <article class="article">
      ${articleHTML}
      ${sourcesSection(post.sources)}
    </article>
    <aside class="post-sidebar">
      ${spotlightSidebar(post.slug)}
      <div class="dm-side-card">
        <div class="dm-side-badge">🧠 Try it Free</div>
        <div class="dm-side-title">Beat Task Paralysis Today</div>
        <div class="dm-side-sub">Dopamine-backed nudges to help ADHD brains start — not just plan.</div>
        <a href="https://app.dopamint.app" class="dm-side-btn">Try DopaMint →</a>
      </div>
    </aside>
  </div>

  <div class="post-end">
    <div class="post-tags">
      <span class="post-tag-chip">${post.tags||'ADHD'}</span>
      <span class="post-tag-chip">Productivity</span>
    </div>
    ${postNavHTML}
  </div>

  ${readNextHTML}
  ${footerHTML}
  ${progressBarJS}
  ${tocActiveJS}
</body>
</html>`;

  fs.writeFileSync(path.join(postDir, 'index.html'), html);
  console.log(`✅ Built: /blog/${post.slug}/`);
});

// ─────────────────────────────────────────────
// BUILD BLOG INDEX
// ─────────────────────────────────────────────
const blogIndexCSS = `
  .hero{max-width:680px;margin:0 auto;padding:72px 24px 56px;text-align:center}
  .hero-pill{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--border);border-radius:100px;padding:5px 14px;font-size:.78rem;font-weight:600;color:var(--muted);margin-bottom:22px;background:#fff}
  .hero-pill .dot{color:var(--mint-dark)}
  .hero h1{font-size:clamp(2.2rem,5vw,3.4rem);font-weight:800;line-height:1.12;letter-spacing:-.02em;margin-bottom:16px;color:var(--text)}
  .hero h1 .hl{background:linear-gradient(120deg,rgba(0,229,160,.28) 0%,rgba(0,229,160,.12) 100%);border-radius:4px;padding:0 6px}
  .hero-sub{color:var(--muted);font-size:1rem;line-height:1.75;max-width:440px;margin:0 auto 28px}
  .hero-author{display:inline-flex;align-items:center;gap:10px}
  .hero-author .author-avatar{width:36px;height:36px;font-size:18px}
  .hero-author-name{font-size:.88rem;font-weight:600;text-align:left}
  .hero-author-role{font-size:.78rem;color:var(--muted)}
  .main{max-width:1160px;margin:0 auto;padding:0 24px 100px}
  /* Featured */
  .featured{display:grid;grid-template-columns:1.1fr 1fr;background:var(--card);border-radius:16px;overflow:hidden;margin-bottom:48px;border:1px solid var(--border);box-shadow:0 2px 12px rgba(0,0,0,.05);transition:box-shadow .2s,transform .2s}
  .featured:hover{box-shadow:0 8px 32px rgba(0,0,0,.1);transform:translateY(-2px)}
  .feat-img{overflow:hidden;min-height:340px}
  .feat-img img,.feat-img>div{width:100%;height:100%;object-fit:cover;min-height:340px}
  .feat-body{padding:44px 40px;display:flex;flex-direction:column;justify-content:space-between}
  .feat-title{font-size:1.6rem;font-weight:800;line-height:1.25;letter-spacing:-.01em;color:var(--text);margin:12px 0 12px}
  .feat-desc{color:var(--muted);font-size:.95rem;line-height:1.7}
  .feat-meta{display:flex;align-items:center;justify-content:space-between;margin-top:28px;padding-top:18px;border-top:1px solid var(--border)}
  .feat-meta .meta-author{display:flex;align-items:center;gap:9px}
  .feat-meta .author-avatar{width:32px;height:32px;font-size:16px}
  .feat-meta .meta-author span{font-size:.86rem;font-weight:600}
  .feat-meta .meta-date{font-size:.82rem;color:var(--muted)}
  /* Grid */
  .content-grid{display:grid;grid-template-columns:1fr 280px;gap:40px;align-items:start}
  .posts-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  .post-card{background:var(--card);border-radius:14px;overflow:hidden;border:1px solid var(--border);box-shadow:0 1px 6px rgba(0,0,0,.04);display:flex;flex-direction:column;transition:box-shadow .2s,transform .2s}
  .post-card:hover{box-shadow:0 6px 24px rgba(0,0,0,.09);transform:translateY(-2px)}
  .card-img{overflow:hidden;height:200px}
  .card-img img,.card-img>div{width:100%;height:200px;object-fit:cover}
  .card-body{padding:20px 20px 22px;flex:1;display:flex;flex-direction:column}
  .card-body .cat-tag{margin-bottom:10px}
  .card-title{font-size:1.02rem;font-weight:700;line-height:1.38;color:var(--text);margin-bottom:10px;letter-spacing:-.005em}
  .card-desc{color:var(--muted);font-size:.86rem;line-height:1.65;flex:1;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:16px}
  .card-footer{display:flex;align-items:center;justify-content:space-between;padding-top:14px;border-top:1px solid var(--border)}
  .card-footer .meta-author{display:flex;align-items:center;gap:8px}
  .card-footer .author-avatar{width:28px;height:28px;font-size:14px}
  .card-footer .meta-author span{font-size:.82rem;font-weight:500}
  .card-footer .meta-date{font-size:.78rem;color:var(--muted)}
  /* Sidebar */
  .idx-sidebar{position:sticky;top:74px;display:flex;flex-direction:column;gap:20px}
  .sidebar-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:22px;box-shadow:0 1px 6px rgba(0,0,0,.04)}
  .sidebar-label{font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);margin-bottom:16px}
  .spot-item{display:flex;gap:12px;align-items:flex-start;padding:11px 0;border-bottom:1px solid var(--border)}
  .spot-item:first-of-type{padding-top:0}
  .spot-item:last-child{border-bottom:none;padding-bottom:0}
  .spot-item:hover .spot-title{color:var(--mint-dark)}
  .spot-thumb{flex-shrink:0;width:58px;height:58px;border-radius:8px;overflow:hidden}
  .spot-thumb img,.spot-thumb>div{width:58px;height:58px;border-radius:8px}
  .spot-cat{font-size:.68rem;font-weight:700;color:var(--mint-dark);text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px}
  .spot-title{font-size:.83rem;font-weight:600;line-height:1.4;color:var(--text);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .spot-date{font-size:.73rem;color:var(--light);margin-top:3px}
  .dm-cta-card{background:linear-gradient(140deg,#0b0c10,#1a2e22);border-radius:14px;padding:22px;color:#fff}
  .dm-cta-badge{display:inline-block;background:rgba(0,229,160,.18);color:var(--mint);padding:3px 11px;border-radius:100px;font-size:.7rem;font-weight:700;letter-spacing:.06em;margin-bottom:12px}
  .dm-cta-title{font-size:1rem;font-weight:700;line-height:1.35;margin-bottom:8px;color:#fff}
  .dm-cta-sub{font-size:.83rem;line-height:1.65;color:rgba(255,255,255,.6);margin-bottom:16px}
  .dm-cta-btn{display:inline-block;background:var(--mint);color:#000;font-weight:700;padding:9px 17px;border-radius:8px;font-size:.85rem}
  .dm-cta-btn:hover{opacity:.85}
  /* Responsive */
  @media(max-width:960px){
    .featured{grid-template-columns:1fr}
    .feat-img{min-height:240px}
    .feat-img>div{min-height:240px}
    .content-grid{grid-template-columns:1fr}
    .idx-sidebar{position:static}
  }
  @media(max-width:640px){
    .hero{padding:52px 16px 40px}
    .main{padding:0 16px 80px}
    .posts-grid{grid-template-columns:1fr}
    .feat-body{padding:24px 20px}
    .feat-title{font-size:1.3rem}
  }
`;

const featured = posts[0]||null;
const rest = posts.slice(1);
const spotlightPosts = posts.slice(0,4);

const featuredHTML = featured ? `
  <a href="/blog/${featured.slug}/" class="featured">
    <div class="feat-img">${coverImg(featured, 340, 72)}</div>
    <div class="feat-body">
      <div>
        <div class="cat-tag">⊕ ${featured.tags||'ADHD'}</div>
        <div class="feat-title">${featured.h1||featured.title}</div>
        <div class="feat-desc">${featured.description}</div>
      </div>
      <div class="feat-meta">
        <div class="meta-author">
          <div class="author-avatar" style="width:32px;height:32px;font-size:16px">🧠</div>
          <span>${featured.author||'DopaMint Team'}</span>
        </div>
        <span class="meta-date">${new Date(featured.date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</span>
      </div>
    </div>
  </a>` : '';

const cardsHTML = rest.map(p => {
  const d = new Date(p.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  return `
  <a href="/blog/${p.slug}/" class="post-card">
    <div class="card-img">${coverImg(p, 200, 48)}</div>
    <div class="card-body">
      <div class="cat-tag">⊕ ${p.tags||'ADHD'}</div>
      <div class="card-title">${p.h1||p.title}</div>
      <div class="card-desc">${p.description}</div>
      <div class="card-footer">
        <div class="meta-author">
          <div class="author-avatar" style="width:28px;height:28px;font-size:14px">🧠</div>
          <span>${p.author||'DopaMint Team'}</span>
        </div>
        <span class="meta-date">${d}</span>
      </div>
    </div>
  </a>`;
}).join('');

const spotHTML = spotlightPosts.map(p => `
  <a href="/blog/${p.slug}/" class="spot-item">
    <div class="spot-thumb">${coverImg(p, 58, 22)}</div>
    <div>
      <div class="spot-cat">${p.tags||'ADHD'}</div>
      <div class="spot-title">${p.h1||p.title}</div>
      <div class="spot-date">${new Date(p.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
    </div>
  </a>`).join('');

const emptyHTML = `
  <div style="grid-column:1/-1;background:var(--card);border:1px solid var(--border);border-radius:14px;padding:64px 32px;text-align:center">
    <div style="font-size:3rem;margin-bottom:16px">🧠</div>
    <h3 style="font-size:1.3rem;font-weight:700;margin-bottom:10px">First posts dropping soon</h3>
    <p style="color:var(--muted);font-size:.93rem;max-width:360px;margin:0 auto 22px;line-height:1.7">Science-backed guides to help ADHD brains actually get things done.</p>
    <a href="https://app.dopamint.app" style="display:inline-block;background:var(--text);color:#fff;font-weight:700;padding:10px 22px;border-radius:8px;font-size:.9rem">Try DopaMint Free →</a>
  </div>`;

const blogIndexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="index, follow">
  <title>ADHD Tips & Insights | DopaMint Blog</title>
  <meta name="description" content="Science-backed tips and practical strategies for ADHD brains. Beat task paralysis, build better habits, and actually get things done.">
  <meta property="og:title" content="ADHD Tips & Insights | DopaMint Blog">
  <meta property="og:description" content="Science-backed tips and practical strategies for ADHD brains.">
  <meta property="og:url" content="${SITE_URL}/blog/">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${LOGO_URL}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="ADHD Tips & Insights | DopaMint Blog">
  <meta name="twitter:image" content="${LOGO_URL}">
  <link rel="canonical" href="${SITE_URL}/blog/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  ${websiteSchema()}
  <style>${sharedCSS}${blogIndexCSS}</style>
</head>
<body>
  ${navHTML}
  <div class="hero">
    <div class="hero-pill"><span class="dot">✦</span> ADHD Insights</div>
    <h1>Tips for Brains That<br>Think <span class="hl">Differently</span></h1>
    <p class="hero-sub">No generic advice. Science-backed strategies written for people who actually have ADHD.</p>
    <div class="hero-author">
      <div class="author-avatar" style="width:36px;height:36px;font-size:18px">🧠</div>
      <div>
        <div class="hero-author-name">DopaMint Team</div>
        <div class="hero-author-role">ADHD Tools & Research</div>
      </div>
    </div>
  </div>
  <div class="main">
    ${featuredHTML}
    <div class="content-grid">
      <div>
        ${rest.length ? `<div class="posts-grid">${cardsHTML}</div>` : `<div class="posts-grid">${emptyHTML}</div>`}
      </div>
      <aside class="idx-sidebar">
        ${spotlightPosts.length ? `
        <div class="sidebar-card">
          <div class="sidebar-label">Spotlight</div>
          ${spotHTML}
        </div>` : ''}
        <div class="dm-cta-card">
          <div class="dm-cta-badge">🧠 Try it Free</div>
          <div class="dm-cta-title">Beat Task Paralysis Today</div>
          <div class="dm-cta-sub">DopaMint uses dopamine-backed nudges to help ADHD brains start tasks — not just plan them.</div>
          <a href="https://app.dopamint.app" class="dm-cta-btn">Try DopaMint →</a>
        </div>
      </aside>
    </div>
  </div>
  ${footerHTML}
</body>
</html>`;

fs.writeFileSync(path.join(blogOutputDir, 'index.html'), blogIndexHTML);
console.log('✅ Built: /blog/');

// ─────────────────────────────────────────────
// SITEMAP
// ─────────────────────────────────────────────
const urls = [
  {url:`${SITE_URL}/`,p:'1.0'},
  {url:`${SITE_URL}/blog/`,p:'0.8'},
  ...posts.map(p=>({url:`${SITE_URL}/blog/${p.slug}/`,p:'0.7'}))
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({url,p})=>`  <url><loc>${url}</loc><priority>${p}</priority><changefreq>weekly</changefreq></url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(__dirname,'sitemap.xml'),sitemap);
console.log(`✅ Sitemap: ${urls.length} URLs`);
console.log('\n🚀 Build complete!');
