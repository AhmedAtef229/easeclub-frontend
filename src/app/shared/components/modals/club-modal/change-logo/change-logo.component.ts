import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-logo-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-logo.component.html',
})
export class ChangeLogoComponent {

  logoUrl: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<string>();

  onSubmit() {
    if (!this.logoUrl.trim()) return;
    this.submit.emit(this.logoUrl);
  }
}
