import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import { getCleanPath } from './router.ts';
import './index.css';

const rootEl = document.getElementById('root')!;
const prerenderedRoute = rootEl.getAttribute('data-route');
const currentRoute = getCleanPath();

if (rootEl.hasChildNodes() && prerenderedRoute === currentRoute) {
  hydrateRoot(rootEl, <App />);
} else {
  createRoot(rootEl).render(<App />);
}
