import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  FormArray
} from '@angular/forms';

@Component({
  selector: 'app-installment-template-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './installments-template-modal.component.html',
})
export class InstallmentTemplateModalComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  mode: 'auto' | 'manual' = 'auto';

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {

    this.form = this.fb.group({
      name: ['', Validators.required],
      installmentsCount: [null],
      durationDays: [null],
      installments: this.fb.array([])
    });

    this.applyModeValidation();
  }

  /* ================= FORM ARRAY ================= */

  get installments(): FormArray {
    return this.form.get('installments') as FormArray;
  }

  addInstallment() {

    const installment = this.fb.group({
      percentage: ['', Validators.required],
      dueAfter: [0, Validators.required]
    });

    this.installments.push(installment);
  }

  removeInstallment(index: number) {
    this.installments.removeAt(index);
  }

  /* ================= MODE ================= */

  setMode(mode: 'auto' | 'manual') {
    this.mode = mode;
    this.applyModeValidation();
  }

  applyModeValidation() {

    const countCtrl = this.form.get('installmentsCount');
    const durationCtrl = this.form.get('durationDays');

    if (this.mode === 'auto') {

      countCtrl?.setValidators([Validators.required, Validators.min(1)]);
      durationCtrl?.setValidators([Validators.required, Validators.min(1)]);

    } else {

      countCtrl?.clearValidators();
      durationCtrl?.clearValidators();

      countCtrl?.setValue(null);
      durationCtrl?.setValue(null);
    }

    countCtrl?.updateValueAndValidity();
    durationCtrl?.updateValueAndValidity();
  }

  /* ================= VALIDATION ================= */

  isInvalid(controlName: string): boolean {

    const ctrl = this.form.get(controlName);

    return !!(ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty));
  }

  /* ================= SAVE ================= */

  onSave() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit({
      ...this.form.value,
      mode: this.mode
    });

    this.close.emit();
  }

}
