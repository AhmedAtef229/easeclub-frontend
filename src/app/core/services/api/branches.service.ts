import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Branch } from '../../models/branch.model';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private baseUrl = 'https://easeclub.runasp.net/api/v1';
  private clubId = '9f3a8b6e-2a7d-4b5c-9d9c-1e8c4c2f7a31';

  constructor(private http: HttpClient) {}

  getClubId(): string {
    return this.clubId;
  }

  /* ================= GET ================= */
  getBranches(isActive?: boolean): Observable<Branch[]> {

    let url = `${this.baseUrl}/clubs/${this.clubId}/branches`;

    if (isActive !== undefined) {
      url += `?isActive=${isActive}`;
    }

    return this.http.get<Branch[]>(url);
  }

  /* ================= CREATE ================= */
  createBranch(data: { name: string; address: string }): Observable<string> {
    return this.http.post<string>(
      `${this.baseUrl}/branches`,
      {
        ...data,
        clubId: this.clubId
      }
    );
  }

  /* ================= UPDATE ================= */
  updateBranch(branchId: string, data: { name: string; address: string }): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/branches/${branchId}`,
      data
    );
  }

  /* 🔥 TOGGLE STATUS */
  toggleStatus(branchId: string): Observable<void> {
    return this.http.patch<void>(
      `${this.baseUrl}/branches/${branchId}/toggle-status`,
      {}
    );
  }
}
