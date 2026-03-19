import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { TablesComponent, TableColumn } from '../../../shared/components/tables/tables.component';
import { InstallmentTemplateModalComponent } from '../../../shared/components/modals/installment-template-modal/installments-template-modal.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { ConfirmService } from '../../../core/services/api/ui/confirm.service';
import { InstallmentTemplatesService } from '../../../core/services/api/installment-templates.service';
import { BranchService } from '../../../core/services/api/branches.service';

@Component({
  selector: 'app-installment-templates',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    TablesComponent,
    InstallmentTemplateModalComponent,
    SearchInputComponent,
  ],
  templateUrl: './installment-templates.component.html',
})
export class InstallmentTemplatesComponent implements OnInit {

  constructor(
    private confirmService: ConfirmService,
    private installmentService: InstallmentTemplatesService,
    private branchService: BranchService
  ) {}

  /* ================= STATE ================= */

  clubId!: string;

  data: any[] = [];
  filteredData: any[] = [];

  showModal = false;
  editItem: any = null;

  loading = false; // 🔥 UX

  /* ================= TABLE ================= */

  columns: TableColumn[] = [
    { key: 'name', label: 'Template Name' },
    { key: 'installments', label: 'Installments' },
    { key: 'duration', label: 'Duration' },
    {key:'type', label:'Type'},
  ];

  /* ================= INIT ================= */

  ngOnInit() {
    this.clubId = this.branchService.getClubId();

    if (!this.clubId) {
      console.error('❌ No clubId found');
      return;
    }

    this.loadTemplates();
  }

  /* ================= LOAD ================= */

  loadTemplates() {
    this.loading = true;

    this.installmentService.getAll(this.clubId).subscribe({
      next: (res) => {
        this.loading = false;

        const items = res?.items || [];

        this.data = items.map((item: any) => ({
          id: item.id,
          name: item.name,
          installments: item.numOfInstallments,
          duration: item.duration + ' days', // ✅ FIXED
        }));

        this.filteredData = [...this.data];
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Error loading templates:', err);
      }
    });
  }

  /* ================= MODAL ================= */

  openCreateModal() {
    this.editItem = null;
    this.showModal = true;
  }

  onEdit(row: any) {
    this.editItem = row;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editItem = null;
  }

  /* ================= SAVE ================= */

 onSaveTemplate(template: any) {

  const payload = this.buildPayload(template);

  if (!payload) return; // ✅ حل المشكلة هنا

  if (this.editItem) {

    this.installmentService.updateInstallments(
      this.clubId,
      this.editItem.id,
      payload.installments
    ).subscribe({
      next: () => {
        this.loadTemplates();
        this.closeModal();
      },
      error: (err) => console.error('❌ Update Error:', err)
    });

  } else {

    this.installmentService.create(this.clubId, payload).subscribe({
      next: () => {
        this.loadTemplates();
        this.closeModal();
      },
      error: (err) => console.error('❌ Create Error:', err)
    });
  }
}

  /* ================= DELETE ================= */

  onDelete(row: any) {
    this.confirmService
      .confirm({
        title: 'Delete Template',
        message: `Are you sure you want to delete "${row.name}"?`,
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
      })
      .subscribe((result) => {
        if (result) {
          this.data = this.data.filter((item) => item.id !== row.id);
          this.filteredData = [...this.data];
        }
      });
  }

  /* ================= SEARCH ================= */

  onSearch(value: string) {

    const text = value.toLowerCase();

    if (!text) {
      this.filteredData = [...this.data];
      return;
    }

    this.filteredData = this.data.filter(
      (item) =>
        item.name.toLowerCase().includes(text) ||
        item.duration.toLowerCase().includes(text)
    );
  }

  /* ================= PAYLOAD ================= */

 buildPayload(form: any): any | null {

  let installments: any[] = [];

  if (form.mode === 'auto') {

    const percentage = 100 / form.installmentsCount;
    const step = form.durationDays / form.installmentsCount;

    for (let i = 0; i < form.installmentsCount; i++) {
      installments.push({
        order: i + 1,
        percentage: +percentage.toFixed(2),
        dueAfterDays: Math.round(step * (i + 1))
      });
    }

  } else {

    const total = form.installments.reduce(
      (sum: number, i: any) => sum + Number(i.percentage),
      0
    );

    if (total !== 100) {
      alert('Total percentage must equal 100%');
      return null; // ✅ بدل undefined
    }

    installments = form.installments.map((inst: any, index: number) => ({
      order: index + 1,
      percentage: inst.percentage,
      dueAfterDays: inst.dueAfter
    }));
  }

  return {
    name: form.name,
    numOfInstallments: installments.length,
    durationInDays: form.durationDays || this.calculateDuration(installments),
    installments
  };
}

  calculateDuration(installments: any[]) {
    return Math.max(...installments.map(i => i.dueAfterDays));
  }

}
