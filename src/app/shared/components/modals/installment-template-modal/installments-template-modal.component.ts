import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-installment-template-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './installments-template-modal.component.html',
})
export class InstallmentTemplateModalComponent implements OnInit {

  @Input() data: any = null;
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
      installments: [[]],
    });

    if (this.data) {
      this.form.patchValue(this.data);
      this.mode = this.data.mode ?? 'auto';
    }

    this.applyModeValidation();
  }

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

  isInvalid(controlName: string): boolean {
    const ctrl = this.form.get(controlName);
    return !!(ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty));
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit({
      ...this.form.value,
      mode: this.mode,
    });

    this.close.emit();
  }
}
