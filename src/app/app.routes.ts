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
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((c) => c.LoginComponent),
  },
];
