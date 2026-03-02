import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {

  @Input() placeholder = 'Search...';
  @Output() search = new EventEmitter<string>();

  onInput(value: string) {
    this.search.emit(value);
  }
}
