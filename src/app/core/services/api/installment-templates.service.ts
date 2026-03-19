import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/* ================= INTERFACES ================= */

export interface Installment {
  order: number;
  percentage: number;
  dueAfterDays: number;
}

export interface CreateTemplateDto {
  name: string;
  numOfInstallments: number;
  durationInDays: number;
  installments: Installment[];
}

export interface TemplatesResponse {
  items: any[];
  hasMore: boolean;
  page: number;
  totalCount: number;
  nextCursor: string;
}

/* ================= SERVICE ================= */

@Injectable({
  providedIn: 'root'
})
export class InstallmentTemplatesService {

  private baseUrl = 'https://easeclub.runasp.net/api/1';

  constructor(private http: HttpClient) {}

  /* ================= GET ALL ================= */

  getAll(clubId: string): Observable<TemplatesResponse> {
    return this.http.get<TemplatesResponse>(
      `${this.baseUrl}/clubs/${clubId}/installment-templates?page=1&limit=50`
    );
  }

  /* ================= GET BY ID ================= */

  getById(clubId: string, id: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/clubs/${clubId}/installment-templates/${id}`
    );
  }

  /* ================= CREATE ================= */

  create(clubId: string, body: CreateTemplateDto): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/clubs/${clubId}/installment-templates`,
      body,
      { responseType: 'text' } // 🔥 مهم عشان بيرجع ID
    );
  }

  /* ================= UPDATE ================= */

  updateInstallments(
    clubId: string,
    id: string,
    installments: Installment[]
  ): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/clubs/${clubId}/installment-templates/${id}`,
      installments
    );
  }
}
