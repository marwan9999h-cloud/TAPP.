import type { BrandSlug } from '../config/brands';

/**
 * Normalizes a route path:
 * - Ensures leading slash
 * - Collapses duplicate slashes
 * - Strips trailing slashes (except root '/')
 * - Lowercases path
 */
export function normalizePath(path: string): string {
  const collapsed = path.trim().toLowerCase().replace(/\/{2,}/g, '/');
  if (!collapsed || collapsed === '/') return '/';
  const withLeading = collapsed.startsWith('/') ? collapsed : `/${collapsed}`;
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

function normalizeBaseOrigin(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed || isDisallowedPublicBase(trimmed)) return '';

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return '';
    }
    const cleanPath = parsed.pathname.replace(/\/{2,}/g, '/').replace(/\/+$/, '');
    return `${parsed.origin}${cleanPath}`;
  } catch {
    return '';
  }
}

export const OFFICIAL_SITE_URL = 'https://tapp-link.vercel.app';

/**
 * Resolves the public origin for canonical links, NFC destinations, and QR codes.
 * Prefers a valid non-preview VITE_PUBLIC_SITE_URL; otherwise uses OFFICIAL_SITE_URL
 * so QR codes, copied links, and shared URLs never leak localhost or editor preview origins.
 */
export function getPublicBaseUrl(): string {
  const env = (import.meta as { env?: Record<string, string | undefined> }).env;
  const configuredBase = env?.VITE_PUBLIC_SITE_URL;
  if (typeof configuredBase === 'string' && configuredBase.trim() !== '') {
    const normalized = normalizeBaseOrigin(configuredBase);
    if (normalized) return normalized;
  }

  return OFFICIAL_SITE_URL;
}

/**
 * Returns the canonical path for a registered Brand Page (e.g. '/atlas') or root '/'.
 */
export function getBrandCanonicalPath(slug: BrandSlug | string): string {
  const cleanSlug = slug
    .trim()
    .toLowerCase()
    .replace(/\/{2,}/g, '/')
    .replace(/^\/+|\/+$/g, '');
  return cleanSlug ? `/${cleanSlug}` : '/';
}

/**
 * Returns a canonical absolute URL for any public TAPP route path ('/', '/atlas', etc.).
 */
export function getCanonicalUrl(routePath = '/'): string {
  const baseUrl = getPublicBaseUrl();
  const cleanPath = normalizePath(routePath);
  if (!baseUrl) return cleanPath;
  return cleanPath === '/' ? `${baseUrl}/` : `${baseUrl}${cleanPath}`;
}

/**
 * Resolves an absolute URL for a public static asset path (e.g. '/og/tapp-og.png').
 */
export function getAbsoluteAssetUrl(assetPath: string): string {
  const baseUrl = getPublicBaseUrl();
  const cleanAsset = `/${assetPath.trim().replace(/\/{2,}/g, '/').replace(/^\/+/, '')}`;
  return baseUrl ? `${baseUrl}${cleanAsset}` : cleanAsset;
}

/**
 * Returns the canonical absolute URL for a Brand Page (or root when slug is empty).
 * Used identically for QR generation, URL copying, and NFC chip programming.
 */
export function getBrandCanonicalUrl(slug: BrandSlug | string): string {
  return getCanonicalUrl(getBrandCanonicalPath(slug));
}
