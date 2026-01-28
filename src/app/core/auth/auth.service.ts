import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'https://easeclub.runasp.net/api/v1/auth';

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }) {
    return this.http.post(`${this.api}/login`, data, {
      headers: new HttpHeaders({
        'X-Client-Type': 'Web',
      }),
      withCredentials: true,
    });
  }
}

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
