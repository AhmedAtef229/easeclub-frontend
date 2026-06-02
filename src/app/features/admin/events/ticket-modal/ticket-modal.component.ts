import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketType, CreateTicketCommand, TicketCategory } from '../events.model';

@Component({
  selector: 'app-ticket-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ticket-modal.component.html',
})
export class TicketModalComponent implements OnInit {
  @Input() ticket: TicketType | null = null;
  @Input() eventId!: string;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateTicketCommand>();

  form!: FormGroup;

  categories: TicketCategory[] = ['Member', 'Guest', 'FamilyMember', 'Public'];
  genderOptions = ['Any', 'Male', 'Female'];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      category: [this.ticket?.category || 'Member', Validators.required],
      basePrice: [this.ticket?.basePrice ?? 0, [Validators.required, Validators.min(0)]],
      totalQuantity: [this.ticket?.totalQuantity ?? 20, [Validators.required, Validators.min(1)]],
      maxPerMember: [this.ticket?.maxPerMember ?? null],
      requiresMembership: [this.ticket?.requiresMembership ?? false],
      minAge: [this.ticket?.minAge ?? null],
      maxAge: [this.ticket?.maxAge ?? null],
      genderRestriction: [this.ticket?.genderRestriction || 'Any'],
    });
  }

  setCategory(cat: TicketCategory) {
    this.form.patchValue({ category: cat });
    if (cat === 'Member' || cat === 'Public') {
      this.form.patchValue({ maxPerMember: null });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;
    const isGuestOrFamily = v.category === 'Guest' || v.category === 'FamilyMember';
    this.save.emit({
      eventId: this.eventId,
      category: v.category,
      basePrice: +v.basePrice,
      totalQuantity: +v.totalQuantity,
      maxPerMember: isGuestOrFamily && v.maxPerMember ? +v.maxPerMember : null,
      requiresMembership: v.category === 'Member' || v.category === 'FamilyMember',
      minAge: null,
      maxAge: null,
      genderRestriction: null,
    });
  }
}
