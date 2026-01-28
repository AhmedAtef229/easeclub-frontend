// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-auth-layout',
//   standalone: true,
//   templateUrl: './auth-layout.component.html',
// })
// export class AuthLayoutComponent {
//   toggleTheme() {
//     document.documentElement.classList.toggle('dark');
//   }
// }

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent {
  toggleTheme() {
    document.documentElement.classList.toggle('dark');
  }
}

// import { Component } from '@angular/core';
// import { RouterOutlet, ɵEmptyOutletComponent } from '@angular/router';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-auth-layout',
//   standalone: true,
//   imports: [RouterOutlet, CommonModule, ɵEmptyOutletComponent],
//   templateUrl: './auth-layout.component.html',
//   styleUrls: ['./auth-layout.component.css'],
// })
// export class AuthLayoutComponent {
//   toggleTheme() {
//     document.documentElement.classList.toggle('dark');
//   }
// }
