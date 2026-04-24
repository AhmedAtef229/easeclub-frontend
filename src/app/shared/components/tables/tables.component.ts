import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'boolean' | 'status';
}

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tables.component.html',
})
export class TablesComponent {
  @Input() showManage: boolean = false;

  @Output() manage = new EventEmitter<any>();
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];

  @Input() showActions: boolean = true;
  @Input() showView: boolean = false;
  @Input() showCopy: boolean = false;

  @Output() edit = new EventEmitter<any>();
  @Output() view = new EventEmitter<any>();
  @Output() copy = new EventEmitter<any>();

  @Output() toggleStatus = new EventEmitter<any>();
}
