import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ProjectService } from '../../services/project.service';
import { TicketService } from '../../services/ticket.service';
import { PaymentService } from '../../services/payment.service';
import { Sidebar, Project as SidebarProject } from '../../components/sidebar/sidebar';
import { CreateProjectModal } from '../../components/create-project-modal/create-project-modal';
import { CookieConsentComponent } from '../../components/cookie-consent/cookie-consent';
import { Project, CreateProjectDto } from '../../models/project.model';
import { environment } from '../../../environments/environment';

interface UsageInfo {
  planType: string;
  used: number;
  limit: number;
  remaining: number;
  resetDate: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, Sidebar, CreateProjectModal, CookieConsentComponent],
  templateUrl: './dashboard.component.html',
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
  private ticketService = inject(TicketService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);
  private http = inject(HttpClient);

  projects = signal<Project[]>([]);
  isLoading = signal(true);
  isModalOpen = signal(false);
  isCreating = signal(false);

  // Usage/Plan limits
  usage = signal<UsageInfo | null>(null);
  showUpgradeModal = signal(false);

  // Stats - tu peux les calculer depuis les tickets plus tard
  totalTicketsDone = signal(0);
  totalTicketsInProgress = signal(0);
  totalHours = signal(0);

  // Sidebar projects
  sidebarProjects = signal<SidebarProject[]>([]);

  ngOnInit(): void {
    this.loadProjects();
    this.loadUsage();
  }

  loadUsage(): void {
    this.http.get<UsageInfo>(`${environment.apiBaseUrl}/usage`).subscribe({
      next: (data) => this.usage.set(data),
      error: () => {
        // En cas d'erreur, on met des valeurs par défaut
        this.usage.set({ planType: 'free', used: 0, limit: 2, remaining: 2, resetDate: '' });
      }
    });
  }

  loadProjects(): void {
    this.isLoading.set(true);
    this.projectService.getAll().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.sidebarProjects.set(projects.map(p => ({ id: p.id, name: p.name })));
        
        if (projects.length === 0) {
          // Si la liste est vide, on vérifie que l'utilisateur est bien connecté/chargé
          this.authService.loadUser();
          this.isLoading.set(false);
        } else {
          this.isLoading.set(false);
        }
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }



  generateTicketsForProject(projectId: number) {
    this.ticketService.generateTickets(projectId).subscribe({
      next: () => {
        // Reload projects to get the generated tickets
        this.loadProjects(); 
      },
      error: () => this.isLoading.set(false)
    });
  }

  openCreateModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  createProject(projectData: CreateProjectDto): void {
    this.isCreating.set(true);
    this.projectService.createWithTickets(projectData).subscribe({
      next: ({ project }) => {
        this.projects.update(current => [...current, project]);
        this.sidebarProjects.update(current => [...current, { id: project.id, name: project.name }]);
        this.closeModal();
        this.isCreating.set(false);
        // Rafraîchir l'usage après création
        this.loadUsage();
        this.router.navigate(['/projects', project.id]);
      },
      error: (err: HttpErrorResponse) => {
        this.isCreating.set(false);
        if (err.status === 402) {
          const resetDate = err.error?.usage?.resetDate
            ? new Date(err.error.usage.resetDate).toLocaleDateString('fr-FR')
            : 'bientôt';
          alert(`${err.error.message}\n\nProchaine réinitialisation: ${resetDate}`);
        } else {
          alert('Échec de la génération. Veuillez réessayer.');
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  openUpgradeModal(): void {
    this.showUpgradeModal.set(true);
  }

  closeUpgradeModal(): void {
    this.showUpgradeModal.set(false);
  }

  upgradeToPro(): void {
    this.paymentService.createCheckout().subscribe({
      next: ({ url }) => {
        window.location.href = url;
      },
      error: (err) => {
        alert(err.error?.message || 'Erreur lors de la redirection vers le paiement');
      },
    });
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
