import { Component } from '@angular/core';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component'; // 👈 مهم جدا

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PageLayoutComponent], // 👈 مهم جدا
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}

