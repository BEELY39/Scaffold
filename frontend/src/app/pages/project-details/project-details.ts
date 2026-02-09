import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { KanbanBoard, StatusChangeEvent, TicketStatus } from '../../components/kanban-board/kanban-board';
import { CreateTicketModal } from '../../components/create-ticket-modal/create-ticket-modal';
import { Sidebar, Project as SidebarProject } from '../../components/sidebar/sidebar';
import { AiGenerator, AiGeneratorInput } from '../../components/ai-generator/ai-generator';
import { Ticket, CreateTicketDto } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth';

interface Activity {
  id: number;
  userName: string;
  userInitials: string;
  action: string;
  target: string;
  time: string;
}

@Component({
  selector: 'app-project-details',
  imports: [CommonModule, KanbanBoard, CreateTicketModal, Sidebar, AiGenerator],
  templateUrl: './project-details.html',
  styles: ``,
})
export class ProjectDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ticketService = inject(TicketService);
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);

  projectId = signal<number>(0);
  projectName = signal<string>('My Project');
  isModalOpen = signal(false);
  isLoading = signal(true);
  isGenerating = signal(false);
  tickets = signal<Ticket[]>([]);
  defaultStatus = signal<TicketStatus>('todo');

  // Sidebar projects from API
  sidebarProjects = signal<SidebarProject[]>([]);

  // Recent activity - tu peux connecter ça à un ActivityService plus tard
  recentActivity = signal<Activity[]>([]);

  // Stats calculées
  stats = computed(() => {
    const all = this.tickets();
    const total = all.length;
    const todo = all.filter((t) => t.status === 'todo').length;
    const inProgress = all.filter((t) => t.status === 'in_progress').length;
    const codeReview = all.filter((t) => t.status === 'code_review').length;
    const done = all.filter((t) => t.status === 'done').length;

    const totalHours = all.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);
    const doneHours = all
      .filter((t) => t.status === 'done')
      .reduce((acc, t) => acc + (t.estimatedHours || 0), 0);

    const progress = total > 0 ? Math.round((done / total) * 100) : 0;

    return { total, todo, inProgress, codeReview, done, totalHours, doneHours, progress };
  });

  // Pourcentages pour le graphique
  chartData = computed(() => {
    const s = this.stats();
    const total = s.total || 1;
    return {
      todoPercent: (s.todo / total) * 100,
      inProgressPercent: (s.inProgress / total) * 100,
      codeReviewPercent: (s.codeReview / total) * 100,
      donePercent: (s.done / total) * 100,
    };
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectId.set(+id);
      this.loadProject();
      this.loadProjects();
      this.loadTickets();
    }
  }

  loadProject(): void {
    this.projectService.getById(this.projectId()).subscribe({
      next: (project) => {
        this.projectName.set(project.name);
      },
    });
  }

  loadProjects(): void {
    this.projectService.getAll().subscribe({
      next: (projects) => {
        this.sidebarProjects.set(projects.map(p => ({ id: p.id, name: p.name })));
      },
    });
  }

  loadTickets(): void {
    this.isLoading.set(true);
    this.ticketService.getByProject(this.projectId()).subscribe({
      next: (tickets) => {
        this.tickets.set(tickets);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  // AI Generation - à implémenter avec ton backend
  handleAiGenerate(input: AiGeneratorInput): void {
    this.isGenerating.set(true);
    // TODO: Appelle ton service backend avec les inputs
    // this.ticketService.generateWithAi(this.projectId(), input).subscribe(...)
    console.log('AI Generation input:', input);

    // Pour l'instant, on simule avec generateTickets
    this.ticketService.generateTickets(this.projectId()).subscribe({
      next: (newTickets) => {
        this.tickets.update((current) => [...current, ...newTickets]);
        this.isGenerating.set(false);
      },
      error: () => {
        this.isGenerating.set(false);
      },
    });
  }

  openModal(): void {
    this.defaultStatus.set('todo');
    this.isModalOpen.set(true);
  }

  openModalWithStatus(status: TicketStatus): void {
    this.defaultStatus.set(status);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  openTicketDetails(ticket: Ticket): void {
    // TODO: Ouvrir un modal de détails ou naviguer vers une page de détails
    console.log('Open ticket details:', ticket);
  }

  createTicket(ticketData: CreateTicketDto): void {
    const ticket: CreateTicketDto = {
      ...ticketData,
      projectId: this.projectId(),
    };

    this.ticketService.create(ticket).subscribe({
      next: (newTicket) => {
        this.tickets.update((current) => [...current, newTicket]);
        this.closeModal();
      },
    });
  }

  updateTicketStatus(event: StatusChangeEvent): void {
    this.ticketService.update(event.ticketId, { status: event.newStatus }).subscribe({
      next: (updatedTicket) => {
        this.tickets.update((current) =>
          current.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
        );
      },
    });
  }

  deleteTicket(ticketId: number): void {
    this.ticketService.delete(ticketId).subscribe({
      next: () => {
        this.tickets.update((current) => current.filter((t) => t.id !== ticketId));
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
