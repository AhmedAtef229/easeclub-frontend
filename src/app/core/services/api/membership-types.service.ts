import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembershipTypesService {
  private baseUrl = 'https://easeclub.runasp.net/api/v1';
  private clubId = '9f3a8b6e-2a7d-4b5c-9d9c-1e8c4c2f7a31';

  constructor(private http: HttpClient) {}

  /* ================= GET ================= */
  getMembershipTypes(filters?: any): Observable<any[]> {
    let params = new HttpParams();

    if (filters?.branchId) {
      params = params.set('branchId', filters.branchId);
    }

    if (filters?.isActive !== undefined) {
      params = params.set('isActive', filters.isActive);
    }

    return this.http.get<any[]>(
      `${this.baseUrl}/clubs/${this.clubId}/membership-types`,
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
    return this.http.patch<void>(
      `${this.baseUrl}/clubs/${this.clubId}/membership-types/${id}`,
      data
    );
  }

  /* ================= TOGGLE ================= */
  toggleStatus(id: string): Observable<boolean> {
    return this.http.patch<boolean>(
      `${this.baseUrl}/clubs/${this.clubId}/membership-types/${id}/toggle-status`,
      {}
    );
  }
}
