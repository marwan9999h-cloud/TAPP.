import { useEffect } from 'react';
import { buildStructuredDataForRoute } from '../config/structuredData';
import {
  getAbsoluteAssetUrl,
  getCanonicalUrl,
  getPublicBaseUrl,
  normalizePath,
} from '../utils/url';

export interface DocumentMetaInput {
  title: string;
  description: string;
  canonicalPath: string;
  lang: 'en' | 'ar';
  dir: 'ltr' | 'rtl';
  ogLocale?: string;
  ogImagePath: string;
  ogImageAlt?: string;
  ogType?: string;
  robots?: string;
}

function upsertMetaTag(
  selectorAttr: 'name' | 'property',
  attrValue: string,
  content: string
): void {
  let el = document.head.querySelector(
    `meta[${selectorAttr}="${attrValue}"]`
  ) as HTMLMetaElement | null;

  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(selectorAttr, attrValue);
    document.head.appendChild(el);
  }

  el.setAttribute('content', content);
}

function removeMetaTag(selectorAttr: 'name' | 'property', attrValue: string): void {
  const el = document.head.querySelector(`meta[${selectorAttr}="${attrValue}"]`);
  if (el) el.remove();
}

function upsertCanonicalLink(href: string): void {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function removeCanonicalLink(): void {
  const link = document.head.querySelector('link[rel="canonical"]');
  if (link) link.remove();
}

function upsertJsonLd(data: Record<string, unknown>): void {
  let script = document.head.querySelector(
    'script[type="application/ld+json"]#tapp-structured-data'
  ) as HTMLScriptElement | null;

  if (!script) {
    // Also clean any prerendered untagged ld+json script before managing our single tag
    const existing = document.head.querySelector('script[type="application/ld+json"]');
    if (existing) existing.remove();

    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'tapp-structured-data';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}

function removeJsonLd(): void {
  const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
  scripts.forEach((s) => s.remove());
}

/**
 * Synchronizes document title, html lang/dir, canonical URL, Open Graph / Twitter
 * tags, and Schema.org JSON-LD in the browser DOM across client-side routes.
 */
export function useDocumentMeta(meta: DocumentMetaInput | null): void {
  useEffect(() => {
    if (!meta || typeof document === 'undefined') return;

    const cleanPath = normalizePath(meta.canonicalPath);
    const isNotFound = Boolean(meta.robots?.includes('noindex'));

    const canonicalUrl = !isNotFound ? getCanonicalUrl(cleanPath) : cleanPath;
    const absoluteOgImage = getAbsoluteAssetUrl(meta.ogImagePath);
    const ogLocale = meta.ogLocale || (meta.lang === 'ar' ? 'ar_EG' : 'en_GB');

    document.documentElement.lang = meta.lang;
    document.documentElement.dir = meta.dir;
    document.title = meta.title;

    upsertMetaTag('name', 'description', meta.description);

    if (meta.robots) {
      upsertMetaTag('name', 'robots', meta.robots);
    } else {
      removeMetaTag('name', 'robots');
    }

    if (isNotFound) {
      removeCanonicalLink();
    } else {
      upsertCanonicalLink(canonicalUrl);
    }

    upsertMetaTag('property', 'og:site_name', 'TAPP');
    upsertMetaTag('property', 'og:type', meta.ogType || 'website');
    upsertMetaTag('property', 'og:locale', ogLocale);
    upsertMetaTag('property', 'og:title', meta.title);
    upsertMetaTag('property', 'og:description', meta.description);
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('property', 'og:image', absoluteOgImage);
    if (meta.ogImageAlt) {
      upsertMetaTag('property', 'og:image:alt', meta.ogImageAlt);
    }
    upsertMetaTag('property', 'og:image:width', '1200');
    upsertMetaTag('property', 'og:image:height', '630');

    upsertMetaTag('name', 'twitter:card', 'summary_large_image');
    upsertMetaTag('name', 'twitter:title', meta.title);
    upsertMetaTag('name', 'twitter:description', meta.description);
    upsertMetaTag('name', 'twitter:image', absoluteOgImage);

    if (isNotFound) {
      removeJsonLd();
    } else {
      const jsonLd = buildStructuredDataForRoute(cleanPath, getPublicBaseUrl(), meta.lang);
      if (jsonLd) {
        upsertJsonLd(jsonLd);
      } else {
        removeJsonLd();
      }
    }
  }, [
    meta?.title,
    meta?.description,
    meta?.canonicalPath,
    meta?.lang,
    meta?.dir,
    meta?.ogLocale,
    meta?.ogImagePath,
    meta?.ogImageAlt,
    meta?.ogType,
    meta?.robots,
  ]);
}
