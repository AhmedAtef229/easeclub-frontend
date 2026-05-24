import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../appconfig';

@Injectable({
  providedIn: 'root',
})
export class AdminContextService {

  private BASE_URL =
    `${AppConfig.BaseUrl}/api/users/me/admin-context`;

  constructor(private http: HttpClient) {}

  getAdminContext(): Observable<AdminContextResponse> {

    console.log(
      'ADMIN CONTEXT URL:',
      this.BASE_URL
    );

    return this.http.get<AdminContextResponse>(
      this.BASE_URL
    );
  }
}

export interface AdminContextResponse {

  managedClubId: string;

  clubName: string;
}
