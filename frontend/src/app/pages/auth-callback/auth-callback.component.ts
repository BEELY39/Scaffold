import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gray-900 flex items-center justify-center">
      <div class="text-center">
        <!-- Spinner -->
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-blue-500 mb-4"></div>
        <p class="text-gray-400">Connexion en cours...</p>
      </div>
    </div>
  `,
})
export class AuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.authService.handleCallback(token);
    } else {
      // Pas de token, redirige vers login
      this.router.navigate(['/login']);
    }
  }
}
