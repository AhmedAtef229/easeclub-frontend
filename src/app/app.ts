import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';

import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class AppComponent {}
