import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

@Component({
  selector: 'app-membership-plan-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './membership-plan-modal.component.html',
})
export class MembershipPlanModalComponent implements OnChanges {

  @Input() plan: any = null;

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['plan']) {
      if (this.plan) {
        this.form.patchValue({
          name: this.plan.name,
          description: '',
          membershipType: this.plan.type,
          price: this.plan.price?.replace('$', ''),
          duration: this.plan.duration?.replace(' days', ''),
          active: this.plan.active,
        });
      } else {
        this.form.reset({
          active: true,
          templates: []
        });
      }
    }
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
  }
}
