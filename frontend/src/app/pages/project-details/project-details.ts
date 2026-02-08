import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TicketList } from '../../components/ticket-list/ticket-list';
import { CreateTicketModal } from '../../components/create-ticket-modal/create-ticket-modal';
import { Ticket, CreateTicketDto } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-project-details',
  imports: [CommonModule, TicketList, CreateTicketModal],
  templateUrl: './project-details.html',
  styles: ``,
})
export class ProjectDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private ticketService = inject(TicketService);

  projectId = signal<number>(0);
  isModalOpen = signal(false);
  isLoading = signal(true);
  isGenerating = signal(false);
  tickets = signal<Ticket[]>([]);

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
      this.loadTickets();
    }
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

  generateTickets(): void {
    this.isGenerating.set(true);
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
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
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

  updateTicketStatus(event: { ticketId: number; status: Ticket['status'] }): void {
    this.ticketService.update(event.ticketId, { status: event.status }).subscribe({
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
}
