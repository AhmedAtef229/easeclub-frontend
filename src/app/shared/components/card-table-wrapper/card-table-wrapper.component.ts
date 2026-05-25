import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-table-wrapper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-table-wrapper.component.html',
})
export class CardTableWrapperComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() count?: number;
  @Input() itemLabel: string = 'item';
}
