import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { HOME_SEO, BRAND_SEO } from '../src/config/seoRoutes.mjs';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');

// Load .env.production without overriding explicit shell / Vercel env vars
// (skip on Vercel Preview deployments so production domain env isn't mismatched silently)
const envProdPath = path.resolve(process.cwd(), '.env.production');
if (process.env.VERCEL_ENV !== 'preview' && fs.existsSync(envProdPath)) {
  dotenv.config({ path: envProdPath, override: false });
}

function isDisallowedDevUrl(url) {
  const lower = url.toLowerCase();
  return (
    lower.includes('ais-dev-') ||
    lower.includes('ais-pre-') ||
    lower.includes('localhost') ||
    lower.includes('127.0.0.1') ||
    lower.includes('-git-')
  );
}

function normalizeBaseUrl(rawUrl) {
  const trimmed = rawUrl?.trim();
  if (!trimmed || isDisallowedDevUrl(trimmed)) return '';

  const candidate =
    trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return '';
    }
    const cleanPath = parsed.pathname.replace(/\/{2,}/g, '/').replace(/\/+$/, '');
    return `${parsed.origin}${cleanPath}`;
  } catch {
    return '';
  }
}

function resolveConfiguredBaseUrl() {
  const explicit = normalizeBaseUrl(process.env.VITE_PUBLIC_SITE_URL || '');
  if (explicit) {
    return explicit;
  }

  const vercelProd = normalizeBaseUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL || '');
  if (vercelProd) {
    return vercelProd;
  }

  return '';
}

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function replaceOrInsertTag(html, regex, replacement) {
  if (regex.test(html)) {
    return html.replace(regex, replacement);
  }
  return html.replace('</head>', `    ${replacement}\n  </head>`);
}

function buildRouteHtml(templateHtml, routeMeta, baseUrl) {
  const collapsed = routeMeta.canonicalPath.trim().replace(/\/{2,}/g, '/');
  const cleanPath =
    !collapsed || collapsed === '/'
      ? '/'
      : `/${collapsed.replace(/^\/+|\/+$/g, '')}`;

  const canonicalUrl = baseUrl
    ? cleanPath === '/'
      ? `${baseUrl}/`
      : `${baseUrl}${cleanPath}`
    : cleanPath;

  const cleanOgPath = `/${routeMeta.ogImagePath.trim().replace(/\/{2,}/g, '/').replace(/^\/+/, '')}`;
  const ogImageUrl = baseUrl ? `${baseUrl}${cleanOgPath}` : cleanOgPath;

  let html = templateHtml;

  // Update <html lang="..." dir="...">
  html = html.replace(/<html\b[^>]*>/i, (openTag) => {
    let updated = openTag;
    if (/\blang="[^"]*"/i.test(updated)) {
      updated = updated.replace(/\blang="[^"]*"/i, `lang="${escapeAttr(routeMeta.lang)}"`);
    } else {
      updated = updated.replace('<html', `<html lang="${escapeAttr(routeMeta.lang)}"`);
    }
    if (/\bdir="[^"]*"/i.test(updated)) {
      updated = updated.replace(/\bdir="[^"]*"/i, `dir="${escapeAttr(routeMeta.dir)}"`);
    } else {
      updated = updated.replace('<html', `<html dir="${escapeAttr(routeMeta.dir)}"`);
    }
    return updated;
  });

  // Update title, description, canonical, Open Graph & Twitter tags
  html = replaceOrInsertTag(
    html,
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeAttr(routeMeta.title)}</title>`
  );
  html = replaceOrInsertTag(
    html,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeAttr(routeMeta.description)}" />`
  );
  html = replaceOrInsertTag(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeAttr(canonicalUrl)}" />`
  );
  html = replaceOrInsertTag(
    html,
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:type" content="${escapeAttr(routeMeta.ogType || 'website')}" />`
  );
  html = replaceOrInsertTag(
    html,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeAttr(routeMeta.title)}" />`
  );
  html = replaceOrInsertTag(
    html,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeAttr(routeMeta.description)}" />`
  );
  html = replaceOrInsertTag(
    html,
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${escapeAttr(canonicalUrl)}" />`
  );
  html = replaceOrInsertTag(
    html,
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${escapeAttr(ogImageUrl)}" />`
  );
  html = replaceOrInsertTag(
    html,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeAttr(routeMeta.title)}" />`
  );
  html = replaceOrInsertTag(
    html,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeAttr(routeMeta.description)}" />`
  );
  html = replaceOrInsertTag(
    html,
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:image" content="${escapeAttr(ogImageUrl)}" />`
  );

  return html;
}

function buildSitemapXml(routes, baseUrl) {
  const urlNodes = routes
    .map((route) => {
      const loc =
        route.canonicalPath === '/'
          ? `${baseUrl}/`
          : `${baseUrl}${route.canonicalPath}`;
      return `  <url>\n    <loc>${escapeAttr(loc)}</loc>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlNodes}\n</urlset>\n`;
}

function run() {
  if (!fs.existsSync(INDEX_HTML_PATH)) {
    throw new Error(`Missing build output: ${INDEX_HTML_PATH}`);
  }

  const templateHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
  const baseUrl = resolveConfiguredBaseUrl();
  const publicRoutes = [HOME_SEO, BRAND_SEO.atlas, BRAND_SEO.sovi, BRAND_SEO.bymarcos];

  // 1. Update root dist/index.html
  const homeHtml = buildRouteHtml(templateHtml, HOME_SEO, baseUrl);
  fs.writeFileSync(INDEX_HTML_PATH, homeHtml, 'utf8');

  // 2. Emit per-brand static HTML shells for social crawlers (both /<slug>.html and /<slug>/index.html)
  for (const brand of [BRAND_SEO.atlas, BRAND_SEO.sovi, BRAND_SEO.bymarcos]) {
    const brandHtml = buildRouteHtml(templateHtml, brand, baseUrl);

    const slugHtmlPath = path.join(DIST_DIR, `${brand.slug}.html`);
    fs.writeFileSync(slugHtmlPath, brandHtml, 'utf8');

    const slugDirPath = path.join(DIST_DIR, brand.slug);
    fs.mkdirSync(slugDirPath, { recursive: true });
    fs.writeFileSync(path.join(slugDirPath, 'index.html'), brandHtml, 'utf8');
  }

  // 3. Emit sitemap.xml and robots.txt Sitemap directive when public base URL is configured
  const robotsPath = path.join(DIST_DIR, 'robots.txt');
  const baseRobots = 'User-agent: *\nAllow: /\n';

  if (baseUrl) {
    const sitemapXml = buildSitemapXml(publicRoutes, baseUrl);
    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
    fs.writeFileSync(
      robotsPath,
      `${baseRobots}\nSitemap: ${baseUrl}/sitemap.xml\n`,
      'utf8'
    );
    console.log(
      `[prerender-meta] Generated route HTML + sitemap.xml for ${baseUrl} (${publicRoutes.length} routes)`
    );
  } else {
    const sitemapPath = path.join(DIST_DIR, 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) fs.unlinkSync(sitemapPath);
    fs.writeFileSync(robotsPath, baseRobots, 'utf8');
    console.log(
      `[prerender-meta] Generated route HTML for ${publicRoutes.length} routes (no VITE_PUBLIC_SITE_URL / VERCEL_* URL set; omitted domain-less sitemap.xml).`
    );
  }
}

run();
