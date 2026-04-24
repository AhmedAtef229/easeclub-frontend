import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
})
export class DropdownComponent {

  @Input() options: string[] = [];
  @Input() selected: string = 'Select';
  @Input() width: string = 'w-40';

  @Output() valueChange = new EventEmitter<string>();

  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  select(value: string) {
    this.valueChange.emit(value);
    this.isOpen = false;
  }
}
