import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, AuthLayoutComponent],
  templateUrl: './app.html',
})
export class AppComponent {}
