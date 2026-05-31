import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/* ================= INTERFACES ================= */

export interface MembershipPlan {
  id: string;
  membershipTypeId: string;
  name: string;
  description?: string;
  membershipTypeName: any;
  price: number;
  renewPrice?: number;
  maxPaymentPeriod: number;
  subscriptionValidityInYears: number;
  maxFamilyMembers: number;
  durationInDays?: number;
  isActive: boolean;
  createdAt: string;
  enrollmentMode?: string;
  paymentMode?: string;
  installmentsAllowdInRenewal?: boolean;
  installmentsAllowedInRenewal?: boolean;
  installmentTemplateIds?: string[];
}

export interface MembershipPlansResponse {
  items: MembershipPlan[];
  hasMore: boolean;
  page: number;
  totalCount: number;
  nextCursor: string;
}

export interface CreatePlanDto {
  membershipTypeId: string;
  name: string;
  price: number;
  subscriptionValidityInYears: number;
  maxFamilyMembers: number;
  durationInDays: number;
  enrollmentMode: string;
  applicationTemplateId?: string;
  paymentMode: 'Cash' | 'Installments' | 'Mixed';
  installmentTemplateIds?: string[];
  installmentsAllowedInRenewal?: boolean;
  renewPrice?: number;
}

export interface UpdatePlanDto {
  membershipTypeId?: string;
  name: string;
  description: string;
  totalPrice: number;
  renewPrice: number;
  subscriptionValidityInYears: number;
  durationInDays: number;
  maxFamilyMembers?: number;
  enrollmentMode?: string;
  paymentMode?: string;
}

/* ================= SERVICE ================= */

@Injectable({
  providedIn: 'root'
})
export class MembershipPlansService {

  private baseUrl = 'https://easeclub.runasp.net/api/v1';

  constructor(private http: HttpClient) {}

  /* ================= GET ALL ================= */

  getAll(
    clubId: string,
    filters?: {
      membershipTypeId?: string;
      isActive?: boolean;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortDesc?: boolean;
    }
  ): Observable<MembershipPlansResponse> {

    let params = new HttpParams();

    if (filters?.membershipTypeId) {
      params = params.set('membershipTypeId', filters.membershipTypeId);
    }

    if (filters?.isActive !== undefined) {
      params = params.set('isActive', String(filters.isActive));
    }

    if (filters?.page) {
      params = params.set('Page', filters.page.toString()); // ✅ FIX
    }

    if (filters?.limit) {
      params = params.set('Limit', filters.limit.toString()); // ✅ FIX
    }

    if (filters?.sortBy) {
      params = params.set('SortBy', filters.sortBy); // ✅ FIX
    }

    if (filters?.sortDesc !== undefined) {
      params = params.set('SortDesc', String(filters.sortDesc)); // ✅ FIX
    }

    return this.http.get<MembershipPlansResponse>(
      `${this.baseUrl}/clubs/${clubId}/membership-plans`,
      { params }
    );
  }

  /* ================= GET BY ID ================= */

  getById(planId: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/membership-plans/${planId}`
    );
  }

  /* ================= CREATE ================= */

  create(clubId: string, body: CreatePlanDto): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/clubs/${clubId}/membership-plans`,
      body,
      { responseType: 'text' }
    );
  }

  /* ================= UPDATE ================= */

  update(planId: string, body: UpdatePlanDto): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/membership-plans/${planId}`,
      body
    );
  }

  /* ================= UPDATE INSTALLMENT TEMPLATES ================= */

  updateInstallmentTemplates(
    planId: string,
    installmentTemplateIds: string[]
  ): Observable<void> {

    return this.http.put<void>(
      `${this.baseUrl}/membership-plans/${planId}/installment-templates`,
      { installmentTemplateIds }
    );
  }

  /* ================= DELETE ================= */

  delete(planId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/membership-plans/${planId}`
    );
  }

  /* ================= TOGGLE STATUS ================= */

  toggleStatus(planId: string): Observable<void> {
    return this.http.patch<void>(
      `${this.baseUrl}/membership-plans/${planId}/toggle-status`,
      {}
    );
  }

  /* ================= DIRECT PAY ================= */

  directPay(planId: string, body: {
    clubId: string;
    membershipTypeId: string;
    installmentTemplateId: string;
  }): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/membership-plans/${planId}/direct-pay`,
      body
    );
  }

}
