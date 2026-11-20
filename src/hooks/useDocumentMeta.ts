import { useEffect } from 'react';
import { getPublicBaseUrl, normalizePath } from '../utils/url';

export interface DocumentMetaInput {
  title: string;
  description: string;
  canonicalPath: string;
  lang: 'en' | 'ar';
  dir: 'ltr' | 'rtl';
  ogImagePath: string;
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

/**
 * Synchronizes document title, html lang/dir, canonical URL, and Open Graph / Twitter
 * tags in the browser DOM across client-side routes and language toggles.
 */
export function useDocumentMeta(meta: DocumentMetaInput | null): void {
  useEffect(() => {
    if (!meta || typeof document === 'undefined') return;

    const baseUrl = getPublicBaseUrl();
    const cleanPath = normalizePath(meta.canonicalPath);
    const isNotFound = Boolean(meta.robots?.includes('noindex'));

    const canonicalUrl =
      !isNotFound && baseUrl
        ? cleanPath === '/'
          ? `${baseUrl}/`
          : `${baseUrl}${cleanPath}`
        : cleanPath;

    const absoluteOgImage = baseUrl
      ? `${baseUrl}${meta.ogImagePath}`
      : meta.ogImagePath;

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
    upsertMetaTag('property', 'og:title', meta.title);
    upsertMetaTag('property', 'og:description', meta.description);
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('property', 'og:image', absoluteOgImage);
    upsertMetaTag('property', 'og:image:width', '1200');
    upsertMetaTag('property', 'og:image:height', '630');

    upsertMetaTag('name', 'twitter:card', 'summary_large_image');
    upsertMetaTag('name', 'twitter:title', meta.title);
    upsertMetaTag('name', 'twitter:description', meta.description);
    upsertMetaTag('name', 'twitter:image', absoluteOgImage);
  }, [
    meta?.title,
    meta?.description,
    meta?.canonicalPath,
    meta?.lang,
    meta?.dir,
    meta?.ogImagePath,
    meta?.ogType,
    meta?.robots,
  ]);
}
