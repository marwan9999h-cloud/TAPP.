/** @type {import('./seoRoutes.d.ts').SeoEntry} */
export const HOME_SEO = {
  path: '/',
  canonicalPath: '/',
  title: 'TAPP — كل تفاصيل براندك في Tap واحدة',
  description:
    'TAPP — كارت NFC وQR ذكي يجمع كل تفاصيل وروابط براندك في صفحة واحدة.',
  lang: 'ar',
  dir: 'rtl',
  ogImagePath: '/og/tapp-og.png',
  ogType: 'website',
};

/** @type {import('./seoRoutes.d.ts').SeoEntry} */
export const NOT_FOUND_SEO = {
  path: '/not-found',
  canonicalPath: '/not-found',
  title: '404 — الصفحة غير موجودة | TAPP',
  description: 'الصفحة المطلوبة غير موجودة على منصة TAPP.',
  lang: 'ar',
  dir: 'rtl',
  ogImagePath: '/og/tapp-og.png',
  ogType: 'website',
  robots: 'noindex, nofollow',
};

/** @type {{ atlas: import('./seoRoutes.d.ts').BrandSeoEntry; sovi: import('./seoRoutes.d.ts').BrandSeoEntry; bymarcos: import('./seoRoutes.d.ts').BilingualBrandSeoEntry }} */
export const BRAND_SEO = {
  atlas: {
    slug: 'atlas',
    path: '/atlas',
    canonicalPath: '/atlas',
    title: 'ATLAS — Official Digital Card | TAPP',
    description:
      'Explore the music, streaming platforms, and official social channels of ATLAS — Artist, Rapper & Producer.',
    lang: 'en',
    dir: 'ltr',
    ogImagePath: '/og/atlas-og.png',
    ogType: 'profile',
  },
  sovi: {
    slug: 'sovi',
    path: '/sovi',
    canonicalPath: '/sovi',
    title: 'SOVI — Handmade Goods | TAPP',
    description:
      'Handmade pieces, made with love. Connect with SOVI on Instagram and WhatsApp Community.',
    lang: 'en',
    dir: 'ltr',
    ogImagePath: '/og/sovi-og.png',
    ogType: 'website',
  },
  bymarcos: {
    slug: 'bymarcos',
    path: '/bymarcos',
    canonicalPath: '/bymarcos',
    title: 'BY MARCOS — THE RED FRAME COLLECTIVE | TAPP',
    description:
      'Photography, editorial portraiture, and visual direction by BY MARCOS.',
    lang: 'en',
    dir: 'ltr',
    ogImagePath: '/og/bymarcos-og.png',
    ogType: 'website',
    localized: {
      en: {
        title: 'BY MARCOS — THE RED FRAME COLLECTIVE | TAPP',
        description:
          'Photography, editorial portraiture, and visual direction by BY MARCOS.',
        lang: 'en',
        dir: 'ltr',
      },
      ar: {
        title: 'BY MARCOS — THE RED FRAME COLLECTIVE | التصوير الفوتوغرافي والتأطير البصري',
        description:
          'تصوير فوتوغرافي، بورتريه تحريري، وإخراج بصري مقصود من BY MARCOS.',
        lang: 'ar',
        dir: 'rtl',
      },
    },
  },
};
