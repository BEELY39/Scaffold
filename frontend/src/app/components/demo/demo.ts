import { Component, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-demo',
  imports: [],
  templateUrl: './demo.html',
  styles: ``,
})
export class Demo {
  showModal = signal(false);
  videoUrl = signal<SafeResourceUrl | null>(null);

  constructor(private sanitizer: DomSanitizer) {
    this.setVideoUrl('https://jumpshare.com/embed/V1L6kVNTkY3P4BKHsHzp');
  }

  setVideoUrl(url: string) {
    this.videoUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
  }

  openModal() {
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }
}
