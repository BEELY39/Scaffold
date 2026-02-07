import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gray-900 text-white">
      <!-- Header -->
      <header class="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-blue-400">Scaffold</h1>

          @if (authService.user()) {
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-3">
                @if (authService.user()?.avatar) {
                  <img
                    [src]="authService.user()?.avatar"
                    alt="Avatar"
                    class="w-8 h-8 rounded-full"
                  />
                }
                <span class="text-gray-300">{{ authService.user()?.fullName }}</span>
              </div>
              <button
                (click)="logout()"
                class="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Déconnexion
              </button>
            </div>
          } @else {
            <button
              (click)="goToLogin()"
              class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              Connexion
            </button>
          }
        </div>
      </header>

      <!-- Main content -->
      <main class="p-6">
        @if (authService.user()) {
          <h2 class="text-xl font-semibold mb-4">Bienvenue, {{ authService.user()?.fullName }} !</h2>
          <p class="text-gray-400">Votre dashboard sera bientôt disponible ici.</p>
        } @else {
          <div class="text-center py-12">
            <p class="text-gray-400 mb-4">Connectez-vous pour accéder à votre dashboard</p>
            <button
              (click)="goToLogin()"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              Se connecter
            </button>
          </div>
        }
      </main>
    </div>
  `,
})
export class DashboardComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
