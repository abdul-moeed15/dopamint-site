const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const SITE_URL = 'https://dopamint.app';
const contentDir = path.join(__dirname, 'content/blog');
const blogOutputDir = path.join(__dirname, 'blog');

// Ensure blog output directory exists
if (!fs.existsSync(blogOutputDir)) fs.mkdirSync(blogOutputDir, { recursive: true });

// Read all markdown posts
const posts = [];
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const raw = fs.readFileSync(path.join(contentDir, file), 'utf8');
  const { data, content } = matter(raw);
  if (!data.slug) return;
  posts.push({
    ...data,
    content,
    htmlContent: marked(content)
  });
});

// Sort by date descending
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// ─────────────────────────────────────────────
// SHARED STYLES (matches landing page design)
// ─────────────────────────────────────────────
const sharedCSS = `
  :root{--mint:#00e5a0;--bg:#0b0c10;--surface:#13151c;--border:#1f2230;--text:#e8eaf0;--muted:#7c8099;--radius:14px;--font:'Inter',system-ui,sans-serif}
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--text);font-family:var(--font);font-size:18px;line-height:1.8;-webkit-font-smoothing:antialiased}
  a{color:var(--mint);text-decoration:none}
  a:hover{text-decoration:underline}
  img{max-width:100%;height:auto}
  /* Progress bar */
  #progress-bar{position:fixed;top:0;left:0;height:3px;background:var(--mint);width:0%;z-index:9999;transition:width .1s linear}
  /* Nav */
  nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(11,12,16,.9);backdrop-filter:blur(12px);border-bottom:1px solid var(--border)}
  .nav-inner{max-width:1100px;margin:0 auto;padding:0 24px;height:64px;display:flex;align-items:center;justify-content:space-between}
  .nav-logo{display:flex;align-items:center;gap:10px;font-weight:700;font-size:1.15rem;color:var(--text)}
  .nav-logo span{color:var(--mint)}
  .logo-icon{width:32px;height:32px;background:var(--mint);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px}
  .nav-btns{display:flex;align-items:center;gap:12px}
  .btn-signin{background:transparent;border:1px solid var(--border);color:var(--text);padding:8px 18px;border-radius:8px;font-size:.9rem;cursor:pointer;font-family:var(--font);text-decoration:none;display:inline-flex;align-items:center}
  .btn-try{background:var(--mint);color:#000;font-weight:600;padding:8px 18px;border-radius:8px;font-size:.9rem;cursor:pointer;font-family:var(--font);border:none;text-decoration:none;display:inline-flex;align-items:center}
  /* Blog hero */
  .blog-hero{padding:120px 24px 60px;text-align:center;max-width:800px;margin:0 auto}
  .blog-hero .tag{display:inline-block;background:rgba(0,229,160,.12);color:var(--mint);padding:4px 14px;border-radius:20px;font-size:.8rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase;margin-bottom:16px}
  .blog-hero h1{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:800;line-height:1.2;color:var(--text);margin-bottom:16px}
  .blog-hero .meta{color:var(--muted);font-size:.9rem;display:flex;align-items:center;justify-content:center;gap:16px}
  /* Article */
  .article-wrap{max-width:740px;margin:0 auto;padding:0 24px 80px}
  .article-wrap h2{font-size:1.5rem;font-weight:700;margin:2.5rem 0 1rem;color:var(--text)}
  .article-wrap h3{font-size:1.2rem;font-weight:600;margin:2rem 0 .75rem;color:var(--text)}
  .article-wrap p{margin-bottom:1.4rem;color:#c8cad6}
  .article-wrap ul,.article-wrap ol{margin:0 0 1.4rem 1.5rem;color:#c8cad6}
  .article-wrap li{margin-bottom:.6rem}
  .article-wrap blockquote{border-left:3px solid var(--mint);padding:12px 20px;background:var(--surface);border-radius:0 8px 8px 0;margin:2rem 0;font-style:italic;color:var(--muted)}
  .article-wrap strong{color:var(--text);font-weight:600}
  /* CTA box */
  .cta-box{background:linear-gradient(135deg,rgba(0,229,160,.12),rgba(0,229,160,.05));border:1px solid rgba(0,229,160,.3);border-radius:var(--radius);padding:40px;text-align:center;margin:3rem 0}
  .cta-box h3{font-size:1.4rem;font-weight:700;margin-bottom:12px}
  .cta-box p{color:var(--muted);margin-bottom:24px}
  .cta-box .btn-try{padding:14px 32px;font-size:1rem;border-radius:10px}
  /* Blog index cards */
  .blog-index{max-width:1100px;margin:0 auto;padding:120px 24px 80px}
  .blog-index h1{font-size:2.5rem;font-weight:800;margin-bottom:8px}
  .blog-index .subtitle{color:var(--muted);margin-bottom:48px;font-size:1.1rem}
  .posts-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:24px}
  .post-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:28px;transition:border-color .2s,transform .2s;display:block;text-decoration:none;color:var(--text)}
  .post-card:hover{border-color:var(--mint);transform:translateY(-2px);text-decoration:none}
  .post-card .tag{display:inline-block;background:rgba(0,229,160,.12);color:var(--mint);padding:3px 10px;border-radius:20px;font-size:.75rem;font-weight:600;margin-bottom:14px}
  .post-card h2{font-size:1.15rem;font-weight:700;line-height:1.4;margin-bottom:12px}
  .post-card p{color:var(--muted);font-size:.9rem;line-height:1.6;margin-bottom:16px}
  .post-card .read-more{color:var(--mint);font-size:.88rem;font-weight:600}
  /* Footer */
  footer{border-top:1px solid var(--border);padding:48px 24px;text-align:center}
  footer p{color:var(--muted);font-size:.9rem}
  /* Responsive */
  @media(max-width:768px){
    .blog-hero{padding:96px 16px 40px}
    .article-wrap{padding:0 16px 60px}
    .blog-index{padding:96px 16px 60px}
    .nav-inner{padding:0 16px;height:56px}
  }
  @media(max-width:480px){
    .btn-signin{display:none}
    .posts-grid{grid-template-columns:1fr}
  }
`;

