import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket.service';
import { ThemeService, Theme } from '../../services/theme.service';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  private ticketService = inject(TicketService);
  themeService = inject(ThemeService);

  activeTab = signal<'general' | 'export'>('general');
  isExporting = signal(false);

  setActiveTab(tab: 'general' | 'export') {
    this.activeTab.set(tab);
  }

  setTheme(theme: Theme) {
    this.themeService.setTheme(theme);
  }

  exportTickets() {
    this.isExporting.set(true);
    this.ticketService.getAll().subscribe({
      next: (tickets) => {
        this.ticketService.exportTicketsForJira(tickets);
        this.isExporting.set(false);
      },
      error: () => {
        this.isExporting.set(false);
        alert('Erreur lors de la récupération des tickets.');
      },
    });
  }
}
