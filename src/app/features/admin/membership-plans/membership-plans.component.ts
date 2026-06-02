import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { TablesComponent, TableColumn } from '../../../shared/components/tables/tables.component';
import { MembershipPlanModalComponent } from '../../../shared/components/modals/memberships-plan-modal/membership-plan-modal/membership-plan-modal.component';
import { MembershipPlanEditModalComponent } from '../../../shared/components/modals/memberships-plan-modal/membership-plan-edit-modal/membership-plan-edit-modal.component';
import { MembershipPlanLinkModalComponent } from '../../../shared/components/modals/memberships-plan-modal/membership-plan-link-modal/membership-plan-link-modal.component';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { InstallmentPlanModalComponent } from '../../../shared/components/modals/installment-plan-modal/installment-plan-modal.component';
import { CardTableWrapperComponent } from '../../../shared/components/card-table-wrapper/card-table-wrapper.component';
import {
  MembershipPlansService,
  MembershipPlan,
  CreatePlanDto,
  UpdatePlanDto,
} from '../../../core/services/api/membership-plans.service';
import { BranchService } from '../../../core/services/api/branches.service';

type StatusFilter = 'All' | 'Active' | 'Inactive';

@Component({
  selector: 'app-membership-plans',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    TablesComponent,
    CardTableWrapperComponent,
    MembershipPlanModalComponent,
    MembershipPlanEditModalComponent,
    MembershipPlanLinkModalComponent,
    InstallmentPlanModalComponent,
    DropdownComponent,
  ],
  templateUrl: './membership-plans.component.html',
})
export class MembershipPlansComponent implements OnInit {
  constructor(
    private plansService: MembershipPlansService,
    private branchService: BranchService,
    private cdr: ChangeDetectorRef,
  ) {}

  /* ================= STATE ================= */

  clubId!: string;

  data: MembershipPlan[] = [];
  filteredData: MembershipPlan[] = [];

  selectedStatus: StatusFilter = 'All';

  showModal = false;
  showEditModal = false;
  showLinkModal = false;
  selectedPlan: MembershipPlan | null = null;

  showInstallmentModal = false;
  selectedPlanForInstallments: MembershipPlan | null = null;

  /* ================= TABLE ================= */

  columns: TableColumn[] = [
    { key: 'name', label: 'Plan Name' },
    { key: 'membershipTypeName', label: 'Type', type: 'badge' },
    { key: 'price', label: 'Price', type: 'currency' },
    { key: 'renewPrice', label: 'Renew Price', type: 'currency' },
    { key: 'maxFamilyMembers', label: 'Max Family Members' },
    { key: 'paymentMode', label: 'Payment Mode', type: 'pill' },
    { key: 'maxPaymentPeriodInDays', label: 'Max Payment Duration', type: 'text' },
    { key: 'installmentsAllowedInRenewal', label: 'Installment in Renew', type: 'boolean' },
    { key: 'subscriptionValidityInYears', label: 'Validity (Years)', suffix: 'year' },
    { key: 'enrollmentMode', label: 'Enrollment Mode', type: 'pill' },
    { key: 'isActive', label: 'Status', type: 'status' },
  ];

  /* ================= INIT ================= */

  ngOnInit(): void {
    this.clubId = this.branchService.getClubId();
    this.loadPlans();
  }

  /* ================= FILTER ================= */

  onStatusChange(value: string): void {
    const v = value as StatusFilter;

    if (v === 'All' || v === 'Active' || v === 'Inactive') {
      this.selectedStatus = v;
      this.loadPlans();
    }
  }

  /* ================= LOAD ================= */

