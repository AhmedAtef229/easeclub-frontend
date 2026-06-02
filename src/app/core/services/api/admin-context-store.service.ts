import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { AdminContextService, AdminContextResponse } from './admin-context.service';

@Injectable({
  providedIn: 'root',
})
export class AdminContextStoreService {
  private readonly adminContextService = inject(AdminContextService);
  private readonly authService = inject(AuthService);

  private readonly contextSubject = new BehaviorSubject<AdminContextResponse | null>(null);

  /**
   * Expose context$ as an Observable. Emits whenever a non-null context is loaded.
   */
  readonly context$: Observable<AdminContextResponse> = this.contextSubject.asObservable().pipe(
    filter((ctx): ctx is AdminContextResponse => ctx !== null)
  );

  private loadPromise: Promise<AdminContextResponse> | null = null;
  private isLoaded = false;

  constructor() {
    // Automatically load or clear context based on authentication status
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.ensureContextLoaded().catch((err) =>
          console.error('[AdminContextStoreService] Failed to load admin context on auth change:', err)
        );
      } else {
        this.clearContext();
      }
    });
  }

  /**
   * Returns the active club ID. Throws an Error if called before the context is loaded.
   */
  getClubId(): string {
    const clubId = this.contextSubject.value?.managedClubId;
    if (!clubId) {
      const errorMsg = '[AdminContextStoreService] getClubId() was called but managedClubId is not loaded/available. Ensure context is loaded before querying.';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    console.log(`[AdminContextStoreService] Club ID requested: ${clubId}`);
    return clubId;
  }

  /**
   * Returns the active club name. Throws an Error if called before the context is loaded.
   */
  getClubName(): string {
    const clubName = this.contextSubject.value?.clubName;
    if (!clubName) {
      const errorMsg = '[AdminContextStoreService] getClubName() was called but clubName is not loaded/available. Ensure context is loaded before querying.';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    return clubName;
  }

  /**
   * Ensures that the admin context is loaded. Returns a Promise of the context.
   * Reuses any pending HTTP request to prevent duplicate API calls.
   */
  ensureContextLoaded(): Promise<AdminContextResponse> {
    if (this.isLoaded && this.contextSubject.value) {
      return Promise.resolve(this.contextSubject.value);
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = firstValueFrom(
      this.adminContextService.getAdminContext()
    ).then(
      (context) => {
        this.isLoaded = true;
        this.contextSubject.next(context);
        this.loadPromise = null;
        console.log('[AdminContextStoreService] Context loaded:', context);
        return context;
      },
      (error) => {
        this.loadPromise = null;
        console.error('[AdminContextStoreService] Context load failure:', error);
        throw error;
      }
    );

    return this.loadPromise;
  }

  /**
   * Clears the cached context. Called on logout.
   */
  private clearContext(): void {
    const hadContext = this.isLoaded;
    this.isLoaded = false;
    this.contextSubject.next(null);
    this.loadPromise = null;
    if (hadContext) {
      console.log('[AdminContextStoreService] Context cleared');
    }
  }
}
