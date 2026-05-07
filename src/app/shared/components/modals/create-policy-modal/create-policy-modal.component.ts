import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-policy-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-policy-modal.component.html',
})
export class CreatePolicyModalComponent {

  /* ================= MODE ================= */
  @Input() mode: 'create' | 'edit' = 'create';

  @Input() data: any = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  /* ================= FORM ================= */

  form: any = {
    name: '',
    type: 'discount', // discount | increase
    method: 'fixed',  // fixed | percentage
    amount: null,
    percentage: null,
    multiplierSource: 'BaseFee',
    conditions: []
  };

  ngOnInit() {
    if (this.mode === 'edit' && this.data) {
      this.form = { ...this.data };
    }
  }

  /* ================= ACTIONS ================= */

  onSubmit() {
    this.save.emit(this.form);
  }

  onClose() {
    this.close.emit();
  }

  addCondition() {
    this.form.conditions.push({
      field: '',
      operator: '',
      value: ''
    });
  }

  removeCondition(index: number) {
    this.form.conditions.splice(index, 1);
  }
}
