import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Branch } from '../../models/branch.model';
import { AdminContextStoreService } from './admin-context-store.service';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private baseUrl = 'https://easeclub.runasp.net/api/v1';
  private readonly adminContextStore = inject(AdminContextStoreService);

  constructor(private http: HttpClient) {}

  getClubId(): string {
    return this.adminContextStore.getClubId();
  }

  /* ================= GET ================= */
  getBranches(isActive?: boolean): Observable<Branch[]> {
    const clubId = this.adminContextStore.getClubId();
    let url = `${this.baseUrl}/clubs/${clubId}/branches`;

    if (isActive !== undefined) {
      url += `?isActive=${isActive}`;
    }

    return this.http.get<Branch[]>(url);
  }

  /* ================= CREATE ================= */
  createBranch(data: { name: string; address: string }): Observable<string> {
    const clubId = this.adminContextStore.getClubId();
    return this.http.post<string>(
      `${this.baseUrl}/branches`,
      {
        ...data,
        clubId: clubId
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
