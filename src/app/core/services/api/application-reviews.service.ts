import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminContextStoreService } from './admin-context-store.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationReviewsService {

  private baseUrl = 'https://easeclub.runasp.net/api/v1';
  private readonly adminContextStore = inject(AdminContextStoreService);

  constructor(private http: HttpClient) {}

  getApplications(
    clubId?: string,
    status?: string,
    dateFrom?: string,
    dateTo?: string,
    search?: string,
    page: number = 1,
    limit: number = 10
  ) {
    const activeClubId = clubId || this.adminContextStore.getClubId();

    let params = new HttpParams()
      .set('pagination.Page', page)
      .set('pagination.Limit', limit)
      .set('filters.Status', status || '')
      .set('filters.SubmittedFrom', dateFrom || '')
      .set('filters.SubmittedTo', dateTo || '')
      .set('filters.TrackingNumber', search || '');

    return this.http.get(
      `${this.baseUrl}/clubs/${activeClubId}/membership-applications`,
      { params }
    );
  }

  getApplicationDetails(id: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/membership-applications/admin/${id}`,
      { responseType: 'text' }
    ).pipe(
      map((res: any) => {
        if (typeof res === 'string') {
          return res.trim() ? JSON.parse(res) : null;
        }
        return res;
      })
    );
  }

  getApplicationPricing(id: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/membership-applications/${id}/pricing`,
      { responseType: 'text' }
    ).pipe(
      map((res: any) => {
        if (typeof res === 'string') {
          return res.trim() ? JSON.parse(res) : null;
        }
        return res;
      })
    );
  }

  submitApplicationReview(id: string, decision: 'Approved' | 'Rejected', rejectionReason?: string): Observable<any> {
    const body = { decision, rejectionReason };
    return this.http.post(`${this.baseUrl}/membership-applications/${id}/reviews`, body);
  }
}

