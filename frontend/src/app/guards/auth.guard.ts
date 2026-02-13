import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth';

/**
 * Guard pour les pages protégées (dashboard, projects)
 * Redirige vers /login si non connecté
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AuthService);
  const router = inject(Router);

  // Côté serveur (SSR), on laisse passer pour le rendu initial
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // Mode dev: bypass l'authentification
  if (environment.bypassAuth) {
    return true;
  }

  // Utilisateur connecté → accès autorisé
  if (authService.isAuthenticated()) {
    return true;
  }

  // Non connecté → redirection vers login avec returnUrl
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

/**
 * Guard pour la page login
 * Redirige vers / si déjà connecté
 */
export const guestGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AuthService);
  const router = inject(Router);

  // Côté serveur (SSR), on laisse passer
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // Non connecté → accès autorisé à la page login
  if (!authService.isAuthenticated()) {
    return true;
  }

  // Déjà connecté → redirection vers dashboard
  return router.createUrlTree(['/dashboard']);
};
