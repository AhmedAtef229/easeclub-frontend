import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Branch } from '../../models/branch.model';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  /* ================= CONFIG ================= */

  private baseUrl = 'https://easeclub.runasp.net/api/v1';

  // 🔥 المصدر الوحيد للـ clubId
  private clubId = '9f3a8b6e-2a7d-4b5c-9d9c-1e8c4c2f7a31';

  constructor(private http: HttpClient) {}

  /* ================= CLUB ID ================= */

  // ✅ getter تستخدمه في أي مكان في المشروع
  getClubId(): string {
    return this.clubId;
  }

  /* ================= GET BRANCHES ================= */

  getBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(
      `${this.baseUrl}/clubs/${this.clubId}/branches`
    );
  }

  /* ================= CREATE BRANCH ================= */

  createBranch(data: { name: string }): Observable<string> {
    return this.http.post<string>(
      `${this.baseUrl}/clubs/${this.clubId}/branches`,
      data
    );
  }

  /* ================= UPDATE BRANCH ================= */

  updateBranch(branchId: string, data: { name: string }): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/clubs/${this.clubId}/branches/${branchId}`,
      data
    );
  }

}
