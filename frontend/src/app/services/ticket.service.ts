import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Ticket, CreateTicketDto } from '../models/ticket.model';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private readonly apiUrl = `${environment.apiUrl}/api/tickets`;
  private readonly projectsUrl = `${environment.apiUrl}/api/projects`;
  private readonly platformId = inject(PLATFORM_ID);

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  getById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  getByProject(projectId: number): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.projectsUrl}/${projectId}/tickets`);
  }

  create(ticket: CreateTicketDto): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticket);
  }

  update(id: number, ticket: Partial<Ticket>): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}`, ticket);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  generateTickets(projectId: number): Observable<Ticket[]> {
    return this.http.post<Ticket[]>(`${this.projectsUrl}/${projectId}/generate-tickets`, {});
  }

  /**
   * Enrichit un ticket avec les détails techniques (lazy loading)
   * Appelé quand l'utilisateur ouvre un ticket pour la première fois
   */
  enrichTicket(ticketId: number): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/${ticketId}/enrich`, {});
  }

  /**
   * Exporte les tickets au format CSV compatible Jira
   */
  exportTicketsForJira(tickets: Ticket[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!tickets.length) {
      alert('Aucun ticket à exporter.');
      return;
    }

    const csvContent = this.generateJiraCsv(tickets);
    this.downloadFile(csvContent, `jira_import_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv;charset=utf-8;');
  }

  /**
   * Génère le CSV au format Jira (colonnes en français pour Jira FR)
   * Colonnes: Résumé, Description, Type de ticket, Priorité, Story Points, Étiquettes
   */
  private generateJiraCsv(tickets: Ticket[]): string {
    const headers = ['Résumé', 'Description', 'Type de ticket', 'Priorité', 'Story Points', 'Étiquettes'];

    const rows = tickets.map((t) => [
      this.escapeCsvField(t.title),
      this.escapeCsvField(this.buildJiraDescription(t)),
      this.mapTypeToJira(t.type),
      this.mapPriorityToJira(t.priority),
      t.complexity || '',
      t.type, // Label = type original (feature, chore, etc.)
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  /**
   * Construit la description Jira avec user story, specs, critères d'acceptation
   */
  private buildJiraDescription(ticket: Ticket): string {
    const parts: string[] = [];

    if (ticket.description) {
      parts.push(ticket.description);
    }

    if (ticket.userStory) {
      parts.push(`\n\n*User Story:*\n${ticket.userStory}`);
    }

    if (ticket.technicalSpecs?.length) {
      parts.push(`\n\n*Technical Specs:*\n${ticket.technicalSpecs.map((s) => `- ${s}`).join('\n')}`);
    }

    if (ticket.acceptanceCriteria?.length) {
      parts.push(`\n\n*Acceptance Criteria:*\n${ticket.acceptanceCriteria.map((c) => `- ${c}`).join('\n')}`);
    }

    if (ticket.estimatedHours) {
      parts.push(`\n\n*Estimated Hours:* ${ticket.estimatedHours}h`);
    }

    if (ticket.notes) {
      parts.push(`\n\n*Notes:*\n${ticket.notes}`);
    }

    return parts.join('');
  }

  /**
   * Mappe le type Scaffold vers le type Jira
   */
  private mapTypeToJira(type: Ticket['type']): string {
    const mapping: Record<Ticket['type'], string> = {
      feature: 'Story',
      bug: 'Bug',
      chore: 'Task',
      spike: 'Task',
    };
    return mapping[type] || 'Task';
  }

  /**
   * Mappe la priorité Scaffold vers la priorité Jira
   */
  private mapPriorityToJira(priority: Ticket['priority']): string {
    const mapping: Record<Ticket['priority'], string> = {
      critical: 'Highest',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
    };
    return mapping[priority] || 'Medium';
  }

  /**
   * Échappe les champs CSV (guillemets, retours à la ligne)
   */
  private escapeCsvField(value: string | null | undefined): string {
    if (!value) return '""';
    const escaped = value.replace(/"/g, '""');
    return `"${escaped}"`;
  }

  /**
   * Télécharge un fichier côté client uniquement
   */
  private downloadFile(content: string, filename: string, mimeType: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
