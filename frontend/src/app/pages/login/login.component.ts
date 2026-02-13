import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Toggle login/register
  isRegisterMode = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  // Form fields
  fullName = '';
  email = '';
  password = '';
  passwordConfirmation = '';
  rememberMe = false;

  toggleMode(): void {
    this.isRegisterMode.update((v) => !v);
    this.errorMessage.set('');
    // Reset fields
    this.fullName = '';
    this.email = '';
    this.password = '';
    this.passwordConfirmation = '';
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);

    if (this.isRegisterMode()) {
      this.register();
    } else {
      this.login();
    }
  }

  login(): void {
    this.authService.emailLogin(this.email, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('auth_token', res.token);
        this.authService.loadUser();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Erreur de connexion');
      },
    });
  }

  register(): void {
    if (this.password !== this.passwordConfirmation) {
      this.errorMessage.set('Les mots de passe ne correspondent pas');
      this.isLoading.set(false);
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage.set('Le mot de passe doit contenir au moins 8 caractères');
      this.isLoading.set(false);
      return;
    }

    this.authService
      .register(this.fullName, this.email, this.password, this.passwordConfirmation)
      .subscribe({
        next: (res) => {
          localStorage.setItem('auth_token', res.token);
          this.authService.loadUser();
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || "Erreur lors de l'inscription");
        },
      });
  }

  googleLogin(): void {
    this.authService.googleLogin();
  }
}
