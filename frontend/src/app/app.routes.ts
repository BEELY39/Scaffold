import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Landing page publique
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  // Dashboard (protégé)
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  // Login (redirige vers dashboard si déjà connecté)
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
    canActivate: [guestGuard],
  },
  // Détails projet (protégé)
  {
    path: 'projects/:id',
    loadComponent: () =>
      import('./pages/project-details/project-details').then((m) => m.ProjectDetails),
    canActivate: [authGuard],
  },
  // Callback OAuth
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./pages/auth-callback/auth-callback.component').then((m) => m.AuthCallbackComponent),
  },
  // Mentions légales
  {
    path: 'legal',
    loadComponent: () =>
      import('./pages/legal/legal').then((m) => m.Legal),
  },
  // Apprendre l'Agile (SEO)
  {
    path: 'apprendre',
    loadComponent: () =>
      import('./pages/learn/learn.component').then((m) => m.LearnComponent),
  },
  // Settings (protégé)
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.component').then((m) => m.SettingsComponent),
    canActivate: [authGuard],
  },
  // Fallback (doit être en dernier)
  {
    path: '**',
    redirectTo: '',
  },
];
