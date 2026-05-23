import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApplicationReviewsService {

  private baseUrl = 'https://easeclub.runasp.net/api/v1';

  constructor(private http: HttpClient) {}

  getApplications(
    clubId: string,
    status?: string,
    dateFrom?: string,
    dateTo?: string,
    search?: string,
    page: number = 1,
    limit: number = 10
  ) {

    let params = new HttpParams()
      .set('pagination.Page', page)
      .set('pagination.Limit', limit)
      .set('filters.Status', status || '')
      .set('filters.SubmittedFrom', dateFrom || '')
      .set('filters.SubmittedTo', dateTo || '')
      .set('filters.TrackingNumber', search || '');

    return this.http.get(
      `${this.baseUrl}/clubs/${clubId}/membership-applications`,
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

}

