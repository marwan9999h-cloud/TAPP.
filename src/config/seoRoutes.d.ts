export interface SeoEntry {
  path: string;
  canonicalPath: string;
  title: string;
  description: string;
  lang: 'en' | 'ar';
  dir: 'ltr' | 'rtl';
  ogImagePath: string;
  ogType: string;
  robots?: string;
}

export interface BilingualBrandSeoEntry extends SeoEntry {
  slug: 'bymarcos';
  localized: Record<
    'en' | 'ar',
    {
      title: string;
      description: string;
      lang: 'en' | 'ar';
      dir: 'ltr' | 'rtl';
    }
  >;
}

export interface BrandSeoEntry extends SeoEntry {
  slug: 'atlas' | 'sovi';
}

export declare const HOME_SEO: SeoEntry;
export declare const NOT_FOUND_SEO: SeoEntry;
export declare const BRAND_SEO: {
  atlas: BrandSeoEntry;
  sovi: BrandSeoEntry;
  bymarcos: BilingualBrandSeoEntry;
};
