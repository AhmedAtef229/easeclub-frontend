import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { TablesComponent, TableColumn } from '../../../shared/components/tables/tables.component';
import { BranchModalComponent } from '../../../shared/components/modals/branch-modal/branch-modal.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { ConfirmService } from '../../../core/services/confirm.service';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    TablesComponent,
    BranchModalComponent,
    SearchInputComponent
  ],
  templateUrl: './branches.component.html',
})
export class BranchesComponent {

  constructor(private confirmService: ConfirmService) {}

  /* ================= TABLE ================= */

  columns: TableColumn[] = [
    { key: 'name', label: 'Branch Name' },
    { key: 'createdAt', label: 'Created At' },
  ];

  data = [
    { id: 1, name: 'Downtown Branch', createdAt: '1/15/2024' },
    { id: 2, name: 'Northside Branch', createdAt: '2/20/2024' },
    { id: 3, name: 'Westside Branch', createdAt: '3/10/2024' },
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

  onCreateBranch(branch: { name: string }) {
    this.data.push({
      id: Date.now(),
      name: branch.name,
      createdAt: new Date().toLocaleDateString(),
    });

    this.filteredData = [...this.data];
    this.closeModal();
  }

  /* ================= DELETE ================= */

  onDelete(row: any) {

    this.confirmService.confirm({
      title: 'Delete Branch',
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
      item.createdAt.toLowerCase().includes(text)
    );
  }

}
