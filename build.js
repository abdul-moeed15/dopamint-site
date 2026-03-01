const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const SITE_URL = 'https://dopamint.app';
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
// SHARED CSS
// ─────────────────────────────────────────────
const sharedCSS = `
  :root{--mint:#00e5a0;--bg:#0b0c10;--surface:#13151c;--surface2:#1a1d27;--border:#1f2230;--text:#e8eaf0;--muted:#7c8099;--radius:14px;--font:'Inter',system-ui,sans-serif}
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--text);font-family:var(--font);font-size:17px;line-height:1.8;-webkit-font-smoothing:antialiased}
  a{color:var(--mint);text-decoration:none}
  a:hover{text-decoration:underline}
  img{max-width:100%;height:auto;display:block}
  /* Progress bar */
  #progress-bar{position:fixed;top:0;left:0;height:3px;background:var(--mint);width:0%;z-index:9999;transition:width .1s linear}
  /* Nav */
  nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(11,12,16,.92);backdrop-filter:blur(16px);border-bottom:1px solid var(--border)}
  .nav-inner{max-width:1200px;margin:0 auto;padding:0 24px;height:64px;display:flex;align-items:center;justify-content:space-between}
  .nav-logo{display:flex;align-items:center;gap:10px;font-weight:700;font-size:1.1rem;color:var(--text);text-decoration:none}
  .nav-logo span{color:var(--mint)}
  .logo-icon{width:32px;height:32px;background:var(--mint);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:17px}
  .nav-right{display:flex;align-items:center;gap:20px}
  .nav-blog-link{color:var(--muted);font-size:.9rem;font-weight:500}
  .nav-blog-link:hover{color:var(--text);text-decoration:none}
  .btn-signin{background:transparent;border:1px solid var(--border);color:var(--text);padding:8px 18px;border-radius:8px;font-size:.88rem;cursor:pointer;font-family:var(--font);text-decoration:none;display:inline-flex;align-items:center;transition:border-color .2s}
  .btn-signin:hover{border-color:var(--mint);text-decoration:none}
  .btn-try{background:var(--mint);color:#000;font-weight:700;padding:8px 18px;border-radius:8px;font-size:.88rem;cursor:pointer;font-family:var(--font);border:none;text-decoration:none;display:inline-flex;align-items:center;transition:opacity .2s}
  .btn-try:hover{opacity:.9;text-decoration:none}
  /* Breadcrumb */
  .breadcrumb{max-width:1200px;margin:0 auto;padding:88px 24px 0;display:flex;align-items:center;gap:8px;font-size:.82rem;color:var(--muted)}
  .breadcrumb a{color:var(--muted)}
  .breadcrumb a:hover{color:var(--mint);text-decoration:none}
  .breadcrumb .sep{opacity:.4}
  .breadcrumb .current{color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:300px}
  /* Footer */
  footer{border-top:1px solid var(--border);padding:60px 24px 40px;margin-top:80px}
  .footer-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr auto;gap:40px;align-items:start}
  .footer-brand p{color:var(--muted);font-size:.88rem;margin-top:8px;max-width:260px;line-height:1.6}
  .footer-links{display:flex;gap:24px}
  .footer-links a{color:var(--muted);font-size:.88rem}
  .footer-links a:hover{color:var(--mint);text-decoration:none}
  .footer-copy{max-width:1200px;margin:32px auto 0;padding-top:24px;border-top:1px solid var(--border);color:var(--muted);font-size:.82rem}
  @media(max-width:768px){
    .nav-inner{padding:0 16px;height:56px}
    .breadcrumb{padding:76px 16px 0}
    .footer-inner{grid-template-columns:1fr}
    .footer-links{flex-wrap:wrap;gap:16px}
  }
  @media(max-width:480px){.btn-signin{display:none}}
`;

// ─────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────
const navHTML = `
<nav>
  <div class="nav-inner">
    <a href="/" class="nav-logo">
      <div class="logo-icon">🧠</div>
      Dopa<span>Mint</span>
    </a>
    <div class="nav-right">
      <a href="/blog/" class="nav-blog-link">Blog</a>
      <a href="https://app.dopamint.app" class="btn-signin">Sign In</a>
      <a href="https://app.dopamint.app" class="btn-try">Try Free →</a>
    </div>
  </div>
</nav>`;

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
const footerHTML = `
<footer>
  <div class="footer-inner">
    <div class="footer-brand">
      <a href="/" class="nav-logo" style="display:inline-flex">
        <div class="logo-icon">🧠</div>
        Dopa<span style="color:var(--mint)">Mint</span>
      </a>
      <p>Science-backed tools to help ADHD brains actually start — and finish.</p>
    </div>
    <div class="footer-links">
      <a href="/blog/">Blog</a>
      <a href="https://app.dopamint.app">App</a>
      <a href="https://app.dopamint.app">Sign In</a>
    </div>
  </div>
  <div class="footer-copy">© ${new Date().getFullYear()} DopaMint. All rights reserved.</div>
</footer>`;

