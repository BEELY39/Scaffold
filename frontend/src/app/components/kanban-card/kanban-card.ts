import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-kanban-card',
  imports: [CommonModule],
  templateUrl: './kanban-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KanbanCard {
  ticket = input.required<Ticket>();
  onClick = output<void>();
  onDragStart = output<number>();

  handleDragStart(event: DragEvent): void {
    event.dataTransfer?.setData('ticketId', this.ticket().id.toString());
    this.onDragStart.emit(this.ticket().id);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
