import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import { getCleanPath } from './router.ts';
import { preloadPageForRoute } from './routes/routePages.ts';
import './index.css';

const rootEl = document.getElementById('root')!;
const prerenderedRoute = rootEl.getAttribute('data-route');
const currentRoute = getCleanPath();

preloadPageForRoute(currentRoute).then((preloadedPages) => {
  const app = <App preloadedPages={preloadedPages} />;
  if (rootEl.hasChildNodes() && prerenderedRoute === currentRoute) {
    hydrateRoot(rootEl, app);
  } else {
    createRoot(rootEl).render(app);
  }
});
