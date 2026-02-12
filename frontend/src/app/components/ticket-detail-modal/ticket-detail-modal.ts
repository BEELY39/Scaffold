import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-detail-modal',
  imports: [CommonModule],
  templateUrl: './ticket-detail-modal.html',
  styleUrl: './ticket-detail-modal.css',
})
export class TicketDetailModal {
  @Input({ required: true }) ticket!: Ticket;
  @Output() close = new EventEmitter<void>();
  @Output() statusChange = new EventEmitter<{ ticketId: number; newStatus: Ticket['status'] }>();

  statuses: Ticket['status'][] = ['todo', 'in_progress', 'code_review', 'done'];

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
