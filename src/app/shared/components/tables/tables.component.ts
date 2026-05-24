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
  @Input() currentPage: number = 1;
  @Input() serverSide: boolean = false;
  @Input() totalCount?: number;
  @Input() itemLabel: string = 'items';
  @Input() borderless: boolean = false;

  @Output() edit = new EventEmitter<any>();
  @Output() view = new EventEmitter<any>();
  @Output() copy = new EventEmitter<any>();
  @Output() toggleStatus = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<number>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !this.serverSide) {
      this.currentPage = 1;
    }
  }

  get paginatedData() {
    if (!this.data) return [];
    if (this.serverSide) return this.data;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.data.slice(start, end);
  }

  get totalPages() {
    const total = this.serverSide ? (this.totalCount || 0) : (this.data?.length || 0);
    return Math.ceil(total / this.pageSize);
  }
  
  get pagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  
  get showingStart() {
    const total = this.serverSide ? (this.totalCount || 0) : (this.data?.length || 0);
    if (total === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }
  
  get showingEnd() {
    const total = this.serverSide ? (this.totalCount || 0) : (this.data?.length || 0);
    if (total === 0) return 0;
    const end = this.currentPage * this.pageSize;
    return end > total ? total : end;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      if (this.serverSide) {
        this.pageChange.emit(page);
      } else {
        this.currentPage = page;
      }
    }
  }
}
