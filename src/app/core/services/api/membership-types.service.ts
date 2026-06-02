import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminContextStoreService } from './admin-context-store.service';

@Injectable({
  providedIn: 'root',
})
export class MembershipTypesService {
  private baseUrl = 'https://easeclub.runasp.net/api/v1';
  private readonly adminContextStore = inject(AdminContextStoreService);

  constructor(private http: HttpClient) {}

  /* ================= GET ================= */
  getMembershipTypes(filters?: any): Observable<any[]> {
    let params = new HttpParams();
    const clubId = this.adminContextStore.getClubId();

    if (filters?.branchId) {
      params = params.set('branchId', filters.branchId);
    }

    if (filters?.isActive !== undefined) {
      params = params.set('isActive', filters.isActive);
    }

    return this.http.get<any[]>(
      `${this.baseUrl}/clubs/${clubId}/membership-types`,
      { params }
    );
  }

  /* ================= CREATE ================= */
  createMembershipType(data: any): Observable<string> {
    return this.http.post<string>(
      `${this.baseUrl}/membership-types`,
      data
    );
  }

  /* ================= UPDATE ================= */
  updateMembershipType(id: string, data: any): Observable<void> {
    const clubId = this.adminContextStore.getClubId();
    return this.http.patch<void>(
      `${this.baseUrl}/clubs/${clubId}/membership-types/${id}`,
      data
    );
  }

  /* ================= TOGGLE ================= */
  toggleStatus(id: string): Observable<boolean> {
    const clubId = this.adminContextStore.getClubId();
    return this.http.patch<boolean>(
      `${this.baseUrl}/clubs/${clubId}/membership-types/${id}/toggle-status`,
      {}
    );
  }
}
