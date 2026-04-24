import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { TablesComponent, TableColumn } from '../../../shared/components/tables/tables.component';
import { MembershipPlanModalComponent } from '../../../shared/components/modals/membership-plan-modal/membership-plan-modal.component';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { InstallmentPlanModalComponent } from '../../../shared/components/modals/installment-plan-modal/installment-plan-modal.component';
import { MembershipPlansService } from '../../../core/services/api/membership-plans.service';
import { BranchService } from '../../../core/services/api/branches.service';

@Component({
  selector: 'app-membership-plans',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    TablesComponent,
    MembershipPlanModalComponent,
    InstallmentPlanModalComponent,
    DropdownComponent,
  ],
  templateUrl: './membership-plans.component.html',
})
export class MembershipPlansComponent implements OnInit {
  constructor(
    private plansService: MembershipPlansService,
    private branchService: BranchService,
  ) {}
  showInstallmentModal: boolean = false;
  selectedPlanForInstallments: any = null;

  clubId!: string;

  columns: TableColumn[] = [
    { key: 'name', label: 'Plan Name' },
    { key: 'membershipTypeName', label: 'Type', type: 'badge' },
    { key: 'price', label: 'Price' },
    { key: 'subscriptionValidityInYears', label: 'Years' },
    { key: 'maxFamilyMembers', label: 'Family Members' },
    { key: 'isActive', label: 'Status', type: 'status' },
  ];

  data: any[] = [];
  filteredData: any[] = [];

  selectedStatus = 'All';

  showModal = false;
  selectedPlan: any = null;

  ngOnInit() {
    this.clubId = this.branchService.getClubId();
    this.loadPlans();
  }

  /* ================= LOAD ================= */

  loadPlans() {
    const filters: any = {};

    if (this.selectedStatus === 'Active') filters.isActive = true;
    if (this.selectedStatus === 'Inactive') filters.isActive = false;

    this.plansService.getAll(this.clubId, filters).subscribe((res) => {
      this.data = res.items;
      this.filteredData = [...this.data];
    });
  }

  onToggleStatus(row: any) {
  row.isActive = !row.isActive;

  // 🔥 هنا تربطه بالـ API بعدين
  console.log('Status toggled:', row);
}
  /* ================= FILTER ================= */

  onStatusChange(value: string) {
    this.selectedStatus = value;
    this.loadPlans();
  }

  /* ================= MODAL ================= */

  openCreateModal() {
    this.selectedPlan = null;
    this.showModal = true;
  }

  onEdit(row: any) {
    this.selectedPlan = row;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  /* ================= SAVE ================= */

 onSavePlan(form: any) {
  console.log('🔥 FORM DATA:', form);

  if (this.selectedPlan) {
    // ================= UPDATE =================
    this.plansService
      .update(this.selectedPlan.id, {
        name: form.name,
        description: form.description || '',
        totalPrice: +form.price,
        installmentTemplateIds: form.templateIds || [],
      })
      .subscribe({
        next: () => {
          this.loadPlans();
          this.closeModal();
        },
        error: (err) => {
          console.error('❌ UPDATE ERROR', err);
        }
      });

  } else {
    // ================= CREATE =================
    this.plansService
      .create(this.clubId, {
        membershipTypeId: form.membershipTypeId,
        name: form.name,
        price: +form.price,
        subscriptionValidityInYears: 1, // ثابت مؤقتًا
        maxFamilyMembers: +form.maxFamilyMembers || 0, // ✅ مهم
        durationInDays: +form.durationInDays || 0,
      })
      .subscribe({
        next: (planId) => {

          // ================= LINK TEMPLATES =================
          if (form.templateIds?.length) {
            this.plansService
              .update(planId, {
                name: form.name,
                description: form.description || '',
                totalPrice: +form.price,
                installmentTemplateIds: form.templateIds,
              })
              .subscribe({
                next: () => {
                  this.loadPlans();
                  this.closeModal();
                },
                error: (err) => {
                  console.error('❌ LINK TEMPLATES ERROR', err);
                }
              });

          } else {
            this.loadPlans();
            this.closeModal();
          }
        },
        error: (err) => {
          console.error('❌ CREATE ERROR', err);
        }
      });
  }
}
}
