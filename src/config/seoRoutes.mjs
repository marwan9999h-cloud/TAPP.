/** @type {import('./seoRoutes.d.ts').SeoEntry} */
export const HOME_SEO = {
  path: '/',
  canonicalPath: '/',
  title: 'TAPP — كل تفاصيل براندك في Tap واحدة',
  description:
    'TAPP — كارت NFC وQR ذكي يجمع كل تفاصيل وروابط براندك في صفحة واحدة.',
  lang: 'ar',
  dir: 'rtl',
  ogLocale: 'ar_EG',
  ogImagePath: '/og/tapp-og.png',
  ogImageAlt: 'TAPP — كارت NFC وQR ذكي يجمع تفاصيل وروابط براندك في صفحة واحدة',
  ogType: 'website',
  // Update this date only when Homepage content meaningfully changes
  lastmod: '2026-11-22',
};

/** @type {import('./seoRoutes.d.ts').SeoEntry} */
export const NOT_FOUND_SEO = {
  path: '/not-found',
  canonicalPath: '/not-found',
  title: '404 — الصفحة غير موجودة | TAPP',
  description: 'الصفحة المطلوبة غير موجودة على منصة TAPP.',
  lang: 'ar',
  dir: 'rtl',
  ogLocale: 'ar_EG',
  ogImagePath: '/og/tapp-og.png',
  ogImageAlt: 'TAPP — الصفحة غير موجودة',
  ogType: 'website',
  robots: 'noindex, nofollow',
};

/** @type {import('./seoRoutes.d.ts').BilingualSeoEntry} */
export const GUIDE_SEO = {
  path: '/guide',
  canonicalPath: '/guide',
  title: 'دليل الاستخدام والأسئلة الشائعة | TAPP Guide & FAQ',
  description:
    'اعرف إزاي تستخدم كروت TAPP بالـ NFC والـ QR Code وإجراءات الصفحة الذكية وحفظ جهة الاتصال بالعربي والإنجليزي.',
  lang: 'ar',
  dir: 'rtl',
  ogLocale: 'ar_EG',
  ogImagePath: '/og/tapp-og.png',
  ogImageAlt: 'دليل استخدام TAPP والأسئلة الشائعة لكروت NFC وQR',
  ogType: 'website',
  // Update this date only when /guide content meaningfully changes
  lastmod: '2026-11-22',
  localized: {
    ar: {
      title: 'دليل الاستخدام والأسئلة الشائعة | TAPP Guide & FAQ',
      description:
        'اعرف إزاي تستخدم كروت TAPP بالـ NFC والـ QR Code وإجراءات الصفحة الذكية وحفظ جهة الاتصال.',
      lang: 'ar',
      dir: 'rtl',
      ogLocale: 'ar_EG',
      ogImageAlt: 'دليل استخدام TAPP والأسئلة الشائعة لكروت NFC وQR',
    },
    en: {
      title: 'TAPP Quick Guide & FAQ — How NFC & QR Cards Work',
      description:
        'Learn how to open TAPP smart brand pages using NFC or QR codes, use page actions, and download vCard contact files.',
      lang: 'en',
      dir: 'ltr',
      ogLocale: 'en_GB',
      ogImageAlt: 'TAPP Quick Guide & FAQ for NFC and QR Smart Brand Pages',
    },
  },
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
    ogLocale: 'en_GB',
    ogImagePath: '/og/atlas-og.png',
    ogImageAlt: 'ATLAS official TAPP digital card with streaming and social links',
    ogType: 'profile',
    // Update this date only when /atlas content meaningfully changes
    lastmod: '2026-11-22',
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
    ogLocale: 'en_GB',
    ogImagePath: '/og/sovi-og.png',
    ogImageAlt: 'SOVI Handmade Goods digital card featuring Instagram and WhatsApp Community',
    ogType: 'website',
    // Update this date only when /sovi content meaningfully changes
    lastmod: '2026-11-22',
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
    ogLocale: 'en_GB',
    ogImagePath: '/og/bymarcos-og.png',
    ogImageAlt: 'BY MARCOS — THE RED FRAME COLLECTIVE creative studio card in Alexandria, Egypt',
    ogType: 'website',
    // Update this date only when /bymarcos content meaningfully changes
    lastmod: '2026-11-22',
    localized: {
      en: {
        title: 'BY MARCOS — THE RED FRAME COLLECTIVE | TAPP',
        description:
          'Photography, editorial portraiture, and visual direction by BY MARCOS.',
        lang: 'en',
        dir: 'ltr',
        ogLocale: 'en_GB',
        ogImageAlt: 'BY MARCOS — THE RED FRAME COLLECTIVE creative studio card in Alexandria, Egypt',
      },
      ar: {
        title: 'BY MARCOS — THE RED FRAME COLLECTIVE | التصوير الفوتوغرافي والتأطير البصري',
        description:
          'تصوير فوتوغرافي، بورتريه تحريري، وإخراج بصري مقصود من BY MARCOS.',
        lang: 'ar',
        dir: 'rtl',
        ogLocale: 'ar_EG',
        ogImageAlt: 'BY MARCOS — THE RED FRAME COLLECTIVE استوديو تصوير وإخراج بصري بالإسكندرية',
      },
    },
  },
};
