import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormDropdownComponent } from '../../form-dropdown/form-dropdown.component';

@Component({
  selector: 'app-create-policy-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, FormDropdownComponent],
  templateUrl: './create-policy-modal.component.html',
})
export class CreatePolicyModalComponent {

  multiplierSourceOptions = [
    { value: 'BaseFee', label: 'Base Fee' },
    { value: 'Total', label: 'Total' }
  ];

  operatorOptions = [
    { value: 'Equals', label: 'Equals' },
    { value: 'NotEquals', label: 'Not Equals' },
    { value: 'GreaterThan', label: 'Greater Than' },
    { value: 'LessThan', label: 'Less Than' }
  ];

  targetTypeOptions = [
    { value: 'Event', label: 'Event' },
    { value: 'Template', label: 'Application Template' }
  ];

  eventFieldKeyOptions = [
    { value: 'attendeeCategory', label: 'Attendee Category' },
    { value: 'ticketBasePrice', label: 'Ticket Base Price' },
    { value: 'attendeeAge', label: 'Attendee Age' },
    { value: 'attendeeGender', label: 'Attendee Gender' },
    { value: 'attendeeCount', label: 'Attendee Count' },
    { value: 'guestCount', label: 'Guest Count' },
    { value: 'familyMemberCount', label: 'Family Member Count' },
    { value: 'isMember', label: 'Is Member' },
  ];

  /* ================= MODE ================= */
  @Input() mode: 'create' | 'edit' = 'create';

  @Input() data: any = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  /* ================= FORM ================= */

  form: any = {
    name: '',
    type: 'discount', // discount | increase
    targetType: 'Event', // Event | Template
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
