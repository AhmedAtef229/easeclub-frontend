import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../appconfig';
import { 
  Event, 
  EventStatus, 
  EventAccessType, 
  CreateEventCommand, 
  CreateTicketCommand, 
  TicketType,
  EventRegistration
} from '../../../features/admin/events/events.model';

export interface UnifiedPaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ClubEventStatusCountsDto {
  total: number;
  published: number;
  draft: number;
  cancelled: number;
}

export interface EventStatsDto {
  totalCapacity: number;
  totalSold: number;
  totalAvailable: number;
  details: { [key: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private baseUrl = `${AppConfig.ProdApi}/events`;

  constructor(private http: HttpClient) {}

  /* ================= EVENTS ================= */

  getClubEvents(
    clubId: string,
    filters?: {
      search?: string;
      status?: EventStatus;
      page?: number;
      limit?: number;
    }
  ): Observable<UnifiedPaginatedResponse<Event>> {
    let params = new HttpParams();
    
    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    if (filters?.page) {
      params = params.set('PageNumber', filters.page.toString());
    }
    if (filters?.limit) {
      params = params.set('PageSize', filters.limit.toString());
    }

    return this.http.get<UnifiedPaginatedResponse<Event>>(
      `${this.baseUrl}/club/${clubId}`,
      { params }
    );
  }

  getUpcomingEvents(
    clubId: string,
    filters?: {
      search?: string;
      page?: number;
      limit?: number;
    }
  ): Observable<UnifiedPaginatedResponse<Event>> {
    let params = new HttpParams();
    
    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    if (filters?.page) {
      params = params.set('PageNumber', filters.page.toString());
    }
    if (filters?.limit) {
      params = params.set('PageSize', filters.limit.toString());
    }

    return this.http.get<UnifiedPaginatedResponse<Event>>(
      `${this.baseUrl}/club/${clubId}/upcoming`,
      { params }
    );
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}/${id}`);
  }

  getStatusCounts(clubId: string): Observable<ClubEventStatusCountsDto> {
    return this.http.get<ClubEventStatusCountsDto>(`${this.baseUrl}/club/${clubId}/status-counts`);
  }

  getEventStats(id: string): Observable<EventStatsDto> {
    return this.http.get<EventStatsDto>(`${this.baseUrl}/${id}/stats`);
  }

  createEvent(command: CreateEventCommand & { clubId: string }): Observable<{ id: string; name: string }> {
    return this.http.post<{ id: string; name: string }>(this.baseUrl, command);
  }

  updateEvent(id: string, command: CreateEventCommand & { id: string }): Observable<{ id: string; name: string }> {
    return this.http.put<{ id: string; name: string }>(`${this.baseUrl}/${id}`, command);
  }

  publishEvent(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/publish`, {});
  }

  cancelEvent(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/cancel`, {});
  }

  /* ================= TICKETS ================= */

  addTicketType(eventId: string, command: CreateTicketCommand): Observable<any> {
    return this.http.post(`${this.baseUrl}/${eventId}/tickets`, command);
  }

  updateTicketType(eventId: string, ticketTypeId: string, command: CreateTicketCommand & { ticketTypeId: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/${eventId}/tickets/${ticketTypeId}`, command);
  }

  removeTicketType(eventId: string, ticketTypeId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${eventId}/tickets/${ticketTypeId}`);
  }

  /* ================= REGISTRATIONS ================= */

  getEventRegistrations(
    eventId: string,
    page: number = 1,
    limit: number = 10
  ): Observable<UnifiedPaginatedResponse<EventRegistration>> {
    let params = new HttpParams()
      .set('PageNumber', page.toString())
      .set('PageSize', limit.toString());

    return this.http.get<UnifiedPaginatedResponse<EventRegistration>>(
      `${this.baseUrl}/${eventId}/registrations`,
      { params }
    );
  }

  cancelRegistration(eventId: string, registrationId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${eventId}/registrations/${registrationId}/cancel`, {});
  }
}
