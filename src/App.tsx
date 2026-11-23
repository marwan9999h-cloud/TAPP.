import React, { Suspense, lazy } from 'react';
import { LazyMotion, domAnimation } from 'motion/react';
import { RoutePath, useCurrentRoute } from './router';
import { getBrandByPath } from './config/brands';
import { BRAND_SEO, HOME_SEO, NOT_FOUND_SEO } from './config/seoRoutes.mjs';
import { useDocumentMeta, DocumentMetaInput } from './hooks/useDocumentMeta';
import { loadPageModule, PageComponentMap } from './routes/routePages';

const LAZY_PAGES: Record<RoutePath, React.LazyExoticComponent<React.ComponentType>> = {
  '/': lazy(() => loadPageModule('/')),
  '/guide': lazy(() => loadPageModule('/guide')),
  '/atlas': lazy(() => loadPageModule('/atlas')),
  '/sovi': lazy(() => loadPageModule('/sovi')),
  '/bymarcos': lazy(() => loadPageModule('/bymarcos')),
  '/not-found': lazy(() => loadPageModule('/not-found')),
};

interface AppProps {
  initialRoute?: RoutePath;
  preloadedPages?: PageComponentMap;
}

export default function App({ initialRoute, preloadedPages }: AppProps = {}) {
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

  const PreloadedPage = preloadedPages?.[currentRoute];
  const LazyPage = LAZY_PAGES[currentRoute] ?? LAZY_PAGES['/'];

  return (
    <LazyMotion features={domAnimation} strict>
      {PreloadedPage ? (
        <PreloadedPage />
      ) : (
        <Suspense fallback={<div className="min-h-screen" />}>
          <LazyPage />
        </Suspense>
      )}
    </LazyMotion>
  );
}
