import { Routes } from '@angular/router';
import { guestGuard } from './core/auth/guest.guard';
import { authGuard } from './core/auth/auth.guard'; // Ensure this is your logged-in guard

export const routes: Routes = [
  // 1. Initial Redirect: If user hits "", send them to the admin dashboard
  { 
    path: '', 
    redirectTo: 'admin/dashboard', 
    pathMatch: 'full' 
  },

  // ================= AUTH (Public/Guest) =================
  {
    path: 'login',
    canActivate: [guestGuard], // Prevents logged-in users from seeing login
    loadComponent: () =>
      import('./features/auth/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password.component').then(
        (c) => c.ResetPasswordComponent,
      ),
  },

  // ================= ADMIN (Protected) =================
  {
    path: 'admin',
    // THIS LINE PROTECTS ALL CHILDREN BELOW AUTOMATICALLY
    canActivateChild: [authGuard], 
    loadComponent: () =>
      import('./shared/admin-layout/admin-layout.component').then((c) => c.AdminLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent,
          ),
      },
      {
        path: 'membership-plans',
        loadComponent: () =>
          import('./features/admin/membership-plans/membership-plans.component').then(
            (c) => c.MembershipPlansComponent,
          ),
      },
      {
        path: 'membership-types',
        loadComponent: () =>
          import('./features/admin/membership-types/membership-types.component').then(
            (c) => c.MembershipTypesComponent,
          ),
      },
      {
        path: 'branches',
        loadComponent: () =>
          import('./features/admin/branches/branches.component').then((c) => c.BranchesComponent),
      },
      {
        path: 'installment-templates',
        loadComponent: () =>
          import('./features/admin/installment-templates/installment-templates.component').then(
            (c) => c.InstallmentTemplatesComponent,
          ),
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import('./features/admin/bookings/bookings.component').then((m) => m.BookingsComponent),
      },
      {
        path: 'memberships',
        loadComponent: () =>
          import('./features/admin/memberships/memberships.component').then(
            (m) => m.MembershipsComponent,
          ),
      },
      // Default child route for /admin
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  // ================= FALLBACK =================
  {
    path: '**',
    redirectTo: 'login',
  },
];