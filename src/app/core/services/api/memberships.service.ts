import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AdminContextStoreService } from './admin-context-store.service';

@Injectable({
  providedIn: 'root'
})
export class MembershipsService {

  private baseUrl = 'https://easeclub.runasp.net/api/v1';
  private readonly adminContextStore = inject(AdminContextStoreService);

  constructor(private http: HttpClient) {}

  getClubMemberships(
    clubId?: string,
    status?: string,
    search?: string,
    page?: number,
    limit?: number
  ) {
    const activeClubId = clubId || this.adminContextStore.getClubId();

    let params = new HttpParams()
      .set('Page', (page ?? 1).toString())
      .set('Limit', (limit ?? 10).toString())
      .set('search', search ?? '');   // ← مهم جداً

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get(
      `${this.baseUrl}/clubs/${activeClubId}/memberships`,
      { params }
    );
  }
}
