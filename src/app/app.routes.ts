import { Routes } from '@angular/router';
import { guestGuard } from './core/auth/guest.guard';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  // ================= ROOT =================
  {
    path: '',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full',
  },

  // ================= AUTH =================
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

      // 🔥 Club Settings
   {
  path: 'club-settings',
  loadComponent: () =>
    import('./features/admin/club-settings/club-settings.component').then(
      (c) => c.ClubSettingsComponent,
    ),
},
      // 🔥 Application Templates
      {
        path: 'application-templates',
        loadComponent: () =>
          import('./features/admin/application-templates/application-templates.component').then(
            (c) => c.ApplicationTemplatesComponent,
          ),
      },

      // 🔥 Application Reviews (NEW)
      {
        path: 'application-reviews',
        loadComponent: () =>
          import('./features/admin/application-reviews/application-reviews.component').then(
            (c) => c.ApplicationReviewsComponent,
          ),
      },

      // 🔥 Payments (NEW)
      {
        path: 'payments',
        loadComponent: () =>
          import('./features/admin/payments/payments.component').then((c) => c.PaymentsComponent),
      },

{
  path: 'pricing-policies',
  loadComponent: () =>
    import('./features/admin/pricing-policies/pricing-policies.component')
      .then(c => c.PricingPoliciesComponent),

  children: [
    {
      path: '',
      redirectTo: 'pricing-policy-content',
      pathMatch: 'full'
    },
    {
      path: 'pricing-policy-content',
      loadComponent: () =>
        import('./features/admin/pricing-policies/pricing-policy-content/pricing-policy-content.component')
          .then(c => c.PricingPolicyContentComponent),
    },
    {
      path: 'pricing-policy-assignment',
      loadComponent: () =>
        import('./features/admin/pricing-policies/pricing-policy-assignment/pricing-policy-assignment.component')
          .then(c => c.PricingPolicyAssignmentComponent),
    }
  ]
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
        path: 'memberships',
        loadComponent: () =>
          import('./features/admin/memberships/memberships.component').then(
            (m) => m.MembershipsComponent,
          ),
      },

      // 🎟 Events
      {
        path: 'events',
        loadComponent: () =>
          import('./features/admin/events/events.component').then(
            (c) => c.EventsComponent,
          ),
      },
      {
        path: 'events/:id',
        loadComponent: () =>
          import('./features/admin/events/event-details/event-details.component').then(
            (c) => c.EventDetailsComponent,
          ),
      },

      // ✅ Default داخل admin
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
