import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-kanban-card',
  imports: [CommonModule],
  template: `
    <div
      class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
      draggable="true"
      (dragstart)="handleDragStart($event)"
      (click)="onClick.emit()"
    >
      <!-- Priority Badge -->
      <div class="flex items-center gap-2 mb-2">
        <span
          class="text-[10px] px-2 py-0.5 rounded font-semibold uppercase"
          [class.bg-green-100]="ticket().priority === 'low'"
          [class.text-green-700]="ticket().priority === 'low'"
          [class.bg-yellow-100]="ticket().priority === 'medium'"
          [class.text-yellow-700]="ticket().priority === 'medium'"
          [class.bg-orange-100]="ticket().priority === 'high'"
          [class.text-orange-700]="ticket().priority === 'high'"
          [class.bg-red-100]="ticket().priority === 'critical'"
          [class.text-red-700]="ticket().priority === 'critical'"
        >
          {{ ticket().priority }}
        </span>
        <span
          class="text-[10px] px-2 py-0.5 rounded font-semibold uppercase bg-indigo-100 text-indigo-700"
        >
          {{ ticket().type }}
        </span>
      </div>

      <!-- Title -->
      <h4 class="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
        {{ ticket().title }}
      </h4>

      <!-- Description -->
      @if (ticket().description) {
        <p class="text-xs text-gray-500 mb-3 line-clamp-2">
          {{ ticket().description }}
        </p>
      }

      <!-- Meta -->
      <div class="flex items-center justify-between text-xs text-gray-400">
        <span class="font-mono">#{{ ticket().id }}</span>
        <div class="flex items-center gap-3">
          @if (ticket().complexity) {
            <span class="flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              {{ ticket().complexity }}
            </span>
          }
          @if (ticket().estimatedHours) {
            <span class="flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ ticket().estimatedHours }}h
            </span>
          }
        </div>
      </div>

      <!-- Date -->
      <div class="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
        {{ formatDate(ticket().createdAt) }}
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `],
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
