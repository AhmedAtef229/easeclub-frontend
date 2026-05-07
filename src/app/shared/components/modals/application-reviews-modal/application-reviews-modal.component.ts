import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-application-reviews-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './application-reviews-modal.component.html',
})
export class ApplicationReviewsModalComponent {

  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  // 👇 بيانات تجريبية (بعد كده تربطها بالـ API)
  @Input() data: any = {
    name: 'John Smith',
    email: 'john.smith@email.com',
    plan: 'Annual Gold Membership',
    submittedOn: 'February 10, 2025 02:00',

    personalInfo: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      dob: 'June 15, 1985'
    },

    membership: {
      type: 'Family',
      trainer: true
    }
  };

  // 👇 التحكم في الخطوات
  activeStep: number = 1;

  setStep(step: number) {
    this.activeStep = step;
  }

  closeModal() {
    this.close.emit();
  }

  installments = [
  {
    number: 1,
    dueDate: 'February 10, 2025',
    amount: '$1000.00',
    status: 'Pending',
  },
  {
    number: 2,
    dueDate: 'March 12, 2025',
    amount: '$1000.00',
    status: 'Pending',
  },
];
}
