import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CookieConsent {
  private readonly CONSENT_KEY = 'cookie_consent';
  private readonly platformId = inject(PLATFORM_ID);

  hasConsent = signal<boolean | null>(null);

  constructor() {
    if (this.isBrowser()) {
      const consent = localStorage.getItem(this.CONSENT_KEY);
      this.hasConsent.set(consent === 'true' ? true : consent === 'false' ? false : null);
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  accept(): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.CONSENT_KEY, 'true');
      this.hasConsent.set(true);
    }
  }

  decline(): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.CONSENT_KEY, 'false');
      this.hasConsent.set(false);
    }
  }

  hasAnswered(): boolean {
    return this.hasConsent() !== null;
  }

  isAccepted(): boolean {
    return this.hasConsent() === true;
  }
}