// ─────────────────────────────────────────────
// DOPAMINT TOOL WIDGET
// ─────────────────────────────────────────────
const toolWidget = `
<div class="dm-widget" id="dm-widget">
  <div class="dm-widget-header">
    <span class="dm-widget-badge">⚡ Try DopaMint Free</span>
  </div>
  <h3 class="dm-widget-title">What task are you avoiding right now?</h3>
  <p class="dm-widget-sub">Type it below — we'll give you a dopamine-backed nudge to start.</p>
  <div class="dm-widget-input-row">
    <input type="text" class="dm-widget-input" id="dm-task-input" placeholder="e.g. Write the intro for my report..." maxlength="100">
    <button class="dm-widget-btn" onclick="dmGetNudge()">Get Nudge →</button>
  </div>
  <div class="dm-widget-result" id="dm-result" style="display:none">
    <div class="dm-result-text" id="dm-result-text"></div>
    <a href="https://app.dopamint.app" class="dm-result-cta">Open DopaMint for the full experience →</a>
  </div>
</div>
<style>
  .dm-widget{background:linear-gradient(135deg,rgba(0,229,160,.1),rgba(0,229,160,.04));border:1px solid rgba(0,229,160,.3);border-radius:16px;padding:28px 32px;margin:2.5rem 0}
  .dm-widget-badge{display:inline-block;background:rgba(0,229,160,.15);color:var(--mint);padding:4px 12px;border-radius:100px;font-size:.72rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:12px}
  .dm-widget-title{font-size:1.2rem;font-weight:700;color:var(--text);margin-bottom:8px}
  .dm-widget-sub{color:var(--muted);font-size:.9rem;margin-bottom:16px}
  .dm-widget-input-row{display:flex;gap:10px;flex-wrap:wrap}
  .dm-widget-input{flex:1;min-width:200px;background:var(--surface2);border:1px solid var(--border);color:var(--text);padding:10px 16px;border-radius:8px;font-size:.95rem;font-family:var(--font);outline:none;transition:border-color .2s}
  .dm-widget-input:focus{border-color:var(--mint)}
  .dm-widget-btn{background:var(--mint);color:#000;font-weight:700;padding:10px 20px;border-radius:8px;border:none;font-size:.9rem;font-family:var(--font);cursor:pointer;white-space:nowrap;transition:opacity .2s}
  .dm-widget-btn:hover{opacity:.85}
  .dm-widget-result{margin-top:16px;padding:16px;background:var(--surface2);border-radius:10px;border:1px solid var(--border)}
  .dm-result-text{color:var(--text);font-size:.95rem;line-height:1.6;margin-bottom:12px}
  .dm-result-cta{color:var(--mint);font-size:.88rem;font-weight:600}
  @media(max-width:480px){.dm-widget{padding:20px}}
</style>
<script>
const nudges = [
  n => \`Starting "\${n}" feels hard because your brain is waiting for the "right" moment — which never comes. Set a 2-minute timer and just open the file. That's it. DopaMint tracks your momentum so each tiny start builds on the last.\`,
  n => \`Your brain tagged "\${n}" as overwhelming, not impossible. Break it into the smallest possible first action — not the task, just the first 30 seconds of it. DopaMint uses dopamine nudges to make that first step feel rewarding.\`,
  n => \`"\${n}" is sitting in your working memory eating up mental energy. The fastest way to reduce that drain: spend 5 minutes on it right now, guilt-free. DopaMint's focus sessions are designed exactly for this.\`,
  n => \`ADHD brains avoid "\${n}" because the reward feels too far away. DopaMint brings the reward closer — with streaks, nudges, and small wins that make starting feel good instead of daunting.\`,
  n => \`The hardest part of "\${n}" is the moment before you start. Once you're in it, it gets easier. Give yourself permission to do just 10% of it today. DopaMint helps you build that habit into a system.\`
];
function dmGetNudge(){
  const task = document.getElementById('dm-task-input').value.trim();
  if(!task){document.getElementById('dm-task-input').focus();return;}
  const nudge = nudges[Math.floor(Math.random()*nudges.length)](task);
  document.getElementById('dm-result-text').textContent = nudge;
  document.getElementById('dm-result').style.display='block';
  document.getElementById('dm-result').scrollIntoView({behavior:'smooth',block:'nearest'});
}
document.getElementById('dm-task-input').addEventListener('keydown',e=>{if(e.key==='Enter')dmGetNudge();});
</script>`;

// ─────────────────────────────────────────────
// PROGRESS BAR JS
// ─────────────────────────────────────────────
const progressBarJS = `
<script>
window.addEventListener('scroll',()=>{
  const d=document.documentElement;
  const pct=(d.scrollTop/(d.scrollHeight-d.clientHeight))*100;
  document.getElementById('progress-bar').style.width=pct+'%';
});
</script>`;

