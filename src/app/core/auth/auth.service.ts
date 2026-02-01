// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private api = 'https://easeclub.runasp.net/api/v1/auth';

//   constructor(private http: HttpClient) {}

//   login(data: { email: string; password: string }) {
//     return this.http.post(`${this.api}/login`, data, {
//       headers: new HttpHeaders({
//         'X-Client-Type': 'Web',
//       }),
//       withCredentials: true,
//     });
//   }
//   resetPassword(token: string, password: string) {
//     return this.http.post(
//       `${this.api}/reset-password`,
//       { password },
//       {
//         headers: new HttpHeaders({
//           'X-Client-Type': 'Web',
//           Authorization: `Bearer ${token}`,
//         }),
//         withCredentials: true,
//       },
//     );
//   }
// }

// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private api = 'http://localhost:8000/api/v1/auth';

//   constructor(private http: HttpClient) {}

//   login(data: { email: string; password: string }) {
//     return this.http.post(
//       `${this.api}/login`,
//       data,
//       {
//         headers: new HttpHeaders({
//           'X-Client-Type': 'Web',
//         }),
//         withCredentials: true,
//       }
//     );
//   }
// }

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = 'https://easeclub.runasp.net/api/v1/auth';

  private defaultHeaders = new HttpHeaders({
    'X-Client-Type': 'Web',
  });

  constructor(private http: HttpClient) {}

  /** 🔐 Login */
  login(payload: LoginPayload) {
    return this.http.post(
      `${this.api}/login`,
      payload,
      {
        headers: this.defaultHeaders,
        withCredentials: true,
      }
    );
  }

  /** 🔁 Reset Password */
  resetPassword(token: string, password: string) {
    return this.http.post(
      `${this.api}/reset-password`,
      { password },
      {
        headers: this.defaultHeaders.set(
          'Authorization',
          `Bearer ${token}`
        ),
        withCredentials: true,
      }
    );
  }

  isAuthenticated(): boolean {
  return !!localStorage.getItem('accessToken');
}

}
