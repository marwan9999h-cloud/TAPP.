import type React from 'react';
import type { RoutePath } from '../router';

export type PageComponentMap = Partial<Record<RoutePath, React.ComponentType>>;

export function loadPageModule(route: RoutePath): Promise<{ default: React.ComponentType }> {
  switch (route) {
    case '/guide':
      return import('../pages/GuidePage').then((m) => ({ default: m.GuidePage }));
    case '/atlas':
      return import('../pages/AtlasPage').then((m) => ({ default: m.AtlasPage }));
    case '/sovi':
      return import('../pages/SoviPage').then((m) => ({ default: m.SoviPage }));
    case '/bymarcos':
      return import('../pages/ByMarcosPage').then((m) => ({ default: m.ByMarcosPage }));
    case '/not-found':
      return import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }));
    case '/':
    default:
      return import('../pages/HomePage').then((m) => ({ default: m.HomePage }));
  }
}

export async function preloadPageForRoute(route: RoutePath): Promise<PageComponentMap> {
  const mod = await loadPageModule(route);
  return { [route]: mod.default };
}
