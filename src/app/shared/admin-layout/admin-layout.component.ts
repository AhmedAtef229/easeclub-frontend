// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { NavbarComponent } from './navbar/navbar.component';
// import { SidebarComponent } from './sidebar/sidebar.component';

// @Component({
//   selector: 'app-admin-layout',
//   standalone: true,
//   imports: [RouterOutlet, NavbarComponent, SidebarComponent],
//   templateUrl: './admin-layout.component.html',
//   styleUrls: ['./admin-layout.component.css'],
// })
// export class AdminLayoutComponent {}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent,ConfirmDialogComponent],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {

  isSidebarOpen = window.innerWidth >= 1024;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

}

