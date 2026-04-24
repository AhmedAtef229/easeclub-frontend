import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-photo-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-photo.component.html',
})
export class ChangePhotoComponent {

  imageUrl: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<string>();

  onSubmit() {
    if (!this.imageUrl.trim()) return;
    this.submit.emit(this.imageUrl);
  }
}
