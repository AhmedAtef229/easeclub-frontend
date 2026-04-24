import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {

  @Input() currentPage: number = 1;
  @Input() totalCount: number = 0;
  @Input() pageSize: number = 10;

  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  /* 🔥 أهم جزء */
  get pages(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    pages.push(1);

    if (current > 4) {
      pages.push('...');
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 3) {
      pages.push('...');
    }

    pages.push(total);

    return pages;
  }

isNumber(value: number | string): value is number {
  return typeof value === 'number';
}

changePage(page: number | string) {
  if (!this.isNumber(page)) return;

  if (page < 1 || page > this.totalPages) return;

  this.pageChange.emit(page);
}
}