  loadPlans(): void {
    const filters: any = {
      page: 1,
      limit: 50,
    };

    if (this.selectedStatus === 'Active') filters.isActive = true;
    if (this.selectedStatus === 'Inactive') filters.isActive = false;

    this.plansService.getAll(this.clubId, filters).subscribe({
      next: (res) => {
        // Use setTimeout to avoid NG0901 ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.data = (res.items || []).map((item: MembershipPlan) => ({
            ...item,
            // Convert to array because Table component expects array for 'badge' type
            membershipTypeName: item.membershipTypeName ? [item.membershipTypeName] : [],
            // Backend returns misspelled 'installmentsAllowdInRenewal' — normalize to correct spelling
            installmentsAllowedInRenewal:
              item.installmentsAllowedInRenewal ?? (item as any).installmentsAllowdInRenewal ?? false,
            maxPaymentPeriodInDays: item.maxPaymentPeriodInDays ?? 0,
          }));

          this.filteredData = [...this.data];
        });
      },
      error: (err) => console.error('API ERROR:', err),
    });
  }

  /* ================= STATUS TOGGLE ================= */

  onToggleStatus(row: MembershipPlan): void {
    this.plansService.toggleStatus(row.id).subscribe({
      next: () => this.loadPlans(),
      error: (err) => {
        console.error('Failed to toggle status', err);
      }
    });
  }

  /* ================= MODAL ================= */

  openCreateModal(): void {
    this.selectedPlan = null;
    this.showModal = true;
  }

  onEdit(row: MembershipPlan): void {
    // 🟢 جلب البيانات كاملة لأن قائمة الـ GET لا ترجع كل الحقول (مثل renewPrice و membershipTypeId)
    this.plansService.getById(row.id).subscribe({
      next: (fullPlan) => {
        this.selectedPlan = fullPlan;
        this.showEditModal = true;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('GET DETAILS ERROR', err),
    });
  }

  onManageTemplates(row: MembershipPlan): void {
    this.plansService.getById(row.id).subscribe({
      next: (fullPlan) => {
        this.selectedPlan = fullPlan;
        this.showLinkModal = true;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('GET DETAILS ERROR', err),
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.showEditModal = false;
    this.showLinkModal = false;
    this.cdr.detectChanges();
  }

  /* ================= SAVE ================= */

  onSavePlan(form: any): void {
    const years = +form.subscriptionValidityInYears || 1;
    const body: CreatePlanDto = {
      membershipTypeId: form.membershipTypeId,
      name: form.name,
      price: +form.price,
      renewPrice: +form.renewPrice || 0,
      subscriptionValidityInYears: years,
      maxFamilyMembers: +form.maxFamilyMembers || 0,
      durationInDays: +form.maxPaymentPeriodInDays,
      enrollmentMode: form.enrollmentMode,
      applicationTemplateId: form.enrollmentMode === 'ApplicationForm' ? form.applicationTemplateId : undefined,
      paymentMode: form.paymentMode,
      installmentTemplateIds: form.paymentMode === 'Cash' ? [] : (form.installmentTemplateIds || []),
      installmentsAllowedInRenewal: form.installmentsAllowedInRenewal || false,
    };

    this.plansService.create(this.clubId, body).subscribe({
      next: (planId: string) => {
        if (body.paymentMode !== 'Cash' && body.installmentTemplateIds?.length) {
          this.plansService
            .updateInstallmentTemplates(planId, body.installmentTemplateIds)
            .subscribe({
              next: () => {
                this.loadPlans();
                this.closeModal();
              },
              error: (err) => {
                console.error('TEMPLATES ERROR', err);
                alert(`Plan created, but failed to link installment templates: ${err.error?.message || err.error || err.message || 'Unknown error'}`);
                this.loadPlans();
                this.closeModal();
              },
            });
        } else {
          this.loadPlans();
          this.closeModal();
        }
      },
      error: (err) => {
        console.error('CREATE ERROR', err);
        alert(`Failed to create plan: ${err.error?.message || err.error || err.message || 'Unknown error'}`);
      },
    });
  }

  onSaveEdit(form: any): void {
    if (!this.selectedPlan) return;

    const body: UpdatePlanDto = {
      name: form.name,
      description: form.description || this.selectedPlan.description || '',
      totalPrice: +form.price || this.selectedPlan.price,
      renewPrice: +form.renewPrice || this.selectedPlan.renewPrice || this.selectedPlan.price,
    };

    this.plansService.update(this.selectedPlan.id, body).subscribe({
      next: () => {
        this.loadPlans();
        this.closeModal();
      },
      error: (err) => {
        console.error('UPDATE ERROR DETAILS:', err.error);
        alert(`Failed to update plan: ${err.error?.message || err.error || err.message || 'Unknown error'}`);
      },
    });
  }

  onSaveLink(templateIds: string[]): void {
    if (!this.selectedPlan) return;

    this.plansService.updateInstallmentTemplates(this.selectedPlan.id, templateIds).subscribe({
      next: () => {
        this.loadPlans();
        this.closeModal();
      },
      error: (err) => {
        console.error('LINK TEMPLATES ERROR', err);
        alert(`Failed to update installment templates: ${err.error?.message || err.error || err.message || 'Unknown error'}`);
      },
    });
  }
}
