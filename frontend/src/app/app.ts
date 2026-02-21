import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PosthogService } from './services/posthog.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private posthog = inject(PosthogService);
  protected readonly title = signal('frontend');
}
