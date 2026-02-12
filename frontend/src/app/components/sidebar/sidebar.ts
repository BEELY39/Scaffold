import { Component, input, output, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';

export interface Project {
  id: number;
  name: string;
  icon?: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styles: [`
    :host {
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidebar {
  authService = inject(AuthService);

  workspaceName = input<string>('My Workspace');
  projects = input<Project[]>([]);

  onLogout = output<void>();
  onProjectSelect = output<number>();

  projectsExpanded = true;

  toggleProjects(): void {
    this.projectsExpanded = !this.projectsExpanded;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
