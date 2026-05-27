import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-branch-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './branch-modal.component.html',
})
export class BranchModalComponent implements OnInit {

  @Input() data: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {

    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      address: ['', Validators.required]
    });

    if (this.data) {

      this.form.patchValue({
        id: this.data.id,
        name: this.data.name,
        address: this.data.address
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
