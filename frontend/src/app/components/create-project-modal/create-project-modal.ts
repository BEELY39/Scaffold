import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CreateProjectDto } from '../../models/project.model';

interface TechOption {
  id: string;
  name: string;
  logo: SafeHtml;
}

@Component({
  selector: 'app-create-project-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-project-modal.html',
  styleUrl: './create-project-modal.css',
})
export class CreateProjectModal {
  @Input() isLoading = false;
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<CreateProjectDto>();

  projectName = '';
  projectDescription = '';
  hasBackend = false;
  selectedFrontend: string | null = 'react';
  selectedBackend: string | null = null;
  selectedDatabase: string | null = null;

  frontendTechs: TechOption[];
  backendTechs: TechOption[];
  databaseTechs: TechOption[];

  constructor(private sanitizer: DomSanitizer) {
    this.frontendTechs = [
      {
        id: 'react',
        name: 'React',
        logo: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" class="w-8 h-8" fill="#61DAFB"><path d="M12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/><path fill="none" stroke="#61DAFB" stroke-width="1" d="M12 21c5.523 0 10-4.477 10-10S17.523 1 12 1 2 5.477 2 11s4.477 10 10 10Z" opacity="0"/><ellipse cx="12" cy="12" fill="none" stroke="#61DAFB" stroke-width="1.5" rx="10" ry="4"/><ellipse cx="12" cy="12" fill="none" stroke="#61DAFB" stroke-width="1.5" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" fill="none" stroke="#61DAFB" stroke-width="1.5" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>`)
      },
      {
        id: 'angular',
        name: 'Angular',
        logo: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" class="w-8 h-8" fill="#DD0031"><path d="M12 2L2 7l1.5 12L12 22l8.5-3L22 7l-10-5zm0 2.2l6.9 3.45-.6 4.85H12v5l-5.4-2.7.3-2.3H12V9.5H6.7l-.3-2.3L12 4.2z"/></svg>`)
      },
      {
        id: 'vue',
        name: 'Vue.js',
        logo: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" class="w-8 h-8"><path fill="#41B883" d="M2 3h3.5L12 13.5 18.5 3H24L12 22 0 3h2zm2.5 0L12 14l7.5-11h-3L12 9.5 7.5 3h-3z"/><path fill="#35495E" d="M7.5 3L12 9.5 16.5 3h-3L12 5.5 10.5 3h-3z"/></svg>`)
      },
      {
        id: 'nextjs',
        name: 'Next.js',
        logo: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" class="w-8 h-8" fill="#000"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.5 14.5v-9l7 9h-2l-5-6.5v6.5h-1.5v-9h1.5v9h-1.5z"/></svg>`)
      },
      {
        id: 'svelte',
        name: 'Svelte',
        logo: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" class="w-8 h-8" fill="#FF3E00"><path d="M20.5 5.5c-2-3.5-6.5-4.5-10-2.5l-5 3c-1.5 1-2.5 2.5-2.5 4.5 0 1 .5 2 1 3-.5.5-1 1.5-1 2.5 0 1.5.5 3 1.5 4 2 3.5 6.5 4.5 10 2.5l5-3c1.5-1 2.5-2.5 2.5-4.5 0-1-.5-2-1-3 .5-.5 1-1.5 1-2.5 0-1.5-.5-3-1.5-4z"/></svg>`)
      },
      {
        id: 'nuxt',
        name: 'Nuxt',
        logo: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" class="w-8 h-8" fill="#00DC82"><path d="M13.4 20.5H4.6c-.8 0-1.5-.4-1.9-1.1-.4-.7-.4-1.5 0-2.2l4.4-7.6c.4-.7 1.1-1.1 1.9-1.1s1.5.4 1.9 1.1l4.4 7.6c.4.7.4 1.5 0 2.2-.4.7-1.1 1.1-1.9 1.1zm5-5.5l-3-5.2 3-5.2c.4-.7 1.1-1.1 1.9-1.1.8 0 1.5.4 1.9 1.1l3 5.2-3 5.2c-.4.7-1.1 1.1-1.9 1.1-.8 0-1.5-.4-1.9-1.1z"/></svg>`)
      },
    ];

    this.backendTechs = [
      {
        id: 'nodejs',
        name: 'Node.js',
        logo: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" class="w-8 h-8" fill="#339933"><path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 18.5L4 16V8.5l8 4v8zm0-9.5L4 7.5 12 4l8 3.5-8 3.5zm8 5L12 20v-8l8-4v7.5z"/></svg>`)
      },
      {
        id: 'adonisjs',
        name: 'AdonisJS',
        logo: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" class="w-8 h-8" fill="#5A45FF"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`)
      },
      {
        id: 'nestjs',
        name: 'NestJS',
        logo: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" class="w-8 h-8" fill="#E0234E"><path d="M14.13 2c-.34 0-.68.05-1 .14a3.23 3.23 0 0 0-2.05 1.53c-.37-.22-.79-.36-1.22-.43a3.5 3.5 0 0 0-3.72 2.3c-.6.15-1.16.45-1.62.88A3.5 3.5 0 0 0 3.5 10.5c0 .57.13 1.11.38 1.6a3.5 3.5 0 0 0 .74 4.65c-.1.32-.16.67-.16 1.03a3.5 3.5 0 0 0 3.5 3.5c.36 0 .71-.06 1.03-.16a3.5 3.5 0 0 0 4.65.74c.49.25 1.03.38 1.6.38a3.5 3.5 0 0 0 3.5-3.5c0-.36-.06-.71-.16-1.03a3.5 3.5 0 0 0 .74-4.65c.25-.49.38-1.03.38-1.6a3.5 3.5 0 0 0-1.02-2.48 3.5 3.5 0 0 0-3.72-2.3 3.5 3.5 0 0 0-1.22.43A3.23 3.23 0 0 0 14.13 2z"/></svg>`)
      },
      {
        id: 'express',
        name: 'Express',
        logo: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" class="w-8 h-8" fill="#000"><path d="M24 18.5v-1h-3.5v-2H24v-1h-4.5v5H24v-1zm-5.5 0v-5H17v5h1.5zm-3-5h-1.5v3l-2-3h-1.5v5h1.5v-3l2 3h1.5v-5zm-6 0H8v5h1.5v-2h1c1.1 0 2-.9 2-1.5s-.9-1.5-2-1.5zm0 2h-1v-1h1c.3 0 .5.2.5.5s-.2.5-.5.5zM6 18.5v-1H2.5v-.75H6v-1H2.5V15H6v-1H1v5h5v-1H2.5v-.5H6z"/></svg>`)
      },
      {
        id: 'django',
        name: 'Django',
        logo: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" class="w-8 h-8" fill="#092E20"><path d="M7 2v20H5V2h2zm7 0v1.5h-1.5V5H14v2h-1.5v8.5c0 2.5-1 3.5-3.5 3.5H7v-2h2c1 0 1.5-.5 1.5-1.5V7H9V5h1.5V3.5H9V2h5zm5 0v13.5c0 3-1.5 4.5-4 4.5h-1v-2h.5c1.5 0 2.5-.5 2.5-2.5V2h2z"/></svg>`)
      },
      {
        id: 'fastapi',
        name: 'FastAPI',
        logo: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" class="w-8 h-8" fill="#009688"><path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5"/></svg>`)
      },
    ];

    this.databaseTechs = [
      {
        id: 'postgresql',
        name: 'PostgreSQL',
        logo: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" class="w-8 h-8" fill="#336791"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>`)
      },
      {
        id: 'mysql',
        name: 'MySQL',
        logo: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" class="w-8 h-8" fill="#4479A1"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M8 12h8v1H8zm0-3h8v1H8zm0 6h8v1H8z"/></svg>`)
      },
      {
        id: 'mongodb',
        name: 'MongoDB',
        logo: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" class="w-8 h-8" fill="#47A248"><path d="M12 2C8 2 6 6 6 10s2 8 6 10c4-2 6-6 6-10S16 2 12 2zm0 17c-2-1.5-4-4.5-4-9 0-4 1.5-6.5 4-7.5 2.5 1 4 3.5 4 7.5 0 4.5-2 7.5-4 9z"/></svg>`)
      },
      {
        id: 'redis',
        name: 'Redis',
        logo: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" class="w-8 h-8" fill="#DC382D"><path d="M12 4L4 8l8 4 8-4-8-4zm-8 8l8 4 8-4M4 16l8 4 8-4"/></svg>`)
      },
      {
        id: 'sqlite',
        name: 'SQLite',
        logo: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" class="w-8 h-8" fill="#003B57"><path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm6 14l-6 3-6-3V8l6-3 6 3v8z"/></svg>`)
      },
      {
        id: 'supabase',
        name: 'Supabase',
        logo: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" class="w-8 h-8" fill="#3ECF8E"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 15l-6-3.5v-7L12 10l6-3.5v7L12 17z"/></svg>`)
      },
    ];
  }

