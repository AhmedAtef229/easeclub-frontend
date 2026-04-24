import { Component, Input, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/api/ui/theme.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  @Input() isOpen = false;
  private authService = inject(AuthService);

  constructor(public themeService: ThemeService) {}

  logout() {
    this.authService.logout().subscribe({
      error: (err) => console.error('Logout failed', err),
    });
  }

}