// ─────────────────────────────────────────────
// NAV + FOOTER SHARED HTML
// ─────────────────────────────────────────────
const navHTML = `
<nav>
  <div class="nav-inner">
    <a href="/" class="nav-logo">
      <div class="logo-icon">🧠</div>
      Dopa<span>Mint</span>
    </a>
    <div class="nav-btns">
      <a href="https://app.dopamint.app" class="btn-signin">Sign In</a>
      <a href="https://app.dopamint.app" class="btn-try">Try Free →</a>
    </div>
  </div>
</nav>`;

const footerHTML = `
<footer>
  <p>© ${new Date().getFullYear()} DopaMint. All rights reserved. &nbsp;·&nbsp; <a href="/blog/">Blog</a></p>
</footer>`;

const progressBarJS = `
<script>
window.addEventListener('scroll',()=>{
  const d=document.documentElement;
  const pct=(d.scrollTop/(d.scrollHeight-d.clientHeight))*100;
  document.getElementById('progress-bar').style.width=pct+'%';
});
</script>`;

// ─────────────────────────────────────────────
// BUILD INDIVIDUAL BLOG POST PAGES
// ─────────────────────────────────────────────
posts.forEach(post => {
  const postDir = path.join(blogOutputDir, post.slug);
  if (!fs.existsSync(postDir)) fs.mkdirSync(postDir, { recursive: true });

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

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
  <style>${sharedCSS}</style>
</head>
<body>
  <div id="progress-bar"></div>
  ${navHTML}

  <div class="blog-hero">
    <span class="tag">${post.tags || 'ADHD'}</span>
    <h1>${post.h1 || post.title}</h1>
    <div class="meta">
      <span>${formattedDate}</span>
      <span>·</span>
      <span>${post.readTime || '5 min read'}</span>
    </div>
  </div>

  <div class="article-wrap">
    ${post.htmlContent}

    <div class="cta-box">
      <h3>Ready to beat task paralysis?</h3>
      <p>DopaMint uses dopamine-backed nudges to help ADHD brains actually start — not just plan.</p>
      <a href="https://app.dopamint.app" class="btn-try">Try DopaMint Free →</a>
    </div>
  </div>

  ${footerHTML}
  ${progressBarJS}
</body>
</html>`;

  fs.writeFileSync(path.join(postDir, 'index.html'), html);
  console.log(`✅ Built: /blog/${post.slug}/`);
});

// ─────────────────────────────────────────────
// BUILD BLOG INDEX PAGE
// ─────────────────────────────────────────────
const cardHTML = posts.map(post => {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  return `
  <a href="/blog/${post.slug}/" class="post-card">
    <span class="tag">${post.tags || 'ADHD'}</span>
    <h2>${post.h1 || post.title}</h2>
    <p>${post.description}</p>
    <span class="read-more">${post.readTime || '5 min read'} →</span>
  </a>`;
}).join('');

const emptyState = posts.length === 0 ? `
  <p style="color:var(--muted);text-align:center;grid-column:1/-1;padding:40px 0;">
    No posts yet — check back soon!
  </p>` : '';

const blogIndexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>ADHD Tips & Insights | DopaMint Blog</title>
  <meta name="description" content="Expert tips, neuroscience insights, and practical strategies for ADHD brains. Learn how to beat task paralysis, build habits, and get things done.">
  <link rel="canonical" href="${SITE_URL}/blog/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${sharedCSS}</style>
</head>
<body>
  ${navHTML}

  <div class="blog-index">
    <h1>DopaMint Blog</h1>
    <p class="subtitle">ADHD tips, neuroscience insights, and practical strategies.</p>
    <div class="posts-grid">
      ${cardHTML || emptyState}
    </div>
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
