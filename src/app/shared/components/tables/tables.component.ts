import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
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
export class TablesComponent implements OnChanges {
  @Input() showManage: boolean = false;

  @Output() manage = new EventEmitter<any>();
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];

  @Input() showActions: boolean = true;
  @Input() showView: boolean = false;
  @Input() showCopy: boolean = false;
  @Input() showEdit: boolean = true;
  
  @Input() pageSize: number = 6;
  currentPage: number = 1;

  @Output() edit = new EventEmitter<any>();
  @Output() view = new EventEmitter<any>();
  @Output() copy = new EventEmitter<any>();

  @Output() toggleStatus = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.currentPage = 1;
    }
  }

  get paginatedData() {
    if (!this.data) return [];
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.data.slice(start, end);
  }

  get totalPages() {
    return Math.ceil((this.data?.length || 0) / this.pageSize);
  }
  
  get pagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  
  get showingStart() {
    if (!this.data || this.data.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }
  
  get showingEnd() {
    if (!this.data || this.data.length === 0) return 0;
    const end = this.currentPage * this.pageSize;
    return end > this.data.length ? this.data.length : end;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