// ─────────────────────────────────────────────
// GENERATE TABLE OF CONTENTS FROM HTML
// ─────────────────────────────────────────────
function generateTOC(html) {
  const headings = [];
  const regex = /<h2[^>]*>(.*?)<\/h2>/gi;
  let match;
  let i = 0;
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '');
    const id = `section-${i++}`;
    headings.push({ text, id });
  }
  return headings;
}

function injectHeadingIds(html) {
  let i = 0;
  return html.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (_, attrs, content) => {
    return `<h2${attrs} id="section-${i++}">${content}</h2>`;
  });
}

// ─────────────────────────────────────────────
// COVER IMAGE PLACEHOLDER
// ─────────────────────────────────────────────
function coverImageHTML(post, large = false) {
  const h = large ? '420px' : '200px';
  if (post.coverImage) {
    return `<img src="${post.coverImage}" alt="${post.h1 || post.title}" style="width:100%;height:${h};object-fit:cover;border-radius:${large ? '16px' : '10px'}" loading="lazy">`;
  }
  const gradients = [
    'linear-gradient(135deg,#0d3b2e,#00e5a0 120%)',
    'linear-gradient(135deg,#1a0a2e,#7c3aed 120%)',
    'linear-gradient(135deg,#0a1628,#3b82f6 120%)',
    'linear-gradient(135deg,#2d0a0a,#ef4444 120%)',
    'linear-gradient(135deg,#0a2818,#22c55e 120%)',
  ];
  const grad = gradients[Math.abs(post.slug.charCodeAt(0)) % gradients.length];
  const emoji = ['🧠','⚡','🎯','🔥','💡','🚀'][Math.abs(post.slug.charCodeAt(1)||0) % 6];
  return `<div style="width:100%;height:${h};border-radius:${large ? '16px' : '10px'};background:${grad};display:flex;align-items:center;justify-content:center;font-size:${large ? '64px' : '36px'}">${emoji}</div>`;
}

// ─────────────────────────────────────────────
// SIDEBAR: RELATED POSTS
// ─────────────────────────────────────────────
function relatedPostsSidebar(currentSlug) {
  const others = posts.filter(p => p.slug !== currentSlug).slice(0, 4);
  if (!others.length) return '';
  const items = others.map(p => `
    <a href="/blog/${p.slug}/" class="sidebar-post">
      <div class="sidebar-post-img">${coverImageHTML(p, false)}</div>
      <div class="sidebar-post-content">
        <div class="sidebar-post-tag">${p.tags || 'ADHD'}</div>
        <div class="sidebar-post-title">${p.h1 || p.title}</div>
        <div class="sidebar-post-meta">${p.readTime || '5 min read'}</div>
      </div>
    </a>`).join('');
  return `
    <div class="sidebar-section">
      <div class="sidebar-label">SPOTLIGHT</div>
      ${items}
    </div>`;
}

// ─────────────────────────────────────────────
// SIDEBAR: DOPAMINT CARD
// ─────────────────────────────────────────────
const sidebarDMCard = `
<div class="sidebar-section">
  <div class="dm-sidebar-card">
    <div class="dm-sidebar-badge">🧠 Ideas Live Here</div>
    <div class="dm-sidebar-title">Beat Task Paralysis Today</div>
    <div class="dm-sidebar-sub">DopaMint uses dopamine-backed nudges to help ADHD brains start tasks — not just plan them.</div>
    <a href="https://app.dopamint.app" class="dm-sidebar-btn">Try DopaMint Free →</a>
  </div>
</div>`;

