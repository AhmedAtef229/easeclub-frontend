import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-membership-type-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './membership-type-modal.component.html',
})
export class MembershipTypeModalComponent implements OnInit {

  @Input() data: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  branches = [
    { id: 1, name: 'Downtown Branch' },
    { id: 2, name: 'Northside Branch' },
    { id: 3, name: 'Westside Branch' },
  ];

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      familyAllowed: [false],
      maxFamilyMembers: [null],
      allBranches: [true],
      selectedBranches: [[]],
    });

    if (this.data) {
      this.form.patchValue(this.data);
    }

    /* Family validation */
    this.form.get('familyAllowed')?.valueChanges.subscribe(enabled => {
      const ctrl = this.form.get('maxFamilyMembers');

      if (enabled) {
        ctrl?.setValidators([Validators.required, Validators.min(1)]);
      } else {
        ctrl?.clearValidators();
        ctrl?.setValue(null);
      }

      ctrl?.updateValueAndValidity();
    });

    /* Branches validation */
    this.form.get('allBranches')?.valueChanges.subscribe(all => {
      const ctrl = this.form.get('selectedBranches');

      if (!all) {
        ctrl?.setValidators([Validators.required]);
      } else {
        ctrl?.clearValidators();
        ctrl?.setValue([]);
      }

      ctrl?.updateValueAndValidity();
    });
  }

  toggleBranch(id: number) {
    const selected = this.form.value.selectedBranches as number[];

    if (selected.includes(id)) {
      this.form.patchValue({
        selectedBranches: selected.filter(b => b !== id),
      });
    } else {
      this.form.patchValue({
        selectedBranches: [...selected, id],
      });
    }
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

    this.save.emit(this.form.value);
    this.close.emit();
  }
}
