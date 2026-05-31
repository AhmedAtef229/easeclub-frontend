import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { TablesComponent, TableColumn } from '../../../shared/components/tables/tables.component';
import { InstallmentTemplateModalComponent } from '../../../shared/components/modals/installment-modals/installment-template-modal/installments-template-modal.component';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { InstallmentPreviewModalComponent } from '../../../shared/components/modals/installment-modals/installment-preview-modal/installment-preview-modal.component';
import { EditInstallmentPercentagesModalComponent } from '../../../shared/components/modals/installment-modals/edit-installment-percentages-modal/edit-installment-percentages-modal.component';
import {
  InstallmentTemplatesService,
  InstallmentTemplate,
  Installment,
} from '../../../core/services/api/installment-templates.service';

import { BranchService } from '../../../core/services/api/branches.service';

@Component({
  selector: 'app-installment-templates',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    TablesComponent,
    InstallmentTemplateModalComponent,
    DropdownComponent,
    InstallmentPreviewModalComponent,
    EditInstallmentPercentagesModalComponent,
  ],
  templateUrl: './installment-templates.component.html',
})
export class InstallmentTemplatesComponent implements OnInit {

  constructor(
    private installmentService: InstallmentTemplatesService,
    private branchService: BranchService,
  ) {}

  clubId!: string;

  data: any[] = [];
  filteredData: any[] = [];

  selectedStatus = 'All';

  // 🔥 Preview
  showPreviewModal = false;
  previewInstallments: any[] = [];

  // 🔥 Edit
  showEditPercentagesModal = false;
  editInstallments: any[] = [];
  selectedTemplateId: string = '';

  // 🔥 Create Modal
  showModal = false;


  // 🔥 Plans Dropdown
planOptions: string[] = ['All Plans'];
selectedPlanLabel: string = 'All Plans';

// 🔥 Status Filter
onStatusChange(value: string) {
  this.selectedStatus = value;
  this.applyFilters(); // مش loadTemplates عشان أسرع
}

// 🔥 Plan Filter (حالياً شكلي بس لحد ما الباك يدعمه)
onPlanChange(value: string) {
  this.selectedPlanLabel = value;

  // لو الباك بيدعم planId مستقبلاً:
  // this.loadTemplates();

  // حالياً مفيش فلترة حقيقية
}

  columns: TableColumn[] = [
    { key: 'name', label: 'Template Name' },
    { key: 'installments', label: 'Num of Installments' },
    { key: 'duration', label: 'Max Duration of Payment' },
    { key: 'isActive', label: 'Status', type: 'status' },
    { key: 'createdAt', label: 'Created At' },
    { key: 'updatedAt', label: 'Updated At' },
  ];

  ngOnInit() {
    this.clubId = this.branchService.getClubId();
    this.loadTemplates();
  }

  /* ================= LOAD ================= */

  loadTemplates() {
    this.installmentService.getAll(this.clubId).subscribe({
      next: (res) => {

        this.data = res.map((item) => ({
          id: item.id,
          name: item.name,
          installments: item.numOfInstallments,
          duration: item.durationOfPaymentInDays + ' days',
          isActive: item.isActive,
          createdAt: item.createdAt?.slice(0, 10),
          updatedAt: item.updatedAt?.slice(0, 10),
        }));

        this.applyFilters();
      }
    });
  }

  applyFilters() {
    let filtered = this.data;

    if (this.selectedStatus === 'Active') {
      filtered = filtered.filter(i => i.isActive);
    } else if (this.selectedStatus === 'Inactive') {
      filtered = filtered.filter(i => !i.isActive);
    }

    this.filteredData = [...filtered];
  }

  /* ================= ACTIONS ================= */

  // 👁 VIEW
  onView(row: any) {
    this.installmentService.getById(row.id).subscribe((res) => {
      this.previewInstallments = res.installments;
      this.showPreviewModal = true;
    });
  }

  // ✏️ EDIT
  onEdit(row: any) {
    this.selectedTemplateId = row.id;

    this.installmentService.getById(row.id).subscribe((res) => {
      this.editInstallments = res.installments;
      this.showEditPercentagesModal = true;
    });
  }

  // 🔄 TOGGLE STATUS
  onToggleStatus(row: any) {
    this.installmentService.toggleStatus(row.id).subscribe({
      next: () => this.loadTemplates(),
      error: (err) => console.error('Failed to toggle status', err),
    });
  }

  // 💾 SAVE EDIT
  onSaveEditInstallments(updated: any[]) {
    this.installmentService
      .updateInstallments(this.selectedTemplateId, updated)
      .subscribe(() => {
        this.showEditPercentagesModal = false;
        this.loadTemplates();
      });
  }

  /* ================= CREATE ================= */

  openCreateModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSaveTemplate(form: any) {
    const payload = this.buildPayload(form);
    if (!payload) return;

    this.installmentService
      .create({
        clubId: this.clubId,
        ...payload,
      })
      .subscribe(() => {
        this.loadTemplates();
        this.closeModal();
      });
  }

  /* ================= HELPERS ================= */

  buildPayload(form: any) {
    let installments: any[] = [];

    if (form.mode === 'auto') {
      const percentage = 100 / form.installmentsCount;
      const step = form.durationDays / form.installmentsCount;

      for (let i = 0; i < form.installmentsCount; i++) {
        installments.push({
          order: i + 1,
          percentage: +percentage.toFixed(2),
          dueAfterDays: Math.round(step * (i + 1)),
        });
      }
    } else {
      const total = form.installments.reduce(
        (sum: number, i: any) => sum + Number(i.percentage),
        0
      );

      if (total !== 100) {
        alert('Total must be 100%');
        return null;
      }

      installments = form.installments.map((inst: any, index: number) => ({
        order: index + 1,
        percentage: inst.percentage,
        dueAfterDays: inst.dueAfter,
      }));
    }

    return {
      name: form.name,
      numOfInstallments: installments.length,
      durationInDays:
        form.durationDays ||
        Math.max(...installments.map((i) => i.dueAfterDays)),
      installments,
    };
  }
}
