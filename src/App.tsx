import React from 'react';
import { useCurrentRoute } from './router';
import { BrandSlug, getBrandByPath } from './config/brands';
import { HOME_SEO, NOT_FOUND_SEO } from './config/seoRoutes.mjs';
import { useDocumentMeta, DocumentMetaInput } from './hooks/useDocumentMeta';
import { HomePage } from './pages/HomePage';
import { AtlasPage } from './pages/AtlasPage';
import { SoviPage } from './pages/SoviPage';
import { ByMarcosPage } from './pages/ByMarcosPage';
import { NotFoundPage } from './pages/NotFoundPage';

const BRAND_PAGES: Record<BrandSlug, React.ComponentType> = {
  atlas: AtlasPage,
  sovi: SoviPage,
  bymarcos: ByMarcosPage,
};

export default function App() {
  const currentRoute = useCurrentRoute();
  const brandEntry = getBrandByPath(currentRoute);

  let routeMeta: DocumentMetaInput | null = null;
  if (currentRoute === '/not-found') {
    routeMeta = NOT_FOUND_SEO;
  } else if (brandEntry) {
    // BY MARCOS manages bilingual EN/AR metadata synchronization inside ByMarcosPage
    if (brandEntry.slug !== 'bymarcos') {
      routeMeta = {
        title: brandEntry.title,
        description: brandEntry.description,
        canonicalPath: brandEntry.canonicalPath,
        lang: brandEntry.defaultLang,
        dir: brandEntry.defaultDir,
        ogImagePath: brandEntry.ogImagePath,
        ogType: brandEntry.ogType,
      };
    }
  } else {
    routeMeta = HOME_SEO;
  }

  useDocumentMeta(routeMeta);

  if (currentRoute === '/not-found') {
    return <NotFoundPage />;
  }

  if (brandEntry) {
    const BrandPage = BRAND_PAGES[brandEntry.slug];
    return <BrandPage />;
  }

  // Default route: TAPP Homepage Showcase
  return <HomePage />;
}
