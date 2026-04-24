import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/* ================= INTERFACES ================= */

export interface MembershipPlan {
  id: string;
  name: string;
  membershipTypeName: string;
  price: number;
  maxPaymentPeriod: number;
  subscriptionValidityInYears: number;
  maxFamilyMembers: number;
  isActive: boolean;
  createdAt: string;
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
}

export interface UpdatePlanDto {
  name: string;
  description: string;
  totalPrice: number;
  installmentTemplateIds: string[];
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
      params = params.set('isActive', String(filters.isActive)); // ✅ FIX
    }

    if (filters?.page) {
      params = params.set('page', filters.page.toString());
    }

    if (filters?.limit) {
      params = params.set('limit', filters.limit.toString());
    }

    if (filters?.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }

    if (filters?.sortDesc !== undefined) {
      params = params.set('sortDesc', String(filters.sortDesc));
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
      { responseType: 'text' } // ✅ بيرجع ID
    );
  }

  /* ================= UPDATE ================= */

  update(planId: string, body: UpdatePlanDto): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/membership-plans/${planId}`,
      body
    );
  }

  /* ================= TOGGLE STATUS (Helper) ================= */

  toggleStatus(planId: string, isActive: boolean): Observable<void> {
    return this.update(planId, {
      name: '',
      description: '',
      totalPrice: 0,
      installmentTemplateIds: []
    });
  }
}
