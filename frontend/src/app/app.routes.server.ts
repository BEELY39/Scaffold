import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Routes qui font des appels API - render côté client uniquement
  {
    path: 'dashboard',
    renderMode: RenderMode.Client
  },
  {
    path: 'projects/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'auth/callback',
    renderMode: RenderMode.Client
  },
  // Routes statiques - peuvent être prerendered
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'legal',
    renderMode: RenderMode.Prerender
  },
  // Fallback pour toutes les autres routes
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
