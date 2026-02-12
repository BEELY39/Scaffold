import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expiré ou invalide
        // On évite de boucler si on est déjà sur la page de login ou si la requête vient de l'auth
        if (!req.url.includes('/auth/login') && !router.url.includes('/login')) {
             authService.logout(); // This clears token and redirects
        }
      }
      return throwError(() => error);
    })
  );
};
