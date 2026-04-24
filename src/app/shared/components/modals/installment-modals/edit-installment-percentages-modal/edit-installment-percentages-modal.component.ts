import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-edit-installment-percentages-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-installment-percentages-modal.component.html',
})
export class EditInstallmentPercentagesModalComponent implements OnChanges {

  @Input() installments: any[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any[]>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      items: this.fb.array([])
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['installments'] && this.installments) {
      this.setForm();
    }
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  setForm() {
    this.items.clear();

    this.installments.forEach((inst) => {
      this.items.push(
        this.fb.group({
          percentage: [inst.percentage, [Validators.required]],
          dueAfterDays: [inst.dueAfterDays],
        })
      );
    });
  }

  getTotal(): number {
    return this.items.controls.reduce((sum, ctrl) => {
      return sum + Number(ctrl.value.percentage || 0);
    }, 0);
  }

  submit() {
    if (this.form.invalid || this.getTotal() !== 100) {
      alert('Total must equal 100%');
      return;
    }

    const result = this.items.value.map((item: any, index: number) => ({
      order: index + 1,
      percentage: +item.percentage,
      dueAfterDays: item.dueAfterDays
    }));

    this.save.emit(result);
  }
}
