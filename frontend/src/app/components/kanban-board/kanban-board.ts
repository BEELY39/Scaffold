import { Component, input, output, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../models/ticket.model';
import { KanbanColumn } from '../kanban-column/kanban-column';

export type TicketStatus = 'todo' | 'in_progress' | 'code_review' | 'done';

export interface StatusChangeEvent {
  ticketId: number;
  newStatus: TicketStatus;
}

@Component({
  selector: 'app-kanban-board',
  imports: [CommonModule, KanbanColumn],
  template: `
    <div class="flex gap-4 overflow-x-auto pb-4">
      @for (column of columns(); track column.status) {
        <app-kanban-column
          [title]="column.title"
          [status]="column.status"
          [tickets]="column.tickets"
          [color]="column.color"
          (onAddTicket)="addTicket.emit($event)"
          (onTicketClick)="ticketClick.emit($event)"
          (onStatusChange)="statusChange.emit($event)"
        />
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KanbanBoard {
  tickets = input.required<Ticket[]>();

  addTicket = output<TicketStatus>();
  ticketClick = output<Ticket>();
  statusChange = output<StatusChangeEvent>();

  columns = computed(() => {
    const allTickets = this.tickets();
    return [
      {
        title: 'Backlog',
        status: 'todo' as TicketStatus,
        color: 'gray',
        tickets: allTickets.filter(t => t.status === 'todo')
      },
      {
        title: 'In Progress',
        status: 'in_progress' as TicketStatus,
        color: 'blue',
        tickets: allTickets.filter(t => t.status === 'in_progress')
      },
      {
        title: 'Code Review',
        status: 'code_review' as TicketStatus,
        color: 'yellow',
        tickets: allTickets.filter(t => t.status === 'code_review')
      },
      {
        title: 'Done',
        status: 'done' as TicketStatus,
        color: 'green',
        tickets: allTickets.filter(t => t.status === 'done')
      }
    ];
  });
}
