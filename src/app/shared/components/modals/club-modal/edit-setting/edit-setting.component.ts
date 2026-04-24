import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-amenity-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-setting.component.html',
})
export class EditSettingComponent {

  amenityName: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<string>();

  onSubmit() {
    if (!this.amenityName.trim()) return;
    this.submit.emit(this.amenityName);
  }
}
