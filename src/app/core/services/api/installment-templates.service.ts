import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/* ================= INTERFACES ================= */

export interface Installment {
  order: number;
  percentage: number;
  dueAfterDays: number;
}

export interface InstallmentTemplate {
  id: string;
  clubId: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  durationOfPaymentInDays: number;
  numOfInstallments: number;
}

export interface CreateTemplateDto {
  clubId: string;
  name: string;
  numOfInstallments: number;
  durationInDays: number;
  installments: Installment[];
}

export interface TemplateDetails {
  id: string;
  name: string;
  installments: Installment[];
}

/* ================= SERVICE ================= */

@Injectable({
  providedIn: 'root'
})
export class InstallmentTemplatesService {

  private baseUrl = 'https://easeclub.runasp.net/api/v1';

  constructor(private http: HttpClient) {}

  /* ================= GET ALL ================= */
  getAll(
    clubId: string,
    filters?: { planId?: string; active?: boolean }
  ): Observable<InstallmentTemplate[]> {

    let params = new HttpParams();

    if (filters?.planId) {
      params = params.set('planId', filters.planId);
    }

    if (filters?.active !== undefined) {
      params = params.set('active', String(filters.active));
    }

    return this.http.get<InstallmentTemplate[]>(
      `${this.baseUrl}/clubs/${clubId}/installment-templates`,
      { params }
    );
  }

  /* ================= GET DETAILS ================= */
  getById(id: string): Observable<TemplateDetails> {
    return this.http.get<TemplateDetails>(
      `${this.baseUrl}/installment-templates/${id}`
    );
  }

  /* ================= CREATE ================= */
  create(body: CreateTemplateDto): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/installment-templates`,
      body,
      { responseType: 'text' }
    );
  }

  /* ================= TOGGLE STATUS ================= */
  toggleStatus(id: string): Observable<void> {
    return this.http.patch<void>(
      `${this.baseUrl}/installment-templates/${id}/toggle-status`,
      {}
    );
  }

  /* ================= UPDATE ================= */
  updateInstallments(
    id: string,
    installments: Installment[]
  ): Observable<void> {

    // 🔥 Swagger عايز array of numbers فقط
    const percentages = installments.map(i => i.percentage);

    return this.http.put<void>(
      `${this.baseUrl}/installment-templates/${id}`,
      percentages
    );
  }
}
