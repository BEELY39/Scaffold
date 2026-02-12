import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../models/ticket.model';
import { KanbanCard } from '../kanban-card/kanban-card';
import { TicketStatus, StatusChangeEvent } from '../kanban-board/kanban-board';

@Component({
  selector: 'app-kanban-column',
  imports: [CommonModule, KanbanCard],
  templateUrl: './kanban-column.html',
  styles: [`
    :host {
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KanbanColumn {
  title = input.required<string>();
  status = input.required<TicketStatus>();
  tickets = input.required<Ticket[]>();
  color = input<string>('gray');

  onAddTicket = output<TicketStatus>();
  onTicketClick = output<Ticket>();
  onStatusChange = output<StatusChangeEvent>();

  private draggedTicketId: number | null = null;

  handleDragStart(ticketId: number): void {
    this.draggedTicketId = ticketId;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const ticketId = event.dataTransfer?.getData('ticketId');
    if (ticketId) {
      this.onStatusChange.emit({
        ticketId: parseInt(ticketId, 10),
        newStatus: this.status()
      });
    }
  }
}
