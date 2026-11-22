export interface SeoEntry {
  path: string;
  canonicalPath: string;
  title: string;
  description: string;
  lang: 'en' | 'ar';
  dir: 'ltr' | 'rtl';
  ogLocale: string;
  ogImagePath: string;
  ogImageAlt: string;
  ogType: string;
  lastmod?: string;
  robots?: string;
}

export interface BilingualSeoEntry extends SeoEntry {
  localized: Record<
    'en' | 'ar',
    {
      title: string;
      description: string;
      lang: 'en' | 'ar';
      dir: 'ltr' | 'rtl';
      ogLocale: string;
      ogImageAlt: string;
    }
  >;
}

export interface BilingualBrandSeoEntry extends BilingualSeoEntry {
  slug: 'bymarcos';
}

export interface BrandSeoEntry extends SeoEntry {
  slug: 'atlas' | 'sovi';
}

export declare const HOME_SEO: SeoEntry;
export declare const NOT_FOUND_SEO: SeoEntry;
export declare const GUIDE_SEO: BilingualSeoEntry;
export declare const BRAND_SEO: {
  atlas: BrandSeoEntry;
  sovi: BrandSeoEntry;
  bymarcos: BilingualBrandSeoEntry;
};
