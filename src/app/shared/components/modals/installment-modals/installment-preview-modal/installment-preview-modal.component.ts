import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-installment-preview-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './installment-preview-modal.component.html',
})
export class InstallmentPreviewModalComponent {

  @Input() installments: any[] = [];
  @Input() totalAmount: number = 1000; // example amount

  @Output() close = new EventEmitter<void>();

  /* ================= HELPERS ================= */

  get totalInstallments(): number {
    return this.installments.length;
  }

  get maxDuration(): number {
    if (!this.installments.length) return 0;
    return Math.max(...this.installments.map(i => i.dueAfterDays));
  }

  calculateAmount(percentage: number): number {
    return (percentage / 100) * this.totalAmount;
  }
}
