import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { TablesComponent, TableColumn } from '../../../shared/components/tables/tables.component';
import { MembershipPlanModalComponent } from
  '../../../shared/components/modals/membership-plan-modal/membership-plan-modal.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { ConfirmService } from '../../../core/services/confirm.service';
@Component({
  selector: 'app-membership-plans',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    TablesComponent,
    MembershipPlanModalComponent,SearchInputComponent],
  templateUrl: './membership-plans.component.html',
})
export class MembershipPlansComponent {

  /* ===== Table Columns ===== */
  columns: TableColumn[] = [
    { key: 'name', label: 'Plan Name' },
    { key: 'type', label: 'Type', type: 'badge' },
    { key: 'price', label: 'Price' },
    { key: 'duration', label: 'Duration' },
    { key: 'active', label: 'Active', type: 'boolean' },
    { key: 'templates', label: 'Templates' },
  ];

  /* ===== Data ===== */
  data = [
    {
      name: 'Premium Adult Annual',
      type: 'Adult Membership',
      price: '$1200',
      duration: '365 days',
      active: true,
      templates: 3,
    },
    {
      name: 'Family Annual Pass',
      type: 'Family Membership',
      price: '$3000',
      duration: '365 days',
      active: true,
      templates: 2,
    },
    {
      name: 'Student Semester',
      type: 'Student Membership',
      price: '$400',
      duration: '180 days',
      active: true,
      templates: 2,
    },
    {
      name: 'Child Monthly',
      type: 'Child Membership',
      price: '$60',
      duration: '30 days',
      active: false,
      templates: 1,
    },
  ];

  filteredData = [...this.data];

constructor(private confirmService: ConfirmService) {}

  /* ===== Filter ===== */
  filters = ['All Plans', 'Active Only', 'Inactive Only'];
  selectedFilter = 'All Plans';
  showFilter = false;

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  selectFilter(filter: string) {
    this.selectedFilter = filter;
    this.showFilter = false;

    if (filter === 'All Plans') {
      this.filteredData = [...this.data];
    }

    if (filter === 'Active Only') {
      this.filteredData = this.data.filter(p => p.active);
    }

    if (filter === 'Inactive Only') {
      this.filteredData = this.data.filter(p => !p.active);
    }
  }

  /* ===== Modal ===== */
  showCreateModal = false;

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeModal() {
    this.showCreateModal = false;
  }

  onSavePlan(plan: any) {
    this.data = [
      ...this.data,
      {
        name: plan.name,
        type: plan.membershipType,
        price: `$${plan.price}`,
        duration: `${plan.duration} days`,
        active: plan.active,
        templates: plan.templates.length,
      },
    ];

    this.filteredData = [...this.data];
    this.closeModal();
  }

  /* ===== Actions ===== */
  onView(row: any) {
    console.log('View:', row);
  }

  onEdit(row: any) {
    console.log('Edit:', row);
  }

  onCopy(row: any) {
    const copy = { ...row, name: row.name + ' (Copy)' };
    this.data = [...this.data, copy];
    this.filteredData = [...this.data];
  }

 onDelete(row: any) {
  this.confirmService.confirm({
    title: 'Delete Plan',
    message: `Are you sure you want to delete "${row.name}"?`,
    confirmText: 'Yes, Delete',
    cancelText: 'Cancel'
  }).subscribe(result => {
    if (result) {
      this.data = this.data.filter(r => r !== row);
      this.filteredData = [...this.data];
    }
  });
}

  onSearch(value: string) {
  const text = value.toLowerCase();

  this.filteredData = this.data.filter(plan =>
    plan.name.toLowerCase().includes(text) ||
    plan.type.toLowerCase().includes(text)
  );
}
}
