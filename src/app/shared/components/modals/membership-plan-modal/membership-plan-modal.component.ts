import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-membership-plan-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './membership-plan-modal.component.html',
})
export class MembershipPlanModalComponent {

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  form: FormGroup;

  installmentTemplates = [
    { id: 1, name: '3 Monthly Installments', installments: 3, duration: '90 days' },
    { id: 2, name: '6 Month Payment Plan', installments: 6, duration: '180 days' },
    { id: 3, name: 'Custom Quarterly', installments: 3 },
    { id: 4, name: 'Full Payment', installments: 1, duration: '1 day' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      membershipType: ['', Validators.required],
      price: ['', Validators.required],
      duration: ['', Validators.required],
      active: [true],
      templates: [[]],
    });
  }

  toggleTemplate(id: number) {
    const current = this.form.value.templates as number[];

    if (current.includes(id)) {
      this.form.patchValue({
        templates: current.filter(x => x !== id),
      });
    } else {
      this.form.patchValue({
        templates: [...current, id],
      });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.form.value);
    this.close.emit();
  }
}