// ─────────────────────────────────────────────
// POST CSS
// ─────────────────────────────────────────────
const postCSS = `
  /* Post layout */
  .post-header{max-width:1200px;margin:0 auto;padding:24px 24px 0}
  .post-title-area{margin-bottom:24px}
  .post-tag-link{display:inline-flex;align-items:center;gap:4px;color:var(--mint);font-size:.82rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:14px;text-decoration:none}
  .post-tag-link:hover{text-decoration:underline}
  .post-h1{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:800;line-height:1.2;color:var(--text);margin-bottom:12px}
  .post-deck{font-size:1.05rem;color:var(--muted);line-height:1.7;margin-bottom:20px;max-width:680px}
  .post-meta-row{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;padding-bottom:20px;border-bottom:1px solid var(--border)}
  .post-author{display:flex;align-items:center;gap:10px}
  .post-author-avatar{width:36px;height:36px;background:var(--mint);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
  .post-author-name{font-size:.88rem;font-weight:600;color:var(--text)}
  .post-author-date{font-size:.8rem;color:var(--muted)}
  .post-share{display:flex;align-items:center;gap:10px}
  .post-share-label{font-size:.78rem;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;font-weight:600}
  .post-share-btn{width:32px;height:32px;background:var(--surface);border:1px solid var(--border);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:.8rem;cursor:pointer;text-decoration:none;color:var(--text);transition:border-color .2s}
  .post-share-btn:hover{border-color:var(--mint);text-decoration:none}
  .post-cover{max-width:1200px;margin:24px auto;padding:0 24px}
  .post-cover img,.post-cover>div{border-radius:16px;width:100%}
  /* 3-col layout */
  .post-body{max-width:1200px;margin:0 auto;padding:32px 24px 0;display:grid;grid-template-columns:220px 1fr 260px;gap:48px;align-items:start}
  /* TOC */
  .post-toc{position:sticky;top:84px}
  .toc-label{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:16px}
  .toc-readtime{display:flex;align-items:center;gap:6px;color:var(--muted);font-size:.82rem;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border)}
  .toc-list{list-style:none;display:flex;flex-direction:column;gap:4px}
  .toc-list li a{color:var(--muted);font-size:.85rem;line-height:1.5;display:block;padding:4px 0;transition:color .2s;border-left:2px solid transparent;padding-left:10px}
  .toc-list li a:hover,.toc-list li a.active{color:var(--mint);border-color:var(--mint);text-decoration:none}
  /* Article */
  .post-article h2{font-size:1.45rem;font-weight:700;margin:2.5rem 0 1rem;color:var(--text);padding-top:8px}
  .post-article h3{font-size:1.15rem;font-weight:600;margin:2rem 0 .75rem;color:var(--text)}
  .post-article p{margin-bottom:1.4rem;color:#c5c8d6;font-size:1rem}
  .post-article ul,.post-article ol{margin:0 0 1.4rem 1.5rem;color:#c5c8d6}
  .post-article li{margin-bottom:.6rem;font-size:1rem}
  .post-article blockquote{border-left:3px solid var(--mint);padding:14px 20px;background:var(--surface);border-radius:0 10px 10px 0;margin:2rem 0;font-style:italic;color:var(--muted)}
  .post-article strong{color:var(--text);font-weight:600}
  .post-article img{border-radius:10px;margin:1.5rem 0;width:100%}
  .post-article figcaption{color:var(--muted);font-size:.82rem;text-align:center;margin-top:-1rem;margin-bottom:1.5rem}
  /* Post sidebar */
  .post-sidebar{position:sticky;top:84px;display:flex;flex-direction:column;gap:24px}
  .sidebar-section{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:0}
  .sidebar-label{font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:16px}
  .sidebar-post{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);text-decoration:none;color:var(--text)}
  .sidebar-post:last-child{border-bottom:none;padding-bottom:0}
  .sidebar-post:first-of-type{padding-top:0}
  .sidebar-post:hover{text-decoration:none}
  .sidebar-post-img{flex-shrink:0;width:64px;height:64px;border-radius:8px;overflow:hidden}
  .sidebar-post-img img,.sidebar-post-img>div{width:64px!important;height:64px!important;border-radius:8px}
  .sidebar-post-content{flex:1;min-width:0}
  .sidebar-post-tag{font-size:.68rem;font-weight:700;color:var(--mint);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px}
  .sidebar-post-title{font-size:.83rem;font-weight:600;line-height:1.4;color:var(--text);margin-bottom:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .sidebar-post:hover .sidebar-post-title{color:var(--mint)}
  .sidebar-post-meta{font-size:.75rem;color:var(--muted)}
  /* DopaMint sidebar card */
  .dm-sidebar-card{background:linear-gradient(135deg,rgba(0,229,160,.12),rgba(0,229,160,.04));border:1px solid rgba(0,229,160,.25);border-radius:14px;padding:20px}
  .dm-sidebar-badge{display:inline-block;background:rgba(0,229,160,.15);color:var(--mint);padding:3px 10px;border-radius:100px;font-size:.7rem;font-weight:700;letter-spacing:.05em;margin-bottom:10px}
  .dm-sidebar-title{font-size:1rem;font-weight:700;color:var(--text);margin-bottom:8px;line-height:1.3}
  .dm-sidebar-sub{color:var(--muted);font-size:.82rem;line-height:1.6;margin-bottom:14px}
  .dm-sidebar-btn{display:inline-block;background:var(--mint);color:#000;font-weight:700;padding:9px 16px;border-radius:8px;font-size:.85rem;text-decoration:none;transition:opacity .2s}
  .dm-sidebar-btn:hover{opacity:.85;text-decoration:none}
  /* Post footer */
  .post-end{max-width:1200px;margin:0 auto;padding:32px 24px 0}
  .post-tags-row{display:flex;align-items:center;gap:8px;margin-bottom:32px;flex-wrap:wrap}
  .post-tag-chip{background:var(--surface);border:1px solid var(--border);color:var(--muted);padding:5px 14px;border-radius:100px;font-size:.8rem}
  .post-nav{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:48px}
  .post-nav-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;text-decoration:none;color:var(--text);transition:border-color .2s}
  .post-nav-card:hover{border-color:var(--mint);text-decoration:none}
  .post-nav-dir{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:6px}
  .post-nav-title{font-size:.9rem;font-weight:600;color:var(--text);line-height:1.4}
  .post-nav-card.next{text-align:right}
  /* Read next */
  .read-next{max-width:1200px;margin:0 auto;padding:0 24px 60px}
  .read-next-label{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:20px}
  .read-next-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  .rn-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;text-decoration:none;color:var(--text);transition:border-color .2s,transform .2s}
  .rn-card:hover{border-color:var(--mint);transform:translateY(-2px);text-decoration:none}
  .rn-card-img{height:160px;overflow:hidden}
  .rn-card-img img,.rn-card-img>div{width:100%;height:160px;border-radius:0}
  .rn-card-body{padding:16px}
  .rn-card-tag{font-size:.7rem;font-weight:700;color:var(--mint);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}
  .rn-card-title{font-size:.95rem;font-weight:700;line-height:1.4;color:var(--text);margin-bottom:8px}
  .rn-card-meta{font-size:.78rem;color:var(--muted)}
  /* Responsive */
  @media(max-width:1024px){
    .post-body{grid-template-columns:180px 1fr 220px;gap:32px}
  }
  @media(max-width:860px){
    .post-body{grid-template-columns:1fr;gap:0}
    .post-toc{display:none}
    .post-sidebar{position:static;margin-top:40px}
    .read-next-grid{grid-template-columns:1fr 1fr}
    .post-nav{grid-template-columns:1fr}
  }
  @media(max-width:560px){
    .post-h1{font-size:1.7rem}
    .read-next-grid{grid-template-columns:1fr}
    .post-cover{padding:0 16px}
    .post-header,.post-body,.post-end,.read-next{padding-left:16px;padding-right:16px}
  }
`;

