import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { ProjectService } from '../../services/project.service';
import { Sidebar, Project as SidebarProject } from '../../components/sidebar/sidebar';
import { Project, CreateProjectDto } from '../../models/project.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Sidebar],
  template: `
    <div class="flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <app-sidebar
        [projects]="sidebarProjects()"
        (onLogout)="logout()"
      />

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top Header -->
        <header class="bg-white border-b border-gray-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p class="text-gray-500 text-sm">Welcome back, {{ authService.user()?.fullName }}</p>
            </div>

            <button
              (click)="openCreateModal()"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              New Project
            </button>
          </div>
        </header>

        <!-- Main Area -->
        <main class="flex-1 p-6 overflow-y-auto">
          @if (isLoading()) {
            <div class="flex justify-center py-12">
              <div class="inline-block w-8 h-8 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
          } @else {
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div class="bg-white rounded-xl p-6 border border-gray-200">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-2xl font-bold text-gray-800">{{ projects().length }}</p>
                    <p class="text-sm text-gray-500">Total Projects</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl p-6 border border-gray-200">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-2xl font-bold text-gray-800">{{ totalTicketsDone() }}</p>
                    <p class="text-sm text-gray-500">Tickets Done</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl p-6 border border-gray-200">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-2xl font-bold text-gray-800">{{ totalTicketsInProgress() }}</p>
                    <p class="text-sm text-gray-500">In Progress</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl p-6 border border-gray-200">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-2xl font-bold text-gray-800">{{ totalHours() }}h</p>
                    <p class="text-sm text-gray-500">Total Hours</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Projects Grid -->
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Your Projects</h2>

            @if (projects().length === 0) {
              <div class="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-800 mb-2">No projects yet</h3>
                <p class="text-gray-500 mb-4">Create your first project to get started</p>
                <button
                  (click)="openCreateModal()"
                  class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                  Create Project
                </button>
              </div>
            } @else {
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @for (project of projects(); track project.id) {
                  <a
                    [routerLink]="['/projects', project.id]"
                    class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer group"
                  >
                    <div class="flex items-start justify-between mb-4">
                      <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span class="text-white font-bold text-lg">{{ getProjectInitials(project.name) }}</span>
                      </div>
                      <span class="text-xs text-gray-400">{{ formatDate(project.createdAt) }}</span>
                    </div>

                    <h3 class="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                      {{ project.name }}
                    </h3>

                    @if (project.description) {
                      <p class="text-sm text-gray-500 mb-4 line-clamp-2">{{ project.description }}</p>
                    }

                    @if (project.techStack && project.techStack.length > 0) {
                      <div class="flex flex-wrap gap-2">
                        @for (tech of project.techStack.slice(0, 3); track tech) {
                          <span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{{ tech }}</span>
                        }
                        @if (project.techStack.length > 3) {
                          <span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">+{{ project.techStack.length - 3 }}</span>
                        }
                      </div>
                    }
                  </a>
                }
              </div>
            }
          }
        </main>
      </div>
    </div>

    <!-- Create Project Modal -->
    @if (isModalOpen()) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl w-full max-w-md p-6 m-4">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-800">Create New Project</h2>
            <button
              (click)="closeModal()"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
              <input
                type="text"
                [(ngModel)]="newProject.name"
                placeholder="e.g., E-commerce Platform"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                [(ngModel)]="newProject.description"
                rows="3"
                placeholder="Describe your project..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tech Stack (comma separated)</label>
              <input
                type="text"
                [(ngModel)]="techStackInput"
                placeholder="e.g., Angular, Node.js, PostgreSQL"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div class="flex gap-3 pt-4">
              <button
                (click)="closeModal()"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                (click)="createProject()"
                [disabled]="!newProject.name.trim()"
                class="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  private projectService = inject(ProjectService);
  private router = inject(Router);

  projects = signal<Project[]>([]);
  isLoading = signal(true);
  isModalOpen = signal(false);

  // Stats - tu peux les calculer depuis les tickets plus tard
  totalTicketsDone = signal(0);
  totalTicketsInProgress = signal(0);
  totalHours = signal(0);

  // Form
  newProject: CreateProjectDto = { name: '', description: '' };
  techStackInput = '';

  // Sidebar projects
  sidebarProjects = signal<SidebarProject[]>([]);

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading.set(true);
    this.projectService.getAll().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.sidebarProjects.set(projects.map(p => ({ id: p.id, name: p.name })));
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  openCreateModal(): void {
    this.newProject = { name: '', description: '' };
    this.techStackInput = '';
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  createProject(): void {
    if (!this.newProject.name.trim()) return;

    const projectData: CreateProjectDto = {
      name: this.newProject.name.trim(),
      description: this.newProject.description?.trim() || undefined,
      techStack: this.techStackInput
        ? this.techStackInput.split(',').map(t => t.trim()).filter(t => t)
        : undefined,
    };

    this.projectService.create(projectData).subscribe({
      next: (project) => {
        this.projects.update(current => [...current, project]);
        this.sidebarProjects.update(current => [...current, { id: project.id, name: project.name }]);
        this.closeModal();
        // Naviguer vers le nouveau projet
        this.router.navigate(['/projects', project.id]);
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }

  getProjectInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
}
