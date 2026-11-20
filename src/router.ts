import { useState, useEffect } from 'react';
import { BrandSlug, getBrandByPath, getBrandBySlug } from './config/brands';

export type RoutePath = '/' | '/not-found' | `/${BrandSlug}`;

/**
 * Pure route resolver from browser location parts.
 * Future custom-domain / subdomain support can plug in an optional hostname lookup
 * here without changing page components.
 */
export function resolveRoute(
  rawPathname: string,
  rawSearch: string,
  rawHash: string,
  _hostname?: string
): RoutePath {
  // 1. Strict direct URL pathname matching (trailing slashes normalized)
  const pathname = rawPathname.toLowerCase().replace(/\/+$/, '') || '/';

  if (pathname !== '/') {
    const matchedBrand = getBrandByPath(pathname);
    return matchedBrand ? matchedBrand.path : '/not-found';
  }

  // 2. Query parameter fallback on '/' (e.g. ?brand=atlas, ?b=sovi, ?p=/bymarcos) for embedded previews
  const params = new URLSearchParams(rawSearch);
  const rawBrandParam = params.get('brand') || params.get('b') || params.get('p') || '';
  const brandParam = rawBrandParam.toLowerCase().replace(/^\/+|\/+$/g, '');
  if (brandParam !== '') {
    const matchedQueryBrand = getBrandBySlug(brandParam);
    return matchedQueryBrand ? matchedQueryBrand.path : '/not-found';
  }

  // 3. Hash fallback on '/' (e.g. #/atlas, #atlas, #/bymarcos)
  const lowerHash = rawHash.toLowerCase();
  const cleanHash = lowerHash.replace(/^#\/?/, '').replace(/\/+$/, '');
  if (cleanHash !== '') {
    const matchedHashBrand = getBrandBySlug(cleanHash);
    if (matchedHashBrand) return matchedHashBrand.path;
    if (lowerHash.startsWith('#/')) return '/not-found';
  }

  return '/';
}

export function getCleanPath(): RoutePath {
  if (typeof window === 'undefined') return '/';

  return resolveRoute(
    window.location.pathname,
    window.location.search,
    window.location.hash,
    window.location.hostname
  );
}

export function navigate(path: RoutePath | string) {
  if (typeof window === 'undefined') return;

  const targetPath = path.startsWith('/') ? path : `/${path}`;
  try {
    window.history.pushState({}, '', targetPath);
  } catch {
    window.location.hash = targetPath;
  }

  // Scroll to top on navigation
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

  // Dispatch custom popstate event so all listeners re-render
  window.dispatchEvent(new Event('popstate'));
}

export function useCurrentRoute(): RoutePath {
  const [currentRoute, setCurrentRoute] = useState<RoutePath>(getCleanPath());

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentRoute(getCleanPath());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  return currentRoute;
}
