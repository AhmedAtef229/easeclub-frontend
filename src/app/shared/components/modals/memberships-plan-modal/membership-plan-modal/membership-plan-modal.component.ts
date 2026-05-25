import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MembershipTypesService } from '../../../../../core/services/api/membership-types.service';
import { InstallmentTemplatesService } from '../../../../../core/services/api/installment-templates.service';
import { BranchService } from '../../../../../core/services/api/branches.service';
import { ApplicationTemplateService } from '../../../../../core/services/api/application-templates.service';
import { FormDropdownComponent } from '../../../form-dropdown/form-dropdown.component';

@Component({
  selector: 'app-membership-plan-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormDropdownComponent],
  templateUrl: './membership-plan-modal.component.html',
})
export class MembershipPlanModalComponent implements OnInit {
  @Input() plan: any = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  form!: FormGroup;

  membershipTypes: any[] = [];
  installmentTemplates: any[] = [];
  applicationTemplates: any[] = [];

  clubId!: string;

  get membershipTypeOptions() {
    return this.membershipTypes.map(t => ({ value: t.id, label: t.name }));
  }

  get applicationTemplateOptions() {
    return this.applicationTemplates.map(t => ({ value: t.id, label: t.name }));
  }

  constructor(
    private fb: FormBuilder,
    private membershipTypesService: MembershipTypesService,
    private installmentService: InstallmentTemplatesService,
    private branchService: BranchService,
    private applicationTemplateService: ApplicationTemplateService,
  ) {}

  ngOnInit() {
    this.clubId = this.branchService.getClubId();

    this.form = this.fb.group({
      name: [this.plan?.name || '', Validators.required],
      description: [this.plan?.description || ''],
      membershipTypeId: [this.plan?.membershipTypeId || '', Validators.required],
      price: [this.plan?.price || '', Validators.required],
      renewPrice: [this.plan?.renewPrice || ''],
      subscriptionValidityInYears: [
        this.plan?.subscriptionValidityInYears || 1,
        Validators.required,
      ],
      maxFamilyMembers: [this.plan?.maxFamilyMembers || 0],
      durationInDays: [this.plan?.durationInDays || 0, Validators.required],
      enrollmentMode: [this.plan?.enrollmentMode || 'DirectPay', Validators.required],
      applicationTemplateId: [this.plan?.applicationTemplateId || ''],
      paymentMode: [this.plan?.paymentMode || 'Cash', Validators.required],
      installmentsAllowedInRenewal: [this.plan?.installmentsAllowedInRenewal || false],
      isActive: [this.plan?.isActive ?? true],
      templateIds: [this.plan?.installmentTemplateIds || []],
    });

    this.loadMembershipTypes();
    this.loadTemplates();

    // Listen to enrollment mode changes
    this.form.get('enrollmentMode')?.valueChanges.subscribe(mode => {
      this.handleEnrollmentModeChange(mode);
    });

    // Initialize state
    const initialMode = this.form.get('enrollmentMode')?.value;
    if (initialMode) {
      this.handleEnrollmentModeChange(initialMode);
    }
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

  handleEnrollmentModeChange(mode: string) {
    const templateControl = this.form.get('applicationTemplateId');
    if (mode === 'ApplicationForm') {
      templateControl?.setValidators([Validators.required]);
      this.loadApplicationTemplates();
    } else {
      templateControl?.clearValidators();
      templateControl?.setValue('');
    }
    templateControl?.updateValueAndValidity();
  }

  loadApplicationTemplates() {
    if (this.applicationTemplates.length > 0) return;

    this.applicationTemplateService.getTemplates(this.clubId).subscribe((res: any) => {
      this.applicationTemplates = res?.items || res || [];
    });
  }

  toggleTemplate(id: string) {
    const current = this.form.value.templateIds || [];

    this.form.patchValue({
      templateIds: current.includes(id)
        ? current.filter((x: string) => x !== id)
        : [...current, id],
    });
  }

  isChecked(id: string) {
    return (this.form.value.templateIds || []).includes(id);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.form.value);
  }
}
