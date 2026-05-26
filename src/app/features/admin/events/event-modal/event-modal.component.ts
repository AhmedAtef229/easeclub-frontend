import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Event, CreateEventCommand, EventAccessType } from '../events.model';

@Component({
  selector: 'app-event-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-modal.component.html',
})
export class EventModalComponent implements OnInit {
  @Input() event: Event | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateEventCommand>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.event?.name || '', Validators.required],
      description: [this.event?.description || ''],
      startDate: [this.event ? this.toInputDate(this.event.startDate) : '', Validators.required],
      endDate: [this.event ? this.toInputDate(this.event.endDate) : '', Validators.required],
      venue: [this.event?.venue || ''],
      capacity: [this.event?.capacity || 50, [Validators.required, Validators.min(1)]],
      accessType: [this.event?.accessType || 'MembersOnly', Validators.required],
      imageUrl: [this.event?.imageUrl || ''],
      badge: [this.event?.badge || ''],
    });
  }

  private toInputDate(iso: string): string {
    return iso ? iso.substring(0, 16) : '';
  }

  setAccessType(value: EventAccessType) {
    this.form.patchValue({ accessType: value });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;
    this.save.emit({
      name: v.name,
      description: v.description,
      startDate: v.startDate,
      endDate: v.endDate,
      venue: v.venue,
      capacity: +v.capacity,
      accessType: v.accessType,
      imageUrl: v.imageUrl || null,
      badge: v.badge || null,
    });
  }
}