  toggleFrontend(id: string): void {
    this.selectedFrontend = this.selectedFrontend === id ? null : id;
  }

  toggleBackend(id: string): void {
    this.selectedBackend = this.selectedBackend === id ? null : id;
  }

  toggleDatabase(id: string): void {
    this.selectedDatabase = this.selectedDatabase === id ? null : id;
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.close.emit();
    }
  }

  onSubmit(): void {
    if (!this.projectName.trim() || !this.selectedFrontend) return;

    const techStack: string[] = [];
    if (this.selectedFrontend) {
      const frontend = this.frontendTechs.find(t => t.id === this.selectedFrontend);
      if (frontend) techStack.push(frontend.name);
    }

    const backendStack: string[] = [];
    if (this.hasBackend) {
      if (this.selectedBackend) {
        const backend = this.backendTechs.find(t => t.id === this.selectedBackend);
        if (backend) backendStack.push(backend.name);
      }
      if (this.selectedDatabase) {
        const database = this.databaseTechs.find(t => t.id === this.selectedDatabase);
        if (database) backendStack.push(database.name);
      }
    }

    const project: CreateProjectDto = {
      name: this.projectName.trim(),
      description: this.projectDescription.trim() || undefined,
      techStack: techStack.length > 0 ? techStack : undefined,
      hasBackend: this.hasBackend,
      backendStack: backendStack.length > 0 ? backendStack : undefined,
    };

    this.create.emit(project);
  }
}
