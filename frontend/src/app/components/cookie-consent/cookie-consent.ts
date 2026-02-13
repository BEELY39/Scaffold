import { Component, inject } from '@angular/core';
import { CookieConsent as CookieConsentService } from '../../services/cookie-consent';

@Component({
  selector: 'app-cookie-consent',
  imports: [],
  template: `
    @if (!cookieService.hasAnswered()) {
      <div class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg">
        <div class="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800">Cookies et confidentialité</h3>
              <p class="text-sm text-gray-600">
                Nous utilisons des cookies pour garder votre session active et améliorer votre expérience.
                En acceptant, vous restez connecté entre vos visites.
              </p>
            </div>
          </div>
          <div class="flex gap-3 shrink-0">
            <button
              (click)="decline()"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Refuser
            </button>
            <button
              (click)="accept()"
              class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: ``,
})
export class CookieConsentComponent {
  cookieService = inject(CookieConsentService);

  accept(): void {
    this.cookieService.accept();
  }

  decline(): void {
    this.cookieService.decline();
  }
}
