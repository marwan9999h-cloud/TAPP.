import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { HomePage } from './pages/HomePage';
import { GuidePage } from './pages/GuidePage';
import { AtlasPage } from './pages/AtlasPage';
import { SoviPage } from './pages/SoviPage';
import { ByMarcosPage } from './pages/ByMarcosPage';
import { NotFoundPage } from './pages/NotFoundPage';
import type { PageComponentMap } from './routes/routePages';
import type { RoutePath } from './router';

const SSR_PAGES: PageComponentMap = {
  '/': HomePage,
  '/guide': GuidePage,
  '/atlas': AtlasPage,
  '/sovi': SoviPage,
  '/bymarcos': ByMarcosPage,
  '/not-found': NotFoundPage,
};

export function renderRouteBodyHtml(routePath: RoutePath): string {
  return renderToString(<App initialRoute={routePath} preloadedPages={SSR_PAGES} />);
}
