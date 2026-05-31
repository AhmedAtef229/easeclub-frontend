// application-template.service.ts

import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApplicationTemplateService {

  private http = inject(HttpClient);

  // ✅ IMPORTANT
  private api = 'https://easeclub.runasp.net/api/v1';

  // ============================================
  // GET ALL
  // ============================================

  getTemplates(
    clubId: string,
    query?: {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
      sortDesc?: boolean;
    }
  ): Observable<any> {

    let params = new HttpParams();

    if (query?.page !== undefined) {
      params = params.set('Page', query.page);
    }

    if (query?.limit !== undefined) {
      params = params.set('Limit', query.limit);
    }

    if (query?.search) {
      params = params.set('Search', query.search);
    }

    if (query?.sortBy) {
      params = params.set('SortBy', query.sortBy);
    }

    if (query?.sortDesc !== undefined) {
      params = params.set('SortDesc', query.sortDesc);
    }

    return this.http.get(
      `${this.api}/clubs/${clubId}/application-templates`,
      {
        params,
        responseType: 'text',
      }
    ).pipe(
      map((res: string) => JSON.parse(res))
    );
  }

  // ============================================
  // GET BY ID
  // ============================================

  getTemplateById(templateId: string): Observable<any> {
    return this.http.get(
      `${this.api}/admin/application-templates/${templateId}`,
      { responseType: 'text' }
    ).pipe(
      map((res: string) => JSON.parse(res))
    );
  }

  // ============================================
  // UPSERT
  // ============================================

  upsertTemplate(payload: {
    clubId: string;
    templateId?: string;
    name: string;
    steps: any[];
  }): Observable<void> {

    return this.http.post<void>(
      `${this.api}/admin/application-templates/upsert`,
      payload
    );
  }

  // ============================================
  // TOGGLE STATUS
  // ============================================

  toggleStatus(id: string): Observable<void> {
    return this.http.patch<void>(
      `${this.api}/admin/application-templates/${id}/toggle-status`,
      {}
    );
  }

  // ============================================
  // DELETE
  // ============================================

  deleteTemplate(templateId: string): Observable<void> {

    return this.http.delete<void>(
      `${this.api}/admin/application-templates/${templateId}`
    );
  }

  // ============================================
  // SYNC PLANS
  // ============================================

  syncMembershipPlans(
    templateId: string,
    membershipPlansIds: string[]
  ): Observable<void> {
    return this.http.put<void>(
      `${this.api}/admin/application-templates/${templateId}/membership-plans`,
      {
        templateId,
        membershipPlansIds,
      }
    );
  }

  // ============================================
  // SYSTEM SECTIONS
  // ============================================

  getSystemSection(intent: string): Observable<any> {
    // Note: system-sections might not be under v1 according to documentation
    const baseUrl = this.api.replace('/v1', '');
    return this.http.get(`${baseUrl}/system-sections/${intent}`, {
      responseType: 'text',
    }).pipe(
      map((res: string) => JSON.parse(res))
    );
  }
}


