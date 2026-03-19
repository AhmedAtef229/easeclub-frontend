import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembershipTypesService {

  private baseUrl = 'https://easeclub.runasp.net/api/v1';
  private clubId = '9f3a8b6e-2a7d-4b5c-9d9c-1e8c4c2f7a31';

  constructor(private http: HttpClient) {}

  /* ================= GET ================= */

  getMembershipTypes(): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.baseUrl}/clubs/${this.clubId}/membership-types`
    );

  }

  /* ================= CREATE ================= */

  createMembershipType(data: any): Observable<string> {

    return this.http.post<string>(
      `${this.baseUrl}/clubs/${this.clubId}/membership-types`,
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

  /* ================= TOGGLE STATUS ================= */

  toggleStatus(id: string): Observable<boolean> {

    return this.http.patch<boolean>(
      `${this.baseUrl}/clubs/${this.clubId}/membership-types/${id}/toggle-status`,
      {}
    );

  }

}
