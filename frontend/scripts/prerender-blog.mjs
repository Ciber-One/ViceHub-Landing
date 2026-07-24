import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR = path.resolve(HERE, "..");
const BUILD_DIR = path.join(FRONTEND_DIR, "build");
const SITE_URL = (process.env.PUBLIC_SITE_URL || process.env.REACT_APP_SITE_URL || "https://www.vicehub.live").replace(/\/+$/, "");
const BACKEND_URL = (
  process.env.SEO_BACKEND_URL
  || process.env.REACT_APP_BACKEND_URL
  || "https://vicehub-landing-production.up.railway.app"
).replace(/\/+$/, "");
const API_URL = `${BACKEND_URL}/api`;
const DEFAULT_IMAGE = `${SITE_URL}/vicehub.png`;

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const escapeXml = escapeHtml;

const safeJson = (value) =>
  JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026");

const absoluteImageUrl = (coverPath) => {
  if (!coverPath) return DEFAULT_IMAGE;
  if (/^https?:\/\//i.test(coverPath)) return coverPath;
  return `${API_URL}/blog/image/${coverPath.replace(/^\/+/, "")}`;
};

const formatDate = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
};

const extractSources = (markdown = "") => {
  const seen = new Set();
  const sources = [];
  const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)(?:\s+["'][^"']*["'])?\)/gi;
  let match;

  while ((match = linkPattern.exec(markdown)) !== null) {
    const [, label, url] = match;
    if (seen.has(url)) continue;
    seen.add(url);
    sources.push({ label: label.trim() || new URL(url).hostname, url });
  }

  return sources;
};

const fetchJson = async (url) => {
  const response = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "ViceHub-SEO-Prerender/1.0" },
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }

  return response.json();
};

const fetchPosts = async () => {
  const summaries = await fetchJson(`${API_URL}/blog/posts`);
  if (!Array.isArray(summaries)) {
    throw new Error("The blog API did not return an article list.");
  }

  const posts = [];
  const batchSize = 6;
  for (let index = 0; index < summaries.length; index += batchSize) {
    const batch = summaries.slice(index, index + batchSize);
    const fullPosts = await Promise.all(
      batch.map((post) => fetchJson(`${API_URL}/blog/posts/${encodeURIComponent(post.slug)}`)),
    );
    posts.push(...fullPosts);
  }

  return posts.filter((post) => post?.published && /^[a-z0-9][a-z0-9-]*$/i.test(post.slug || ""));
};

