// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-navbar',
//   imports: [],
//   templateUrl: './navbar.component.html',
//   styleUrl: './navbar.component.css',
// })
// export class NavbarComponent {

// }
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {

  @Output() menuClick = new EventEmitter<void>();

  toggle() {
    this.menuClick.emit();
  }

}



