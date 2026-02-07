import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
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
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  user = signal<User | null>(null);

  constructor() {
    // Charge l'utilisateur au démarrage si un token existe (côté browser uniquement)
    if (this.isBrowser() && this.getToken()) {
      this.loadUser();
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Redirige vers Google OAuth
   */
  googleLogin(): void {
    if (this.isBrowser()) {
      window.location.href = `${environment.apiUrl}/auth/google`;
    }
  }

  /**
   * Gère le callback après authentification Google
   */
  handleCallback(token: string): void {
    this.saveToken(token);
    this.loadUser();
    this.router.navigate(['/']);
  }

  /**
   * Charge les infos utilisateur depuis l'API
   */
  loadUser(): void {
    this.http.get<User>(`${environment.apiUrl}/api/auth/me`).subscribe({
      next: (user) => this.user.set(user),
      error: () => {
        this.clearToken();
        this.user.set(null);
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
}
