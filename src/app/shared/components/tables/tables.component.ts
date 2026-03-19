import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'boolean';
}

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tables.component.html',
})
export class TablesComponent {

  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];

  /* Show Actions Column */
  @Input() showActions: boolean = true;

  /* Optional Actions */
  @Input() showView: boolean = false;
  @Input() showCopy: boolean = false;

  /* Events */
  @Output() edit = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();
  @Output() view = new EventEmitter<any>();
  @Output() copy = new EventEmitter<any>();
}
