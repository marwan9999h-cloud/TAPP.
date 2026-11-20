import type { BrandSlug } from '../config/brands';

/**
 * Normalizes a route path:
 * - Ensures leading slash
 * - Strips trailing slashes (except root '/')
 * - Lowercases path
 */
export function normalizePath(path: string): string {
  const trimmed = path.trim().toLowerCase();
  if (!trimmed || trimmed === '/') return '/';
  const withLeading = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withLeading.replace(/\/+$/, '') || '/';
}

function isDisallowedPublicBase(url: string): boolean {
  const lower = url.toLowerCase();
  return (
    lower.includes('ais-dev-') ||
    lower.includes('ais-pre-') ||
    lower.includes('localhost') ||
    lower.includes('127.0.0.1') ||
    lower.includes('-git-')
  );
}

/**
 * Resolves the public origin for canonical links, NFC destinations, and QR codes.
 * Prefers VITE_PUBLIC_SITE_URL when configured; otherwise uses window.location.origin.
 */
export function getPublicBaseUrl(): string {
  const env = (import.meta as { env?: Record<string, string | undefined> }).env;
  const configuredBase = env?.VITE_PUBLIC_SITE_URL?.trim();
  if (configuredBase && !isDisallowedPublicBase(configuredBase)) {
    return configuredBase.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, '');
  }

  return '';
}

/**
 * Returns the canonical path for a registered Brand Page (e.g. '/atlas').
 */
export function getBrandCanonicalPath(slug: BrandSlug | string): string {
  const cleanSlug = slug.trim().toLowerCase().replace(/^\/+|\/+$/g, '');
  return cleanSlug ? `/${cleanSlug}` : '/';
}

/**
 * Returns the canonical absolute URL for a Brand Page.
 * Used identically for QR generation, URL copying, and NFC chip programming.
 */
export function getBrandCanonicalUrl(slug: BrandSlug | string): string {
  const baseUrl = getPublicBaseUrl();
  const canonicalPath = getBrandCanonicalPath(slug);
  return baseUrl ? `${baseUrl}${canonicalPath}` : canonicalPath;
}