const prerenderStyles = `
  <style id="vicehub-prerender-styles">
    .vh-prerender{min-height:100vh;background:#09050c;color:#f5f5f2;font-family:Manrope,system-ui,sans-serif}
    .vh-prerender *{box-sizing:border-box}
    .vh-prerender a{color:inherit}
    .vh-prerender-header{height:72px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center}
    .vh-prerender-header-inner,.vh-prerender-main{width:min(100% - 40px,1120px);margin:0 auto}
    .vh-prerender-header-inner{display:flex;align-items:center;justify-content:space-between}
    .vh-prerender-logo{height:34px;width:auto;display:block}
    .vh-prerender-nav{display:flex;gap:24px;color:#c8ccd1;font-size:14px}
    .vh-prerender-main{padding:64px 0 96px}
    .vh-prerender-article{width:min(100%,760px);margin:0 auto}
    .vh-prerender-kicker{color:#ff8b69;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
    .vh-prerender h1{font-family:Outfit,system-ui,sans-serif;font-size:clamp(38px,6vw,64px);line-height:1.04;margin:18px 0 22px}
    .vh-prerender-summary{color:#c8ccd1;font-size:19px;line-height:1.7}
    .vh-prerender-meta{display:flex;flex-wrap:wrap;gap:10px 18px;margin-top:22px;color:#aeb2b8;font-size:14px}
    .vh-prerender-cover{display:block;width:100%;max-height:520px;object-fit:cover;margin:36px 0;border-radius:8px;border:1px solid rgba(255,255,255,.1)}
    .vh-prerender-body{color:#d9d9d7;font-size:17px;line-height:1.8}
    .vh-prerender-body h2,.vh-prerender-body h3{font-family:Outfit,system-ui,sans-serif;color:#f5f5f2;line-height:1.2;margin:42px 0 14px}
    .vh-prerender-body h2{font-size:30px}.vh-prerender-body h3{font-size:23px}
    .vh-prerender-body a,.vh-prerender-source a{color:#ff9a7d;text-decoration:underline;text-underline-offset:3px}
    .vh-prerender-body img{max-width:100%;height:auto}
    .vh-prerender-cta{margin-top:52px;padding:26px;border:1px solid rgba(255,139,105,.28);background:#16101d;border-radius:8px}
    .vh-prerender-cta h2{margin:0 0 8px;font-size:25px}
    .vh-prerender-button{display:inline-block;margin-top:16px;padding:12px 18px;background:#ff6b4a;color:#09050c!important;text-decoration:none!important;font-weight:700;border-radius:6px}
    .vh-prerender-sources{margin-top:44px;padding-top:28px;border-top:1px solid rgba(255,255,255,.1)}
    .vh-prerender-sources h2{font-size:23px;margin:0 0 12px}
    .vh-prerender-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;margin-top:38px}
    .vh-prerender-card{display:block;padding:24px;border:1px solid rgba(255,255,255,.1);background:#16101d;border-radius:8px;text-decoration:none}
    .vh-prerender-card h2{font-size:24px;line-height:1.25;margin:10px 0}
    .vh-prerender-card p{color:#c8ccd1;line-height:1.65}
    @media(max-width:700px){.vh-prerender-nav{gap:14px}.vh-prerender-main{padding-top:42px}.vh-prerender-grid{grid-template-columns:1fr}.vh-prerender h1{font-size:40px}.vh-prerender-summary{font-size:17px}}
  </style>`;

const stripExistingSeo = (template) => {
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>\s*/gi, "");

  const keys = [
    "description",
    "author",
    "keywords",
    "og:title",
    "og:description",
    "og:type",
    "og:image",
    "og:url",
    "og:site_name",
    "article:published_time",
    "article:modified_time",
    "twitter:card",
    "twitter:title",
    "twitter:description",
    "twitter:image",
  ];

  for (const key of keys) {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    html = html.replace(
      new RegExp(`<meta\\s+[^>]*(?:name|property)=["']${escapedKey}["'][^>]*>\\s*`, "gi"),
      "",
    );
  }

  return html;
};

const renderDocument = ({ template, title, description, canonical, image, type, jsonLd, body, author, published, modified }) => {
  const metadata = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    ${author ? `<meta name="author" content="${escapeHtml(author)}" />` : ""}
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <meta property="og:site_name" content="ViceHub" />
    <meta property="og:type" content="${escapeHtml(type)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    ${published ? `<meta property="article:published_time" content="${escapeHtml(published)}" />` : ""}
    ${modified ? `<meta property="article:modified_time" content="${escapeHtml(modified)}" />` : ""}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <script id="ld-json-prerender" type="application/ld+json">${safeJson(jsonLd)}</script>
    ${prerenderStyles}`;

  const cleanTemplate = stripExistingSeo(template).replace(
    /<noscript>[\s\S]*?<\/noscript>/i,
    "<noscript>The ViceHub Journal is available below without JavaScript.</noscript>",
  );

  if (!cleanTemplate.includes('<div id="root"></div>')) {
    throw new Error("Could not find the empty React root in build/index.html.");
  }

  return cleanTemplate
    .replace("</head>", `${metadata}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
};

const renderHeader = () => `
  <header class="vh-prerender-header">
    <div class="vh-prerender-header-inner">
      <a href="${SITE_URL}/" aria-label="ViceHub home">
        <img class="vh-prerender-logo" src="${SITE_URL}/vicehub-logo-light.png" alt="ViceHub" />
      </a>
      <nav class="vh-prerender-nav" aria-label="Primary">
        <a href="${SITE_URL}/blog">Journal</a>
        <a href="${SITE_URL}/map">Map</a>
      </nav>
    </div>
  </header>`;

