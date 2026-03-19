import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError,firstValueFrom, of, finalize } from 'rxjs';
import { AppConfig } from '../appconfig';

interface LoginPayload {
  email: string;
  password: string;
}

interface RefreshTokenResponse {
  accessToken: string;
}

export enum AuthEndpoints {
  LOGIN = '/auth/login',
  LOGOUT = '/auth/logout',
  REFRESH = '/auth/refresh',
  RESET_PASSWORD = '/auth/reset-password',
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly api = `${AppConfig.ProdApi}`;
  private readonly router = inject(Router);
  private readonly defaultHeaders = new HttpHeaders({ 'X-Client-Type': 'Web' });

  private accessToken: string | null = null;

  private authStatus = new BehaviorSubject<boolean>(false);
  private isInitializing = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient) {}

  //init Auth
async initAuth(): Promise<void> {
  try {
    const response = await firstValueFrom(this.refreshToken());
    if (response?.accessToken) {
      this.accessToken = response.accessToken;
    }
  } catch (error) {
    this.accessToken = null;
  } finally {
    // This is the "Green Light" for all Guards
    this.isInitializing.next(false);
  }
}
  // ------------------------
  // Getters
  // ------------------------
  getAccessToken(): string | null {
    return this.accessToken;
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  get isInitializing$(): Observable<boolean> {
    return this.isInitializing.asObservable();
  }

  // ------------------------
  // 🔐 Login
  // ------------------------
  login(payload: LoginPayload) {
    return this.http.post<RefreshTokenResponse>(
      `${this.api}${AuthEndpoints.LOGIN}`,
      payload,
      { withCredentials: true,headers: this.defaultHeaders },

    ).pipe(
      tap(res => {
        this.accessToken = res.accessToken;
        this.authStatus.next(true);
      })
    );
  }

  // ------------------------
  // 🔁 Refresh Token (used on app start)
  // ------------------------
  refreshToken(): Observable<RefreshTokenResponse | null> {
    return this.http.post<RefreshTokenResponse>(
      `${this.api}${AuthEndpoints.REFRESH}`,
      {},
      { withCredentials: true, headers: this.defaultHeaders }
    ).pipe(
      tap(res => {
        this.accessToken = res.accessToken;
        this.authStatus.next(true);
      }),
      catchError(() => {
        this.accessToken = null;
        this.authStatus.next(false);
        return of(null);
      }),
    );
  }

  // ------------------------
  // 🚪 Logout
  // ------------------------
  logout() {
    return this.http.post(
      `${this.api}${AuthEndpoints.LOGOUT}`,
      {},
      { withCredentials: true , headers: this.defaultHeaders }
    ).pipe(
      finalize(() => this.clearSession())
    );
  }

  private clearSession() {
    this.accessToken = null;
    this.authStatus.next(false);
    this.router.navigate(['/login']);
  }

  // ------------------------
// � Reset Password
// ------------------------
resetPassword(token: string, email: string, password: string): Observable<any> {
  // We send all three to the backend for verification
  const payload = {
    token,
    email,
    password
  };

  return this.http.post(
    `${this.api}${AuthEndpoints.RESET_PASSWORD}`,
    payload,
  );
}
}

