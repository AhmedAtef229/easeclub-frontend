import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-installment-plan-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './installment-plan-modal.component.html',
})
export class InstallmentPlanModalComponent {

  @Input() plan: any;

  @Output() close = new EventEmitter<void>();


  templates = [
    {
      title: '3 Monthly Installments',
      subtitle: '3 installments over 90 days',
      rows: [
        { num: 1, percent: '33.33%', amount: '$399.96', due: 0 },
        { num: 2, percent: '33.33%', amount: '$399.96', due: 30 },
        { num: 3, percent: '33.34%', amount: '$400.08', due: 60 },
      ],
    },
    {
      title: '6 Month Payment Plan',
      subtitle: '6 installments over 180 days',
      rows: [
        { num: 1, percent: '16.67%', amount: '$200.04', due: 0 },
        { num: 2, percent: '16.67%', amount: '$200.04', due: 30 },
        { num: 3, percent: '16.67%', amount: '$200.04', due: 60 },
        { num: 4, percent: '16.67%', amount: '$200.04', due: 90 },
        { num: 5, percent: '16.67%', amount: '$200.04', due: 120 },
        { num: 6, percent: '16.65%', amount: '$199.80', due: 150 },
      ],
    },
    {
      title: 'Full Payment',
      subtitle: '1 installments over 1 days',
      rows: [
        { num: 1, percent: '100%', amount: '$1200', due: 0 },
      ],
    },
  ];


  closeModal() {
    this.close.emit();
  }

}
