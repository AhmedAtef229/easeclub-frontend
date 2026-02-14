import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthLayoutComponent } from '../../../shared/auth-layout/auth-layout.component';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, AuthLayoutComponent,CommonModule,TranslateModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    // ✅ إنشاء الفورم هنا
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        localStorage.setItem('accessToken', res.accessToken);
        // TODO: navigate to dashboard
      },
      error: () => {
        this.error = 'Invalid email or password';
        this.loading = false;
      },
    });
  }
}
// import { Component } from '@angular/core';
// import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
// import { AuthService } from '../../../core/auth/auth.service';
// import { AuthLayoutComponent } from '../../../shared/auth-layout/auth-layout.component';
// import { CommonModule } from '@angular/common';
// @Component({
//   standalone: true,
//   selector: 'app-login',
//   imports: [ReactiveFormsModule, AuthLayoutComponent, CommonModule],
//   templateUrl: './login.component.html',
// })
// export class LoginComponent {
//   loginForm!: FormGroup;
//   loading = false;
//   error = '';

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//   ) {
//     // ✅ إنشاء الفورم هنا
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required],
//     });
//   }

//   login() {
//     if (this.loginForm.invalid) return;

//     this.loading = true;
//     this.error = '';

//     this.authService.login(this.loginForm.value).subscribe({
//       next: (res: any) => {
//         localStorage.setItem('accessToken', res.accessToken);
//         // this.router.navigate(['/dashboard']);
//       },
//       error: () => {
//         this.error = 'Invalid email or password';
//         this.loading = false;
//       },
//     });
//   }
// }
