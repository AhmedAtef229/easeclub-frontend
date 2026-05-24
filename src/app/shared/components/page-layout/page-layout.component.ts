import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-layout.component.html',
})
export class PageLayoutComponent {
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() hasActions: boolean = false;
}
