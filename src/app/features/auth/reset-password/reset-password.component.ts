import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthLayoutComponent } from '../../../shared/auth-layout/auth-layout.component';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthLayoutComponent,
    TranslateModule
  ],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {

  token!: string;
  loading = false;
  error: string | null = null;
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    public themeService: ThemeService // ✅ Inject هنا بس
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  submit() {
    if (this.form.invalid || !this.token) return;

    this.loading = true;

    this.authService.resetPassword(this.token, this.form.value.password).subscribe({
      next: () => {
        this.loading = false;
        alert('Password reset successfully');
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Something went wrong';
      },
    });
  }
}
