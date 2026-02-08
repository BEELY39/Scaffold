import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../models/ticket.model';
import { TicketCard } from '../ticket-card/ticket-card';

@Component({
  selector: 'app-ticket-list',
  imports: [CommonModule, TicketCard],
  templateUrl: './ticket-list.html',
  styles: [`
    :host {
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketList {
  tickets = input.required<Ticket[]>();
  loading = input<boolean>(false);
}
