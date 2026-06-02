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
  selectedPlanDurationDays = 0;

  clubId!: string;

  get membershipTypeOptions() {
    return this.membershipTypes.map(t => ({ value: t.id, label: t.name }));
  }

  get applicationTemplateOptions() {
    const maxFamily = +(this.form?.get('maxFamilyMembers')?.value) || 0;
    let templates = this.applicationTemplates;
    if (maxFamily > 0) {
      templates = templates.filter((t: any) => t.supportsFamilyPlans === true);
    }
    return templates.map((t: any) => ({ value: t.id, label: t.name }));
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
    this.selectedPlanDurationDays =
      +(this.plan?.maxPaymentPeriodInDays ?? this.plan?.durationInDays ?? 0) || 0;

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
      maxPaymentPeriodInDays: [this.plan?.maxPaymentPeriodInDays || 0, Validators.required],
      enrollmentMode: [this.plan?.enrollmentMode || 'DirectPay', Validators.required],
      applicationTemplateId: [this.plan?.applicationTemplateId || ''],
      paymentMode: [this.plan?.paymentMode || 'Cash', Validators.required],
      installmentsAllowedInRenewal: [this.plan?.installmentsAllowedInRenewal || false],
      isActive: [this.plan?.isActive ?? true],
      installmentTemplateIds: [this.plan?.installmentTemplateIds || []],
    });

    this.loadMembershipTypes();
    this.loadTemplates();

    // Listen to enrollment mode changes
    this.form.get('enrollmentMode')?.valueChanges.subscribe(mode => {
      this.handleEnrollmentModeChange(mode);
    });

    // Listen to payment mode changes to clear installment templates if Cash
    this.form.get('paymentMode')?.valueChanges.subscribe(mode => {
      if (mode === 'Cash') {
        this.form.get('installmentTemplateIds')?.setValue([]);
      }
    });

    // Live-validate template compatibility on any form value change
    this.form.valueChanges.subscribe(() => {
      this.validateTemplateCompatibility();
      this.validateInstallmentTemplateSelection();
      this.enforceFamilyPlanEnrollmentMode();
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
      this.validateInstallmentTemplateSelection();
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
      // Re-validate after templates are loaded
      this.validateTemplateCompatibility();
    });
  }

  validateTemplateCompatibility() {
    const templateControl = this.form.get('applicationTemplateId');
    if (!templateControl) return;

    const maxFamily = +(this.form.get('maxFamilyMembers')?.value) || 0;
    const selectedTemplateId = templateControl.value;

    if (!selectedTemplateId || maxFamily === 0) {
      // Remove error if no mismatch condition
      if (templateControl.hasError('requiresFamilySupport')) {
        const errors = { ...templateControl.errors };
        delete errors['requiresFamilySupport'];
        templateControl.setErrors(Object.keys(errors).length ? errors : null);
      }
      return;
    }

    const selectedTemplate = this.applicationTemplates.find((t: any) => t.id === selectedTemplateId);
    if (selectedTemplate && selectedTemplate.supportsFamilyPlans === false) {
      templateControl.setErrors({
        ...(templateControl.errors || {}),
        requiresFamilySupport: true,
      });
    } else {
      if (templateControl.hasError('requiresFamilySupport')) {
        const errors = { ...templateControl.errors };
        delete errors['requiresFamilySupport'];
        templateControl.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
  }

  validateInstallmentTemplateSelection() {
    const control = this.form.get('installmentTemplateIds');
    if (!control) return;

    const paymentMode = this.form.get('paymentMode')?.value;
    const selectedIds = control.value || [];
    const selectedTemplates = this.installmentTemplates.filter((t: any) =>
      selectedIds.includes(t.id),
    );

    const durationLimit =
      this.selectedPlanDurationDays || +(this.form.get('maxPaymentPeriodInDays')?.value) || 0;
    const exceedsDuration = selectedTemplates.some((template: any) => {
      const templateDuration =
        +(template?.durationOfPaymentInDays ?? template?.durationInDays ?? 0) || 0;
      return durationLimit > 0 && templateDuration > durationLimit;
    });

    const errors = { ...(control.errors || {}) };

    if (paymentMode === 'Installments' && selectedIds.length === 0) {
      errors['required'] = true;
    } else {
      delete errors['required'];
    }

    if (exceedsDuration) {
      errors['templateDurationExceedsPlanDuration'] = true;
    } else {
      delete errors['templateDurationExceedsPlanDuration'];
    }

    control.setErrors(Object.keys(errors).length ? errors : null);
  }

  enforceFamilyPlanEnrollmentMode() {
    const maxFamily = +(this.form.get('maxFamilyMembers')?.value) || 0;
    const enrollmentMode = this.form.get('enrollmentMode');

    if (!enrollmentMode) return;

    if (maxFamily > 0 && enrollmentMode.value !== 'ApplicationForm') {
      enrollmentMode.setValue('ApplicationForm', { emitEvent: false });
      enrollmentMode.markAsDirty();
      enrollmentMode.updateValueAndValidity({ emitEvent: false });
      this.handleEnrollmentModeChange('ApplicationForm');
    }
  }

  toggleTemplate(id: string) {
    const current = this.form.value.installmentTemplateIds || [];

    this.form.patchValue({
      installmentTemplateIds: current.includes(id)
        ? current.filter((x: string) => x !== id)
        : [...current, id],
    });
  }

  isChecked(id: string) {
    return (this.form.value.installmentTemplateIds || []).includes(id);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.form.value);
  }
}
