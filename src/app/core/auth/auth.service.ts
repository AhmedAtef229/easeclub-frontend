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
  refreshToken?: string;
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

  // ------------------------
  // Storage Helpers
  // ------------------------
  private getStoredAccessToken(): string | null {
    return localStorage.getItem('easeclub_access_token');
  }

  private setStoredAccessToken(token: string | null): void {
    if (token) {
      localStorage.setItem('easeclub_access_token', token);
    } else {
      localStorage.removeItem('easeclub_access_token');
    }
  }

  private getStoredRefreshToken(): string | null {
    return localStorage.getItem('easeclub_refresh_token');
  }

  private setStoredRefreshToken(token: string | null): void {
    if (token) {
      localStorage.setItem('easeclub_refresh_token', token);
    } else {
      localStorage.removeItem('easeclub_refresh_token');
    }
  }

  //init Auth
  async initAuth(): Promise<void> {
    const refreshToken = this.getStoredRefreshToken();
    console.log('[AuthService] initAuth - Stored Refresh Token:', refreshToken);
    
    if (!refreshToken) {
      console.log('[AuthService] initAuth - No stored refresh token found. Skipping refresh API call.');
      this.accessToken = null;
      this.authStatus.next(false);
      this.isInitializing.next(false);
      return;
    }

    try {
      const response = await firstValueFrom(this.refreshToken());
      if (response?.accessToken) {
        this.accessToken = response.accessToken;
      }
    } catch (error) {
      console.error('[AuthService] initAuth - Refresh token flow failed on startup:', error);
      this.clearSession();
    } finally {
      this.isInitializing.next(false);
    }
  }

  // ------------------------
  // Getters
  // ------------------------
  getAccessToken(): string | null {
    return this.accessToken || this.getStoredAccessToken();
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
      { withCredentials: true, headers: this.defaultHeaders },
    ).pipe(
      tap(res => {
        this.accessToken = res.accessToken;
        this.setStoredAccessToken(res.accessToken);
        if (res.refreshToken) {
          this.setStoredRefreshToken(res.refreshToken);
        }
        this.authStatus.next(true);
      })
    );
  }

  // ------------------------
  // 🔁 Refresh Token (used on app start & 401 interceptor)
  // ------------------------
  refreshToken(): Observable<RefreshTokenResponse | null> {
    const refreshToken = this.getStoredRefreshToken();
    const accessToken = this.getAccessToken();

    // Temporary debug logs requested by the user
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    if (!refreshToken) {
      console.warn('[AuthService] refreshToken() invoked but no refresh token is stored. Clearing session.');
      this.clearSession();
      return of(null);
    }

    const payload = {
      refreshToken: refreshToken
    };

    return this.http.post<RefreshTokenResponse>(
      `${this.api}${AuthEndpoints.REFRESH}`,
      payload,
      { withCredentials: true, headers: this.defaultHeaders }
    ).pipe(
      tap(res => {
        console.log('[AuthService] refreshToken - Token refreshed successfully');
        this.accessToken = res.accessToken;
        this.setStoredAccessToken(res.accessToken);
        if (res.refreshToken) {
          this.setStoredRefreshToken(res.refreshToken);
        }
        this.authStatus.next(true);
      }),
      catchError(err => {
        console.error('[AuthService] refreshToken - API request failed:', err);
        this.clearSession();
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
      { withCredentials: true, headers: this.defaultHeaders }
    ).pipe(
      finalize(() => this.clearSession())
    );
  }

  private clearSession() {
    this.accessToken = null;
    this.setStoredAccessToken(null);
    this.setStoredRefreshToken(null);
    this.authStatus.next(false);
    this.router.navigate(['/login']);
  }

  // ------------------------
  // Reset Password
  // ------------------------
  resetPassword(token: string, email: string, password: string): Observable<any> {
    // We send all three to the backend for verification
    const payload = {
      token,
      email,
      newPassword: password
    };

    return this.http.post(
      `${this.api}${AuthEndpoints.RESET_PASSWORD}`,
      payload,
    );
  }
}
