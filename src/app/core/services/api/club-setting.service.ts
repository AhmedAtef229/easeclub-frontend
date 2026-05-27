import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../appconfig';

@Injectable({
  providedIn: 'root',
})
export class ClubSettingService {

  private BASE_URL = `${AppConfig.ProdApi}/clubs`;

  constructor(private http: HttpClient) {}

  // ================= GET CLUB BY ID =================
  getClubById(id: string): Observable<Club> {
    return this.http.get<Club>(`${this.BASE_URL}/${id}`);
  }

  // ================= GET CLUBS =================
  getClubs(params?: GetClubsParams): Observable<any> {

    let httpParams = new HttpParams();

    if (params) {

      if (params.cursor) {
        httpParams = httpParams.set('Cursor', params.cursor);
      }

      if (params.limit) {
        httpParams = httpParams.set('Limit', params.limit);
      }

      if (params.search) {
        httpParams = httpParams.set('Search', params.search);
      }

      if (params.sortBy) {
        httpParams = httpParams.set('SortBy', params.sortBy);
      }

      if (params.sortDesc !== undefined) {
        httpParams = httpParams.set(
          'SortDesc',
          params.sortDesc
        );
      }
    }

    return this.http.get<any>(this.BASE_URL, {
      params: httpParams,
    });
  }

  // ================= GET ADMIN DASHBOARD =================
  getAdminDashboard(clubId: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/${clubId}/admin-dashboard`);
  }

  // ================= UPDATE CLUB =================
  updateClub(
    id: string,
    payload: UpdateClubDto
  ): Observable<void> {

    return this.http.put<void>(
      `${this.BASE_URL}/${id}/details`,
      this.cleanPayload(payload)
    );
  }

  // ================= CLEAN PAYLOAD =================
  private cleanPayload(payload: UpdateClubDto) {

    return Object.fromEntries(
      Object.entries(payload).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== null
      )
    );
  }
}

/* ================= TYPES ================= */

export interface Club {
  id: string;

  name: string;

  about: string;

  logoUrl: string;

  coverImageUrl: string;

  amenities: {
    name: string;
  }[];

  workSchedules: {
    label: string;
    timeRange: string;
  }[];

  contactInfo: {
    email: {
      value: string;
    };

    phone: {
      value: string;
    };
  };
}

export interface UpdateClubDto {

  about: string;

  phone: string;

  email: string;

  workSchedules: {
    label: string;
    timeRange: string;
  }[];

  amenities: string[];

  logoId?: string;

  coverImageId?: string;
}

export interface ClubListItem {

  id: string;

  name: string;

  logoUrl: string;
}

export interface GetClubsParams {

  cursor?: string;

  limit?: number;

  search?: string;

  sortBy?: string;

  sortDesc?: boolean;
}
