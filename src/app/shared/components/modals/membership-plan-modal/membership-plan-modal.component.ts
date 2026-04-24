import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { MembershipTypesService } from '../../../../core/services/api/membership-types.service';
import { InstallmentTemplatesService } from '../../../../core/services/api/installment-templates.service';
import { BranchService } from '../../../../core/services/api/branches.service';

@Component({
  selector: 'app-membership-plan-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './membership-plan-modal.component.html',
})
export class MembershipPlanModalComponent implements OnInit {

  @Input() plan: any = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  form!: FormGroup;

  membershipTypes: any[] = [];
  installmentTemplates: any[] = [];

  clubId!: string;

  constructor(
    private fb: FormBuilder,
    private membershipTypesService: MembershipTypesService,
    private installmentService: InstallmentTemplatesService,
    private branchService: BranchService
  ) {}

  ngOnInit() {
    this.clubId = this.branchService.getClubId();

    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      membershipTypeId: ['', Validators.required],
      price: ['', Validators.required],
      durationInDays: [''],
      isActive: [true],
      templateIds: [[]],
    });

    this.loadMembershipTypes();
    this.loadTemplates();
  }

  loadMembershipTypes() {
    this.membershipTypesService.getMembershipTypes().subscribe((res: any) => {
      this.membershipTypes = res?.items || res || [];
    });
  }

  loadTemplates() {
    this.installmentService.getAll(this.clubId).subscribe((res: any) => {
      this.installmentTemplates = res || [];
    });
  }

  toggleTemplate(id: string) {
    const current = this.form.value.templateIds || [];

    this.form.patchValue({
      templateIds: current.includes(id)
        ? current.filter((x: string) => x !== id)
        : [...current, id]
    });
  }

  isChecked(id: string) {
    return (this.form.value.templateIds || []).includes(id);
  }

submit() {
  console.log('🔥 SUBMIT CLICKED', this.form.value);

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.save.emit(this.form.value);
}
}
