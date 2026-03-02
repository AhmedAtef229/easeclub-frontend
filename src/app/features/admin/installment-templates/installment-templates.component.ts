import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { TablesComponent, TableColumn } from '../../../shared/components/tables/tables.component';
import { InstallmentTemplateModalComponent } from '../../../shared/components/modals/installment-template-modal/installments-template-modal.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { ConfirmService } from '../../../core/services/confirm.service';

@Component({
  selector: 'app-installment-templates',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    TablesComponent,
    InstallmentTemplateModalComponent,
    SearchInputComponent
  ],
  templateUrl: './installment-templates.component.html',
})
export class InstallmentTemplatesComponent {

  constructor(private confirmService: ConfirmService) {}

  /* ================= TABLE ================= */

  columns: TableColumn[] = [
    { key: 'name', label: 'Template Name' },
    { key: 'type', label: 'Type', type: 'badge' },
    { key: 'installments', label: 'Installments' },
    { key: 'duration', label: 'Duration' },
  ];

  data = [
    {
      id: 1,
      name: '3 Monthly Installments',
      type: 'Auto',
      installments: 3,
      duration: '90 days',
    },
    {
      id: 2,
      name: '6 Month Payment Plan',
      type: 'Auto',
      installments: 6,
      duration: '180 days',
    },
    {
      id: 3,
      name: 'Custom Quarterly',
      type: 'Manual',
      installments: 3,
      duration: 'Custom',
    },
    {
      id: 4,
      name: 'Full Payment',
      type: 'Auto',
      installments: 1,
      duration: '1 day',
    },
  ];

  filteredData = [...this.data];

  /* ================= MODAL ================= */

  showCreateModal = false;

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeModal() {
    this.showCreateModal = false;
  }

  onSaveTemplate(template: any) {
    this.data.push({
      id: Date.now(),
      ...template
    });

    this.filteredData = [...this.data];
    this.closeModal();
  }

  /* ================= DELETE ================= */

  onDelete(row: any) {
    this.confirmService.confirm({
      title: 'Delete Template',
      message: `Are you sure you want to delete "${row.name}"?`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel'
    }).subscribe(result => {

      if (result) {
        this.data = this.data.filter(item => item.id !== row.id);
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

    this.filteredData = this.data.filter(item =>
      item.name.toLowerCase().includes(text) ||
      item.type.toLowerCase().includes(text)
    );
  }
}
