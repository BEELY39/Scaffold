import { Component, EventEmitter, Input, Output, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Ticket } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-detail-modal',
  imports: [CommonModule],
  templateUrl: './ticket-detail-modal.html',
  styleUrl: './ticket-detail-modal.css',
})
export class TicketDetailModal implements OnInit {
  @Input({ required: true }) ticket!: Ticket;
  @Output() close = new EventEmitter<void>();
  @Output() statusChange = new EventEmitter<{ ticketId: number; newStatus: Ticket['status'] }>();
  @Output() ticketEnriched = new EventEmitter<Ticket>();

  private ticketService = inject(TicketService);
  private platformId = inject(PLATFORM_ID);

  isEnriching = signal(false);
  enrichError = signal<string | null>(null);
  checkedCriteria = signal<Set<number>>(new Set());

  statuses: Ticket['status'][] = ['todo', 'in_progress', 'code_review', 'done'];

  ngOnInit(): void {
    this.loadCheckedCriteria();
    this.checkAndEnrich();
  }

  // localStorage keys
  private getCheckedKey(): string {
    return `ticket_${this.ticket.id}_checked_criteria`;
  }

  private getEnrichmentKey(): string {
    return `ticket_${this.ticket.id}_enrichment`;
  }

  // Charger les critères cochés depuis localStorage
  private loadCheckedCriteria(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const stored = localStorage.getItem(this.getCheckedKey());
    if (stored) {
      try {
        const indices = JSON.parse(stored) as number[];
        this.checkedCriteria.set(new Set(indices));
      } catch {
        this.checkedCriteria.set(new Set());
      }
    }
  }

  // Sauvegarder les critères cochés dans localStorage
  private saveCheckedCriteria(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const indices = Array.from(this.checkedCriteria());
    localStorage.setItem(this.getCheckedKey(), JSON.stringify(indices));
  }

  // Charger l'enrichissement depuis localStorage
  private loadEnrichmentFromCache(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    const stored = localStorage.getItem(this.getEnrichmentKey());
    if (stored) {
      try {
        const data = JSON.parse(stored) as {
          technicalSpecs: string[];
          acceptanceCriteria: string[];
        };
        if (data.technicalSpecs?.length && data.acceptanceCriteria?.length) {
          this.ticket.technicalSpecs = data.technicalSpecs;
          this.ticket.acceptanceCriteria = data.acceptanceCriteria;
          return true;
        }
      } catch {
        return false;
      }
    }
    return false;
  }

  // Sauvegarder l'enrichissement dans localStorage
  private saveEnrichmentToCache(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const data = {
      technicalSpecs: this.ticket.technicalSpecs,
      acceptanceCriteria: this.ticket.acceptanceCriteria,
    };
    localStorage.setItem(this.getEnrichmentKey(), JSON.stringify(data));
  }

  // Toggle un critère d'acceptation
  toggleCriteria(index: number): void {
    const current = this.checkedCriteria();
    const updated = new Set(current);

    if (updated.has(index)) {
      updated.delete(index);
    } else {
      updated.add(index);
    }

    this.checkedCriteria.set(updated);
    this.saveCheckedCriteria();
  }

  // Vérifier si un critère est coché
  isCriteriaChecked(index: number): boolean {
    return this.checkedCriteria().has(index);
  }

  // Compter les critères cochés
  getCheckedCount(): number {
    return this.checkedCriteria().size;
  }

  // Total des critères
  getTotalCriteria(): number {
    return this.ticket.acceptanceCriteria?.length || 0;
  }

  private checkAndEnrich(): void {
    // 1. Vérifier si déjà enrichi (depuis l'API)
    if (this.ticket.technicalSpecs?.length && this.ticket.acceptanceCriteria?.length) {
      return;
    }

    // 2. Essayer de charger depuis le cache localStorage
    if (this.loadEnrichmentFromCache()) {
      return;
    }

    // 3. Sinon, appeler l'API pour enrichir
    this.isEnriching.set(true);
    this.enrichError.set(null);

    this.ticketService.enrichTicket(this.ticket.id).subscribe({
      next: (enrichedTicket) => {
        // Mettre à jour le ticket local
        this.ticket.technicalSpecs = enrichedTicket.technicalSpecs;
        this.ticket.acceptanceCriteria = enrichedTicket.acceptanceCriteria;
        this.isEnriching.set(false);

        // Sauvegarder dans localStorage pour la prochaine fois
        this.saveEnrichmentToCache();

        // Notifier le parent pour MAJ de la liste
        this.ticketEnriched.emit(enrichedTicket);
      },
      error: () => {
        this.enrichError.set('Impossible de charger les détails');
        this.isEnriching.set(false);
      },
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('backdrop')) {
      this.close.emit();
    }
  }

  changeStatus(status: Ticket['status']): void {
    this.statusChange.emit({ ticketId: this.ticket.id, newStatus: status });
  }

  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      feature: 'bg-blue-100 text-blue-800',
      bug: 'bg-red-100 text-red-800',
      chore: 'bg-gray-100 text-gray-800',
      spike: 'bg-purple-100 text-purple-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  }

  getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      todo: 'bg-gray-100 text-gray-800 border-gray-300',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
      code_review: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      done: 'bg-green-100 text-green-800 border-green-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      todo: 'To Do',
      in_progress: 'In Progress',
      code_review: 'Code Review',
      done: 'Done',
    };
    return labels[status] || status;
  }

  getComplexityStars(complexity: number): string {
    return '★'.repeat(complexity) + '☆'.repeat(5 - complexity);
  }
}
