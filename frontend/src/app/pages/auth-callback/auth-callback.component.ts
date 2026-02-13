import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  templateUrl: './auth-callback.component.html',
})
export class AuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.route.snapshot.queryParamMap.get('token');
      // Retrieve returnUrl from AuthService (localStorage) or query params, default to dashboard
      const returnUrl = this.authService.getAndClearReturnUrl() || this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';

      if (token) {
        this.authService.handleCallback(token, returnUrl);
      } else {
        // Pas de token, redirige vers login
        this.router.navigate(['/login']);
      }
    }
  }
}
