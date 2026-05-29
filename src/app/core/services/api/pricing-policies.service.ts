import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'https://easeclub.runasp.net/api/v1';

@Injectable({
  providedIn: 'root'
})
export class PricingPoliciesService {

  constructor(private http: HttpClient) {}

  /* ================= TYPES ================= */

  // Condition
  interfaceCondition!: PricingCondition;

  // Policy
  interfacePolicy!: PricingPolicy;

  /* ================= GET ALL ================= */

  getAllPolicies(clubId: string): Observable<PricingPolicy[]> {
    return this.http.get<PricingPolicy[]>(
      `${BASE_URL}/clubs/${clubId}/pricing-policies`
    );
  }

  /**
   * Returns only policies compatible with the given target type.
   * For events: ?compatibleWith=Event
   * For templates: ?compatibleWith=ApplicationTemplate&compatibleWithTargetId={templateId}
   */
  getCompatiblePolicies(
    clubId: string,
    targetType: 'Event' | 'ApplicationTemplate',
    targetId?: string
  ): Observable<PricingPolicy[]> {
    let url = `${BASE_URL}/clubs/${clubId}/pricing-policies?compatibleWith=${targetType}`;
    if (targetId) url += `&compatibleWithTargetId=${targetId}`;
    return this.http.get<PricingPolicy[]>(url);
  }

  /* ================= GET BY ID ================= */

  getPolicyById(id: string): Observable<PricingPolicy> {
    return this.http.get<PricingPolicy>(
      `${BASE_URL}/pricing-policies/${id}`
    );
  }

  /* ================= CREATE ================= */

  createPolicy(payload: CreatePricingPolicyDto): Observable<any> {
    return this.http.post(
      `${BASE_URL}/clubs/${payload.clubId}/pricing-policies`,
      payload
    );
  }

  /* ================= UPDATE ================= */

  updatePolicy(id: string, payload: UpdatePricingPolicyDto): Observable<void> {
    return this.http.put<void>(
      `${BASE_URL}/pricing-policies/${id}`,
      payload
    );
  }

  /* ================= ASSIGN ================= */

  assignPolicies(payload: AssignPoliciesDto): Observable<void> {
    return this.http.post<void>(
      `${BASE_URL}/pricing-policies/assign`,
      payload
    );
  }

  /* ================= UNASSIGN ================= */

  unassignPolicy(payload: UnassignPolicyDto): Observable<void> {
    return this.http.post<void>(
      `${BASE_URL}/pricing-policies/unassign`,
      payload
    );
  }

  /* ================= GET ASSIGNMENTS ================= */

  getAssignments(targetType: string, targetId: string): Observable<PolicyAssignment[]> {
    return this.http.get<PolicyAssignment[]>(
      `${BASE_URL}/pricing-policies/${targetType}/targets/${targetId}/assignments`
    );
  }
}

/* ================= POLICY ================= */

export interface PricingPolicy {
  id: string;
  name: string;
  isIncrease: boolean;
  fixedAmount: number;
  percentageValue: number;
  multiplierSourceKey?: string;
  conditions: PricingCondition[];
}

/* ================= CONDITION ================= */

export interface PricingCondition {
  fieldKey: string;
  operator: 'Equals' | 'NotEquals' | 'GreaterThan' | 'LessThan';
  expectedValue: string;
}

/* ================= CREATE ================= */

export interface CreatePricingPolicyDto {
  clubId: string;
  name: string;
  priority: number;
  isIncrease: boolean;
  fixedAmount?: number;
  percentageValue?: number;
  multiplierKey?: string;
  conditions: PricingCondition[];
}

/* ================= UPDATE ================= */

export interface UpdatePricingPolicyDto {
  id: string;
  name: string;
  priority: number;
  isIncrease: boolean;
  fixedAmount?: number;
  percentageValue?: number;
  multiplierKey?: string;
  conditions: PricingCondition[];
}

/* ================= ASSIGN ================= */

export interface AssignPoliciesDto {
  policies: {
    policyId: string;
    priority: number;
  }[];
  targetId: string;
  targetType: 'ApplicationTemplate' | 'Event';
  priority: number;
}

/* ================= UNASSIGN ================= */

export interface UnassignPolicyDto {
  policyId: string;
  targetId: string;
  targetType: 'ApplicationTemplate' | 'Event';
}

/* ================= ASSIGNMENT (response) ================= */

export interface PolicyAssignment {
  id: string;
  policyId: string;
  policyName: string;
  targetId: string;
  targetType: 'ApplicationTemplate' | 'Event';
  priority?: number;
}
