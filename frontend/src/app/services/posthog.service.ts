import { Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import posthog from 'posthog-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PosthogService {
  private ngZone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);
  private initialized = false;

  constructor() {
    this.initPostHog();
  }

  private initPostHog() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.initialized) return;

    this.ngZone.runOutsideAngular(() => {
      posthog.init(environment.posthogKey, {
        api_host: environment.posthogHost,
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: true,
      });
    });

    this.initialized = true;
  }

  capture(event: string, properties?: Record<string, any>) {
    if (!isPlatformBrowser(this.platformId)) return;
    posthog.capture(event, properties);
  }

  identify(userId: string, properties?: Record<string, any>) {
    if (!isPlatformBrowser(this.platformId)) return;
    posthog.identify(userId, properties);
  }

  reset() {
    if (!isPlatformBrowser(this.platformId)) return;
    posthog.reset();
  }
}
