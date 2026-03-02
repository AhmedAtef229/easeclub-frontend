import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { TablesComponent, TableColumn } from '../../../shared/components/tables/tables.component';
import { MembershipTypeModalComponent } from '../../../shared/components/modals/membership-type-modal/membership-type-modal.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { ConfirmService } from '../../../core/services/confirm.service';

@Component({
  selector: 'app-membership-types',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    TablesComponent,
    MembershipTypeModalComponent,
    SearchInputComponent
  ],
  templateUrl: './membership-types.component.html',
})
export class MembershipTypesComponent {

  constructor(private confirmService: ConfirmService) {}

  columns: TableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'family', label: 'Family', type: 'badge' },
    { key: 'branches', label: 'Branches', type: 'badge' },
  ];

  data = [
    {
      id: 1,
      name: 'Adult Membership',
      description: 'Standard membership for adults (18+)',
      family: '—',
      branches: 'All Branches',
    },
    {
      id: 2,
      name: 'Child Membership',
      description: 'Membership for children under 18',
      family: '—',
      branches: 'All Branches',
    },
    {
      id: 3,
      name: 'Family Membership',
      description: 'Membership for families',
      family: 'Max 5',
      branches: 'Downtown, Northside',
    },
    {
      id: 4,
      name: 'Student Membership',
      description: 'Discounted membership for students with valid ID',
      family: '—',
      branches: 'All Branches',
    },
  ];

  filteredData = [...this.data];

  /* ================= MODAL ================= */

  isModalOpen = false;
  editItem: any = null;

  openCreateModal(): void {
    this.editItem = null;
    this.isModalOpen = true;
  }

  openEditModal(row: any): void {
    this.editItem = row;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveMembershipType(payload: any): void {

    if (this.editItem) {
      const index = this.data.findIndex(d => d.id === this.editItem.id);
      this.data[index] = { ...this.editItem, ...payload };
    } else {
      this.data.push({
        id: Date.now(),
        ...payload,
      });
    }

    this.filteredData = [...this.data];
    this.closeModal();
  }

  /* ================= DELETE WITH CONFIRM ================= */

  deleteMembershipType(row: any): void {

    this.confirmService.confirm({
      title: 'Delete Membership Type',
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
      item.description.toLowerCase().includes(text)
    );
  }

}
