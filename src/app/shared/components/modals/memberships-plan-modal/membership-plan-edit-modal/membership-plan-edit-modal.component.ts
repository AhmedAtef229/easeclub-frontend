import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MembershipPlan } from '../../../../../core/services/api/membership-plans.service';

@Component({
  selector: 'app-membership-plan-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './membership-plan-edit-modal.component.html',
})
export class MembershipPlanEditModalComponent implements OnInit {
  @Input() plan!: MembershipPlan;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.plan.name, Validators.required],
      description: [this.plan.description || ''],
      price: [this.plan.price, Validators.required],
      renewPrice: [this.plan.renewPrice || 0, Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.value);
  }
}
