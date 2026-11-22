import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import type { RoutePath } from './router';

export function renderRouteBodyHtml(routePath: RoutePath): string {
  return renderToString(<App initialRoute={routePath} />);
}
