import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserContextService {

private baseUrl = 'https://easeclub.runasp.net/api/v1';

  constructor(private http: HttpClient) {}

  getAdminContext() {
    return this.http.get<any>(
      `${this.baseUrl}/users/me/admin-context`
    );
  }
}
