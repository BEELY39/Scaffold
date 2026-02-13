import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);

  /**
   * Crée une session Stripe Checkout pour passer au plan Pro
   */
  createCheckout(): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(
      `${environment.apiBaseUrl}/payments/create-checkout`,
      {}
    );
  }

  /**
   * Annule l'abonnement Pro
   */
  cancelSubscription(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${environment.apiBaseUrl}/payments/cancel`,
      {}
    );
  }

  /**
   * Récupère l'URL du portail client Stripe pour gérer l'abonnement
   */
  getPortalUrl(): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(
      `${environment.apiBaseUrl}/payments/portal`
    );
  }
}