const renderArticleFallback = (post, sources) => {
  const markdown = renderToStaticMarkup(
    React.createElement(ReactMarkdown, { remarkPlugins: [remarkGfm] }, post.content || ""),
  );
  const cover = absoluteImageUrl(post.cover_path);
  const published = formatDate(post.created_at);
  const modified = formatDate(post.updated_at);
  const sourceMarkup = sources.length
    ? `
      <section class="vh-prerender-sources" aria-labelledby="sources-heading">
        <h2 id="sources-heading">Sources and references</h2>
        <ul>${sources.map((source) => `<li class="vh-prerender-source"><a href="${escapeHtml(source.url)}" rel="noopener noreferrer">${escapeHtml(source.label)}</a></li>`).join("")}</ul>
      </section>`
    : "";

  return `
    <div class="vh-prerender">
      ${renderHeader()}
      <main class="vh-prerender-main">
        <article class="vh-prerender-article">
          <a href="${SITE_URL}/blog">Back to the Journal</a>
          <p class="vh-prerender-kicker">${escapeHtml(post.category || "Journal")}</p>
          <h1>${escapeHtml(post.title)}</h1>
          <p class="vh-prerender-summary">${escapeHtml(post.excerpt || post.meta_description || "")}</p>
          <div class="vh-prerender-meta">
            <span>By ${escapeHtml(post.author || "ViceHub Team")}</span>
            <time datetime="${escapeHtml(post.created_at || "")}">Published ${escapeHtml(published)}</time>
            ${modified && modified !== published ? `<time datetime="${escapeHtml(post.updated_at || "")}">Updated ${escapeHtml(modified)}</time>` : ""}
            <span>${Number(post.reading_time) || 1} min read</span>
          </div>
          ${post.cover_path ? `<img class="vh-prerender-cover" src="${escapeHtml(cover)}" alt="${escapeHtml(post.title)}" />` : ""}
          <div class="vh-prerender-body">${markdown}</div>
          ${sourceMarkup}
          <aside class="vh-prerender-cta">
            <h2>Explore Leonida while you read</h2>
            <p>Open ViceHub's live interactive map to pan, zoom, filter, and inspect mapped locations.</p>
            <a class="vh-prerender-button" href="${SITE_URL}/map">Open the Interactive Map</a>
          </aside>
        </article>
      </main>
    </div>`;
};

const articleStructuredData = (post, canonical, image, sources) => {
  const authorName = post.author || "ViceHub Team";
  const authorType = /vicehub|team|staff/i.test(authorName) ? "Organization" : "Person";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${canonical}#article`,
        headline: post.title,
        description: post.meta_description || post.excerpt,
        image: [image],
        datePublished: post.created_at,
        dateModified: post.updated_at || post.created_at,
        author: { "@type": authorType, name: authorName },
        publisher: {
          "@type": "Organization",
          name: "ViceHub",
          logo: { "@type": "ImageObject", url: DEFAULT_IMAGE },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        articleSection: post.category || "Journal",
        keywords: Array.isArray(post.tags) ? post.tags.join(", ") : undefined,
        citation: sources.length ? sources.map((source) => source.url) : undefined,
        isPartOf: { "@type": "Blog", name: "ViceHub Journal", url: `${SITE_URL}/blog` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ViceHub", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: canonical },
        ],
      },
    ],
  };
};

const renderIndexFallback = (posts) => `
  <div class="vh-prerender">
    ${renderHeader()}
    <main class="vh-prerender-main">
      <p class="vh-prerender-kicker">ViceHub Journal</p>
      <h1>Field notes for the road to Vice City.</h1>
      <p class="vh-prerender-summary">GTA 6 release updates, map guides, companion concepts, and the product decisions behind ViceHub.</p>
      <section class="vh-prerender-grid" aria-label="Latest articles">
        ${posts.map((post) => `
          <a class="vh-prerender-card" href="${SITE_URL}/blog/${escapeHtml(post.slug)}">
            <span class="vh-prerender-kicker">${escapeHtml(post.category || "Journal")}</span>
            <h2>${escapeHtml(post.title)}</h2>
            <p>${escapeHtml(post.excerpt || post.meta_description || "")}</p>
            <time datetime="${escapeHtml(post.updated_at || post.created_at || "")}">${escapeHtml(formatDate(post.updated_at || post.created_at))}</time>
          </a>`).join("")}
      </section>
    </main>
  </div>`;

