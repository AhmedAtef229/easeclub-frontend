// import { Routes } from '@angular/router';

// export const routes: Routes = [
//   {
//     path: 'login',
//     loadComponent: () =>
//       import('./features/auth/login/login.component').then((c) => c.LoginComponent),
//   },
//   { path: '**', redirectTo: 'login' },
// ];
// // path: 'dashboard',
// // canActivate: [authGuard],
// // loadComponent: () =>
// //   import('./features/dashboard/dashboard.component')
// //     .then(m => m.DashboardComponent),
// import { Routes } from '@angular/router';

// export const routes: Routes = [
//   {
//     path: '',
//     redirectTo: 'login',
//     pathMatch: 'full',
//   },
//   {
//     path: 'login',
//     loadComponent: () =>
//       import('./features/auth/login/login.component').then((c) => c.LoginComponent),
//   },
// ];

import { Routes } from '@angular/router';
import { guestGuard } from './core/auth/guest.guard';

export const routes: Routes = [
  // ================= AUTH =================
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [guestGuard],
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

  // ================= ADMIN =================
  {
    path: 'admin',
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
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
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
      // ✅ Branches
      {
        path: 'branches',
        loadComponent: () =>
          import('./features/admin/branches/branches.component').then((c) => c.BranchesComponent),
      },

      // ✅ Installment Templates
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
    ],
  },

  // fallback
  {
    path: '**',
    redirectTo: 'login',
  },
];