// ─────────────────────────────────────────────
// BUILD INDIVIDUAL BLOG POSTS
// ─────────────────────────────────────────────
posts.forEach((post, idx) => {
  const postDir = path.join(blogOutputDir, post.slug);
  if (!fs.existsSync(postDir)) fs.mkdirSync(postDir, { recursive: true });

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const tocItems = generateTOC(post.htmlContent);
  const articleHTML = injectHeadingIds(post.htmlContent);

  // Replace [tool] marker with the widget
  const articleWithWidget = articleHTML.replace(/<p>\[tool\]<\/p>/gi, toolWidget);

  const tocHTML = tocItems.length ? `
    <div class="post-toc">
      <div class="toc-readtime">⏱ ${post.readTime || '5 min read'}</div>
      <div class="toc-label">Contents</div>
      <ul class="toc-list">
        ${tocItems.map(h => `<li><a href="#${h.id}">${h.text}</a></li>`).join('')}
      </ul>
    </div>` : `<div class="post-toc"></div>`;

  const prevPost = posts[idx + 1] || null;
  const nextPost = posts[idx - 1] || null;

  const postNavHTML = (prevPost || nextPost) ? `
    <div class="post-nav">
      ${prevPost ? `<a href="/blog/${prevPost.slug}/" class="post-nav-card prev">
        <div class="post-nav-dir">← Previous</div>
        <div class="post-nav-title">${prevPost.h1 || prevPost.title}</div>
      </a>` : '<div></div>'}
      ${nextPost ? `<a href="/blog/${nextPost.slug}/" class="post-nav-card next">
        <div class="post-nav-dir">Next →</div>
        <div class="post-nav-title">${nextPost.h1 || nextPost.title}</div>
      </a>` : '<div></div>'}
    </div>` : '';

  const readNext = posts.filter(p => p.slug !== post.slug).slice(0, 3);
  const readNextHTML = readNext.length ? `
    <div class="read-next">
      <div class="read-next-label">Read Next</div>
      <div class="read-next-grid">
        ${readNext.map(p => `
        <a href="/blog/${p.slug}/" class="rn-card">
          <div class="rn-card-img">${coverImageHTML(p, false)}</div>
          <div class="rn-card-body">
            <div class="rn-card-tag">${p.tags || 'ADHD'}</div>
            <div class="rn-card-title">${p.h1 || p.title}</div>
            <div class="rn-card-meta">${new Date(p.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})} · ${p.readTime || '5 min read'}</div>
          </div>
        </a>`).join('')}
      </div>
    </div>` : '';

  const tocActiveJS = tocItems.length ? `
  <script>
  const tocLinks = document.querySelectorAll('.toc-list a');
  const sections = ${JSON.stringify(tocItems.map(h => h.id))}.map(id => document.getElementById(id)).filter(Boolean);
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
    tocLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });
  </script>` : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${post.title}</title>
  <meta name="description" content="${post.description}">
  <meta property="og:title" content="${post.title}">
  <meta property="og:description" content="${post.description}">
  <meta property="og:url" content="${SITE_URL}/blog/${post.slug}/">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="${SITE_URL}/blog/${post.slug}/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${sharedCSS}${postCSS}</style>
</head>
<body>
  <div id="progress-bar"></div>
  ${navHTML}

  <!-- Breadcrumb -->
  <div class="breadcrumb">
    <a href="/">Home</a>
    <span class="sep">›</span>
    <a href="/blog/">Blog</a>
    <span class="sep">›</span>
    <span class="current">${post.tags || 'ADHD'}</span>
  </div>

  <!-- Post header -->
  <div class="post-header">
    <div class="post-title-area">
      <a href="/blog/" class="post-tag-link">⊕ ${post.tags || 'ADHD'}</a>
      <h1 class="post-h1">${post.h1 || post.title}</h1>
      <p class="post-deck">${post.description}</p>
    </div>
    <div class="post-meta-row">
      <div class="post-author">
        <div class="post-author-avatar">🧠</div>
        <div>
          <div class="post-author-name">DopaMint Team</div>
          <div class="post-author-date">${formattedDate} · ${post.readTime || '5 min read'}</div>
        </div>
      </div>
      <div class="post-share">
        <span class="post-share-label">Share</span>
        <a href="https://twitter.com/intent/tweet?url=${SITE_URL}/blog/${post.slug}/&text=${encodeURIComponent(post.title)}" target="_blank" rel="noopener" class="post-share-btn" title="Share on X">𝕏</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${SITE_URL}/blog/${post.slug}/" target="_blank" rel="noopener" class="post-share-btn" title="Share on Facebook">f</a>
        <button class="post-share-btn" onclick="navigator.clipboard.writeText(window.location.href).then(()=>alert('Link copied!'))" title="Copy link">🔗</button>
      </div>
    </div>
  </div>

  <!-- Cover image -->
  <div class="post-cover">${coverImageHTML(post, true)}</div>

  <!-- 3-column body -->
  <div class="post-body">
    ${tocHTML}
    <article class="post-article">${articleWithWidget}</article>
    <aside class="post-sidebar">
      ${relatedPostsSidebar(post.slug)}
      ${sidebarDMCard}
    </aside>
  </div>

  <!-- Post end -->
  <div class="post-end">
    <div class="post-tags-row">
      <span class="post-tag-chip">${post.tags || 'ADHD'}</span>
      <span class="post-tag-chip">Productivity</span>
    </div>
    ${postNavHTML}
  </div>

  <!-- Read Next -->
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
// BLOG INDEX CSS
// ─────────────────────────────────────────────
const blogIndexCSS = `
  /* Hero */
  .blog-hero{padding:110px 24px 60px;text-align:center;position:relative;overflow:hidden}
  .blog-hero::before{content:'';position:absolute;top:-150px;left:50%;transform:translateX(-50%);width:700px;height:700px;background:radial-gradient(circle,rgba(0,229,160,.1) 0%,transparent 65%);pointer-events:none;z-index:0}
  .blog-hero-inner{position:relative;z-index:1}
  .blog-pill{display:inline-flex;align-items:center;gap:6px;background:rgba(0,229,160,.1);border:1px solid rgba(0,229,160,.2);border-radius:100px;padding:5px 14px;font-size:.78rem;font-weight:600;color:var(--mint);letter-spacing:.06em;text-transform:uppercase;margin-bottom:20px}
  .blog-hero h1{font-size:clamp(2rem,5vw,3.2rem);font-weight:800;line-height:1.15;margin-bottom:14px;background:linear-gradient(135deg,#fff 50%,var(--mint));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .blog-hero .hero-sub{color:var(--muted);font-size:1.05rem;max-width:500px;margin:0 auto;line-height:1.7}
  /* Featured post */
  .blog-main{max-width:1200px;margin:0 auto;padding:0 24px 80px}
  .featured-post{display:grid;grid-template-columns:1fr 1fr;gap:0;background:var(--surface);border:1px solid var(--border);border-radius:20px;overflow:hidden;margin-bottom:48px;text-decoration:none;color:var(--text);transition:border-color .25s,transform .25s}
  .featured-post:hover{border-color:var(--mint);transform:translateY(-3px);text-decoration:none}
  .featured-post-img{height:360px;overflow:hidden}
  .featured-post-img img,.featured-post-img>div{width:100%;height:360px;border-radius:0}
  .featured-post-body{padding:40px;display:flex;flex-direction:column;justify-content:center}
  .featured-tag{display:inline-block;color:var(--mint);font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:14px}
  .featured-title{font-size:1.6rem;font-weight:800;line-height:1.25;color:var(--text);margin-bottom:14px}
  .featured-desc{color:var(--muted);font-size:.95rem;line-height:1.7;margin-bottom:24px}
  .featured-meta{display:flex;align-items:center;gap:12px}
  .featured-author-avatar{width:32px;height:32px;background:var(--mint);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
  .featured-meta-text{font-size:.82rem;color:var(--muted)}
  .featured-meta-text strong{color:var(--text);font-weight:600}
  /* Content grid */
  .blog-content{display:grid;grid-template-columns:1fr 300px;gap:40px;align-items:start}
  .posts-col{}
  .section-label{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:20px}
  .posts-list{display:flex;flex-direction:column;gap:16px}
  .post-card{display:grid;grid-template-columns:180px 1fr;gap:0;background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;text-decoration:none;color:var(--text);transition:border-color .2s,transform .2s}
  .post-card:hover{border-color:var(--mint);transform:translateY(-2px);text-decoration:none}
  .post-card-img{height:140px;overflow:hidden}
  .post-card-img img,.post-card-img>div{width:180px!important;height:140px!important;border-radius:0}
  .post-card-body{padding:20px}
  .post-card-tag{font-size:.7rem;font-weight:700;color:var(--mint);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}
  .post-card-title{font-size:1rem;font-weight:700;line-height:1.4;color:var(--text);margin-bottom:8px}
  .post-card-desc{color:var(--muted);font-size:.85rem;line-height:1.6;margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .post-card-meta{font-size:.78rem;color:var(--muted)}
  /* Index sidebar */
  .index-sidebar{position:sticky;top:84px;display:flex;flex-direction:column;gap:20px}
  .index-sidebar .sidebar-section{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:20px}
  .index-sidebar .sidebar-label{font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:14px}
  .spotlight-item{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border);text-decoration:none;color:var(--text)}
  .spotlight-item:last-child{border-bottom:none;padding-bottom:0}
  .spotlight-item:first-of-type{padding-top:0}
  .spotlight-item:hover{text-decoration:none}
  .spotlight-img{flex-shrink:0;width:60px;height:60px;border-radius:8px;overflow:hidden}
  .spotlight-img img,.spotlight-img>div{width:60px!important;height:60px!important;border-radius:8px}
  .spotlight-tag{font-size:.68rem;font-weight:700;color:var(--mint);text-transform:uppercase;letter-spacing:.04em;margin-bottom:3px}
  .spotlight-title{font-size:.83rem;font-weight:600;line-height:1.4;color:var(--text);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .spotlight-item:hover .spotlight-title{color:var(--mint)}
  .spotlight-date{font-size:.75rem;color:var(--muted);margin-top:2px}
  /* Empty */
  .empty-wrap{grid-column:1/-1;text-align:center;padding:80px 24px;background:var(--surface);border:1px solid var(--border);border-radius:20px}
  .empty-icon{font-size:3rem;margin-bottom:20px}
  .empty-wrap h3{font-size:1.4rem;font-weight:700;margin-bottom:12px}
  .empty-wrap p{color:var(--muted);max-width:400px;margin:0 auto 24px;font-size:.95rem}
  /* Responsive */
  @media(max-width:900px){
    .featured-post{grid-template-columns:1fr}
    .featured-post-img{height:260px}
    .featured-post-img img,.featured-post-img>div{height:260px}
    .blog-content{grid-template-columns:1fr}
    .index-sidebar{position:static}
  }
  @media(max-width:600px){
    .blog-hero{padding:90px 16px 48px}
    .blog-main{padding:0 16px 60px}
    .post-card{grid-template-columns:1fr}
    .post-card-img{height:180px}
    .post-card-img img,.post-card-img>div{width:100%!important;height:180px!important}
    .featured-post-body{padding:24px}
    .featured-title{font-size:1.3rem}
  }
`;

// ─────────────────────────────────────────────
// BUILD BLOG INDEX
// ─────────────────────────────────────────────
const featuredPost = posts[0] || null;
const remainingPosts = posts.slice(1);
const spotlightPosts = posts.slice(0, 4);

const featuredHTML = featuredPost ? `
  <a href="/blog/${featuredPost.slug}/" class="featured-post">
    <div class="featured-post-img">${coverImageHTML(featuredPost, true)}</div>
    <div class="featured-post-body">
      <span class="featured-tag">⊕ ${featuredPost.tags || 'ADHD'}</span>
      <div class="featured-title">${featuredPost.h1 || featuredPost.title}</div>
      <div class="featured-desc">${featuredPost.description}</div>
      <div class="featured-meta">
        <div class="featured-author-avatar">🧠</div>
        <div class="featured-meta-text">
          <strong>DopaMint Team</strong> · ${new Date(featuredPost.date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})} · ${featuredPost.readTime || '5 min read'}
        </div>
      </div>
    </div>
  </a>` : '';

const postsListHTML = remainingPosts.map(post => {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  return `
  <a href="/blog/${post.slug}/" class="post-card">
    <div class="post-card-img">${coverImageHTML(post, false)}</div>
    <div class="post-card-body">
      <div class="post-card-tag">${post.tags || 'ADHD'}</div>
      <div class="post-card-title">${post.h1 || post.title}</div>
      <div class="post-card-desc">${post.description}</div>
      <div class="post-card-meta">${formattedDate} · ${post.readTime || '5 min read'}</div>
    </div>
  </a>`;
}).join('');

const spotlightHTML = spotlightPosts.map(post => `
  <a href="/blog/${post.slug}/" class="spotlight-item">
    <div class="spotlight-img">${coverImageHTML(post, false)}</div>
    <div>
      <div class="spotlight-tag">${post.tags || 'ADHD'}</div>
      <div class="spotlight-title">${post.h1 || post.title}</div>
      <div class="spotlight-date">${new Date(post.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
    </div>
  </a>`).join('');

const emptyHTML = posts.length === 0 ? `
  <div class="empty-wrap">
    <div class="empty-icon">🧠</div>
    <h3>First posts dropping soon</h3>
    <p>We're writing science-backed guides to help ADHD brains actually get things done.</p>
    <a href="https://app.dopamint.app" class="btn-try" style="display:inline-flex;margin-top:8px">Try DopaMint Free →</a>
  </div>` : '';

const blogIndexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>ADHD Tips & Insights | DopaMint Blog</title>
  <meta name="description" content="Science-backed tips, neuroscience insights, and practical strategies for ADHD brains. Learn how to beat task paralysis, build habits, and get things done.">
  <link rel="canonical" href="${SITE_URL}/blog/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${sharedCSS}${blogIndexCSS}</style>
</head>
<body>
  ${navHTML}

  <div class="blog-hero">
    <div class="blog-hero-inner">
      <div class="blog-pill">✦ The ADHD Brain Blog</div>
      <h1>Science-backed tips<br>for ADHD brains</h1>
      <p class="hero-sub">No fluff. No generic advice. Real strategies rooted in neuroscience — written for people who actually have ADHD.</p>
    </div>
  </div>

  <div class="blog-main">
    ${posts.length === 0 ? `<div class="blog-content">${emptyHTML}</div>` : `
    ${featuredHTML}
    <div class="blog-content">
      <div class="posts-col">
        ${remainingPosts.length ? `<div class="section-label">Latest Articles</div><div class="posts-list">${postsListHTML}</div>` : ''}
      </div>
      <aside class="index-sidebar">
        ${spotlightPosts.length ? `
        <div class="sidebar-section">
          <div class="sidebar-label">Spotlight</div>
          ${spotlightHTML}
        </div>` : ''}
        <div class="dm-sidebar-card" style="background:linear-gradient(135deg,rgba(0,229,160,.12),rgba(0,229,160,.04));border:1px solid rgba(0,229,160,.25);border-radius:14px;padding:20px">
          <div class="dm-sidebar-badge" style="display:inline-block;background:rgba(0,229,160,.15);color:var(--mint);padding:3px 10px;border-radius:100px;font-size:.7rem;font-weight:700;letter-spacing:.05em;margin-bottom:10px">🧠 Try it Free</div>
          <div class="dm-sidebar-title" style="font-size:1rem;font-weight:700;color:var(--text);margin-bottom:8px;line-height:1.3">Beat Task Paralysis Today</div>
          <div class="dm-sidebar-sub" style="color:var(--muted);font-size:.82rem;line-height:1.6;margin-bottom:14px">DopaMint uses dopamine-backed nudges to help ADHD brains start tasks — not just plan them.</div>
          <a href="https://app.dopamint.app" class="dm-sidebar-btn" style="display:inline-block;background:var(--mint);color:#000;font-weight:700;padding:9px 16px;border-radius:8px;font-size:.85rem;text-decoration:none">Try DopaMint Free →</a>
        </div>
      </aside>
    </div>`}
  </div>

  ${footerHTML}
</body>
</html>`;

fs.writeFileSync(path.join(blogOutputDir, 'index.html'), blogIndexHTML);
console.log('✅ Built: /blog/');

// ─────────────────────────────────────────────
// GENERATE SITEMAP
// ─────────────────────────────────────────────
const sitemapUrls = [
  { url: `${SITE_URL}/`, priority: '1.0' },
  { url: `${SITE_URL}/blog/`, priority: '0.8' },
  ...posts.map(p => ({ url: `${SITE_URL}/blog/${p.slug}/`, priority: '0.7' }))
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(({ url, priority }) => `  <url>
    <loc>${url}</loc>
    <priority>${priority}</priority>
    <changefreq>weekly</changefreq>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);
console.log(`✅ Sitemap generated with ${sitemapUrls.length} URLs`);
console.log('\n🚀 Build complete!');
