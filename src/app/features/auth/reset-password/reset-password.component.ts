import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthLayoutComponent } from '../../../shared/auth-layout/auth-layout.component';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../../core/services/api/ui/theme.service';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, AuthLayoutComponent, TranslateModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  // Declare properties
  private route: ActivatedRoute;
  private router: Router;
  private fb: FormBuilder;
  private authService: AuthService;
  public themeService: ThemeService;

  form!: FormGroup;
  token: string | null = null;
  email: string | null = null;
  loading = false;
  error: string | null = null;
  showSuccessModal = false;

  constructor() {
    // Using inject() inside the constructor
    this.route = inject(ActivatedRoute);
    this.router = inject(Router);
    this.fb = inject(FormBuilder);
    this.authService = inject(AuthService);
    this.themeService = inject(ThemeService);
  }

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    this.token = params.get('token');
    this.email = params.get('email');

    this.form = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: (g: FormGroup) =>
          g.get('password')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true },
      },
    );
  }

  submit() {
    if (this.form.invalid || !this.token || !this.email) return;

    this.loading = true;
    this.authService.resetPassword(this.token, this.email, this.form.value.password).subscribe({
      next: () => {
        this.loading = false;
        this.showSuccessModal = true;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Something went wrong';
      },
    });
  }
}
