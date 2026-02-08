import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Ticket, CreateTicketDto } from '../models/ticket.model';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private readonly apiUrl = `${environment.apiUrl}/api/tickets`;
  private readonly projectsUrl = `${environment.apiUrl}/api/projects`;

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
}
