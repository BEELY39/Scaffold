import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface User {
  id: number;
  fullName: string;
  email: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly RETURN_URL_KEY = 'return_url';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  user = signal<User | null>(null);
  isReady = signal(false);

  constructor() {
    // Charge l'utilisateur au démarrage si un token existe (côté browser uniquement)
    if (this.isBrowser()) {
      if (this.getToken()) {
        this.loadUser();
      } else {
        this.isReady.set(true);
      }
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private readonly isBrowserCheck = () => isPlatformBrowser(this.platformId);


  /**
   * Redirige vers Google OAuth
   */
  googleLogin(returnUrl?: string): void {
    if (this.isBrowser()) {
      if (returnUrl) {
        localStorage.setItem(this.RETURN_URL_KEY, returnUrl);
      }
      window.location.href = `${environment.apiUrl}/auth/google`;
    }
  }

  /**
   * Gère le callback après authentification Google
   */
  handleCallback(token: string, returnUrl: string = '/dashboard'): void {
    this.saveToken(token);
    // Charger le user puis rediriger
    this.http.get<User>(`${environment.apiUrl}/api/auth/me`).subscribe({
      next: (user) => {
        this.user.set(user);
        this.router.navigate([returnUrl]);
      },
      error: () => {
        this.clearToken();
        this.user.set(null);
        this.router.navigate(['/login']);
      },
    });
  }

  /**
   * Charge les infos utilisateur depuis l'API
   */
  loadUser(): void {
    if (!this.isBrowser() || !this.getToken()) {
      this.isReady.set(true);
      return;
    }
    this.http.get<User>(`${environment.apiUrl}/api/auth/me`).subscribe({
      next: (user) => {
        this.user.set(user);
        this.isReady.set(true);
      },
      error: () => {
        this.clearToken();
        this.user.set(null);
        this.isReady.set(true);
      },
    });
  }

  /**
   * Déconnexion
   */
  logout(): void {
    this.http.post(`${environment.apiUrl}/api/auth/logout`, {}).subscribe({
      next: () => {
        this.clearToken();
        this.user.set(null);
        this.router.navigate(['/login']);
      },
      error: () => {
        this.clearToken();
        this.user.set(null);
        this.router.navigate(['/login']);
      },
    });
  }

  /**
   * Récupère le token du localStorage
   */
  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Sauvegarde le token dans localStorage
   */
  private saveToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /**
   * Supprime le token du localStorage
   */
  private clearToken(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  /**
   * Vérifie si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Récupère et nettoie l'URL de retour stockée
   */
  getAndClearReturnUrl(): string | null {
    if (!this.isBrowser()) return null;
    const url = localStorage.getItem(this.RETURN_URL_KEY);
    localStorage.removeItem(this.RETURN_URL_KEY);
    return url;
  }

  /**
   * Inscription par email/password
   */
  register(
    fullName: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(
      `${environment.apiUrl}/auth/register`,
      { fullName, email, password, passwordConfirmation }
    );
  }

  /**
   * Connexion par email/password
   */
  emailLogin(email: string, password: string): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(
      `${environment.apiUrl}/auth/login`,
      { email, password }
    );
  }
}
