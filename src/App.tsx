import React from 'react';
import { RoutePath, useCurrentRoute } from './router';
import { BrandSlug, getBrandByPath } from './config/brands';
import { BRAND_SEO, HOME_SEO, NOT_FOUND_SEO } from './config/seoRoutes.mjs';
import { useDocumentMeta, DocumentMetaInput } from './hooks/useDocumentMeta';
import { HomePage } from './pages/HomePage';
import { AtlasPage } from './pages/AtlasPage';
import { SoviPage } from './pages/SoviPage';
import { ByMarcosPage } from './pages/ByMarcosPage';
import { GuidePage } from './pages/GuidePage';
import { NotFoundPage } from './pages/NotFoundPage';

const BRAND_PAGES: Record<BrandSlug, React.ComponentType> = {
  atlas: AtlasPage,
  sovi: SoviPage,
  bymarcos: ByMarcosPage,
};

interface AppProps {
  initialRoute?: RoutePath;
}

export default function App({ initialRoute }: AppProps = {}) {
  const currentRoute = useCurrentRoute(initialRoute);
  const brandEntry = getBrandByPath(currentRoute);

  let routeMeta: DocumentMetaInput | null = null;
  if (currentRoute === '/not-found') {
    routeMeta = NOT_FOUND_SEO;
  } else if (currentRoute === '/guide') {
    // GuidePage manages bilingual AR/EN document metadata dynamically
    routeMeta = null;
  } else if (brandEntry) {
    // BY MARCOS manages metadata synchronization inside ByMarcosPage
    if (brandEntry.slug !== 'bymarcos') {
      const seoEntry = BRAND_SEO[brandEntry.slug];
      routeMeta = {
        title: seoEntry.title,
        description: seoEntry.description,
        canonicalPath: seoEntry.canonicalPath,
        lang: seoEntry.lang,
        dir: seoEntry.dir,
        ogLocale: seoEntry.ogLocale,
        ogImagePath: seoEntry.ogImagePath,
        ogImageAlt: seoEntry.ogImageAlt,
        ogType: seoEntry.ogType,
      };
    }
  } else {
    routeMeta = HOME_SEO;
  }

  useDocumentMeta(routeMeta);

  if (currentRoute === '/not-found') {
    return <NotFoundPage />;
  }

  if (currentRoute === '/guide') {
    return <GuidePage />;
  }

  if (brandEntry) {
    const BrandPage = BRAND_PAGES[brandEntry.slug];
    return <BrandPage />;
  }

  // Default route: TAPP Homepage Showcase
  return <HomePage />;
}