const indexStructuredData = (posts) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Blog",
      "@id": `${SITE_URL}/blog#blog`,
      name: "ViceHub Journal",
      description: "GTA 6 news, guides, map analysis, and ViceHub product updates.",
      url: `${SITE_URL}/blog`,
      publisher: { "@type": "Organization", name: "ViceHub", url: SITE_URL },
      blogPost: posts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        url: `${SITE_URL}/blog/${post.slug}`,
        dateModified: post.updated_at || post.created_at,
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ViceHub", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE_URL}/blog` },
      ],
    },
  ],
});

const writePage = async (routePath, html) => {
  const cleanPath = routePath.replace(/^\/+|\/+$/g, "");
  const directory = path.join(BUILD_DIR, cleanPath);
  await fs.mkdir(directory, { recursive: true });
  await Promise.all([
    fs.writeFile(path.join(directory, "index.html"), html, "utf8"),
    fs.writeFile(path.join(BUILD_DIR, `${cleanPath}.html`), html, "utf8"),
  ]);
};

const createSitemap = (posts) => {
  const staticUrls = [
    { loc: `${SITE_URL}/` },
    { loc: `${SITE_URL}/blog` },
    { loc: `${SITE_URL}/map` },
    { loc: `${SITE_URL}/contact` },
    { loc: `${SITE_URL}/privacy` },
    { loc: `${SITE_URL}/terms` },
  ];
  const articleUrls = posts.map((post) => ({
    loc: `${SITE_URL}/blog/${post.slug}`,
    lastmod: post.updated_at || post.created_at,
    image: absoluteImageUrl(post.cover_path),
    imageTitle: post.title,
  }));
  const entries = [...staticUrls, ...articleUrls].map((entry) => {
    const lastmod = entry.lastmod ? `<lastmod>${escapeXml(new Date(entry.lastmod).toISOString())}</lastmod>` : "";
    const image = entry.image
      ? `<image:image><image:loc>${escapeXml(entry.image)}</image:loc><image:title>${escapeXml(entry.imageTitle)}</image:title></image:image>`
      : "";
    return `<url><loc>${escapeXml(entry.loc)}</loc>${lastmod}${image}</url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${entries.join("\n")}\n</urlset>\n`;
};

const main = async () => {
  const template = await fs.readFile(path.join(BUILD_DIR, "index.html"), "utf8");
  const posts = await fetchPosts();

  const indexHtml = renderDocument({
    template,
    title: "ViceHub Journal | GTA 6 News, Guides and Map Analysis",
    description: "Read GTA 6 news, guides, map analysis, character coverage, and ViceHub product updates in the ViceHub Journal.",
    canonical: `${SITE_URL}/blog`,
    image: DEFAULT_IMAGE,
    type: "website",
    jsonLd: indexStructuredData(posts),
    body: renderIndexFallback(posts),
  });
  await writePage("/blog", indexHtml);

  for (const post of posts) {
    const canonical = `${SITE_URL}/blog/${post.slug}`;
    const image = absoluteImageUrl(post.cover_path);
    const sources = extractSources(post.content);
    const html = renderDocument({
      template,
      title: `${post.meta_title || post.title} | ViceHub Journal`,
      description: post.meta_description || post.excerpt || post.title,
      canonical,
      image,
      type: "article",
      jsonLd: articleStructuredData(post, canonical, image, sources),
      body: renderArticleFallback(post, sources),
      author: post.author || "ViceHub Team",
      published: post.created_at,
      modified: post.updated_at || post.created_at,
    });
    await writePage(`/blog/${post.slug}`, html);
  }

  await Promise.all([
    fs.writeFile(path.join(BUILD_DIR, "sitemap.xml"), createSitemap(posts), "utf8"),
    fs.writeFile(
      path.join(BUILD_DIR, "robots.txt"),
      `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      "utf8",
    ),
  ]);

  console.log(`Prerendered the Journal index and ${posts.length} article pages for ${SITE_URL}.`);
};

main().catch((error) => {
  console.error(`Blog prerender failed: ${error.message}`);
  process.exitCode = 1;
});
