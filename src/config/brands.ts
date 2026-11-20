import { BRAND_SEO } from './seoRoutes.mjs';

export type BrandSlug = 'atlas' | 'sovi' | 'bymarcos';

export interface BrandRegistryEntry {
  slug: BrandSlug;
  path: `/${BrandSlug}`;
  canonicalPath: `/${BrandSlug}`;
  name: string;
  tagline: string;
  title: string;
  description: string;
  defaultLang: 'en' | 'ar';
  supportedLangs: readonly ('en' | 'ar')[];
  defaultDir: 'ltr' | 'rtl';
  ogImagePath: string;
  ogType: string;
  category: string;
}

/**
 * Shared Brand Footer specification applied consistently across all Brand Pages
 * while allowing each page to render it in its own visual language.
 */
export const BRAND_FOOTER_CONFIG = {
  exploreLabel: 'Explore TAPP',
  explorePath: '/' as const,
  attributionText: 'Designed & Developed by Marwan M. Hammad',
} as const;

/**
 * Lightweight Brand Route Registry.
 * Registers independent Brand Pages by path slug (extensible for future brands
 * and future hostname mapping once a custom domain is attached).
 */
export const BRAND_REGISTRY: Record<BrandSlug, BrandRegistryEntry> = {
  atlas: {
    slug: 'atlas',
    path: '/atlas',
    canonicalPath: '/atlas',
    name: 'ATLAS',
    tagline: 'ARTIST / RAPPER / PRODUCER',
    title: BRAND_SEO.atlas.title,
    description: BRAND_SEO.atlas.description,
    defaultLang: BRAND_SEO.atlas.lang,
    supportedLangs: ['en'],
    defaultDir: BRAND_SEO.atlas.dir,
    ogImagePath: BRAND_SEO.atlas.ogImagePath,
    ogType: BRAND_SEO.atlas.ogType,
    category: 'Music Artist',
  },
  sovi: {
    slug: 'sovi',
    path: '/sovi',
    canonicalPath: '/sovi',
    name: 'SOVI',
    tagline: 'HANDMADE GOODS',
    title: BRAND_SEO.sovi.title,
    description: BRAND_SEO.sovi.description,
    defaultLang: BRAND_SEO.sovi.lang,
    supportedLangs: ['en'],
    defaultDir: BRAND_SEO.sovi.dir,
    ogImagePath: BRAND_SEO.sovi.ogImagePath,
    ogType: BRAND_SEO.sovi.ogType,
    category: 'Handmade Goods',
  },
  bymarcos: {
    slug: 'bymarcos',
    path: '/bymarcos',
    canonicalPath: '/bymarcos',
    name: 'BY MARCOS',
    tagline: 'THE RED FRAME COLLECTIVE',
    title: BRAND_SEO.bymarcos.title,
    description: BRAND_SEO.bymarcos.description,
    defaultLang: BRAND_SEO.bymarcos.lang,
    supportedLangs: ['en', 'ar'],
    defaultDir: BRAND_SEO.bymarcos.dir,
    ogImagePath: BRAND_SEO.bymarcos.ogImagePath,
    ogType: BRAND_SEO.bymarcos.ogType,
    category: 'Photography & Creative Direction',
  },
};

export const BRAND_SLUGS = Object.keys(BRAND_REGISTRY) as BrandSlug[];

export function getBrandBySlug(slug: string): BrandRegistryEntry | undefined {
  const normalized = slug.trim().toLowerCase().replace(/^\/+|\/+$/g, '') as BrandSlug;
  return BRAND_REGISTRY[normalized];
}

export function getBrandByPath(pathname: string): BrandRegistryEntry | undefined {
  const normalized = pathname.trim().toLowerCase().replace(/^\/+|\/+$/g, '');
  if (!normalized || normalized.includes('/')) return undefined;
  return getBrandBySlug(normalized);
}
