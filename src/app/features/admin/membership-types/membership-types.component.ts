import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { TablesComponent, TableColumn } from '../../../shared/components/tables/tables.component';
import { MembershipTypeModalComponent } from '../../../shared/components/modals/membership-type-modal/membership-type-modal.component';
import { MembershipTypesService } from '../../../core/services/api/membership-types.service';
import { BranchService } from '../../../core/services/api/branches.service';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-membership-types',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    TablesComponent,
    MembershipTypeModalComponent,
    DropdownComponent // ✅ مهم
  ],
  templateUrl: './membership-types.component.html',
})
export class MembershipTypesComponent implements OnInit {

  data: any[] = [];
  filteredData: any[] = [];
  branches: any[] = [];

  /* Filters */
  selectedStatus: string = 'All';
  selectedBranch: string = 'All';
  selectedBranchLabel: string = 'All Branches';

  branchOptions: string[] = ['All Branches'];

  /* Columns */
  columns: TableColumn[] = [
    { key: 'name', label: 'Type Name' },
    { key: 'description', label: 'Description' },
    { key: 'branchAccess', label: 'Branch Access', type: 'badge' },
    { key: 'isActive', label: 'Status', type: 'status' },
  ];

  isModalOpen = false;
  editItem: any = null;

  constructor(
    private membershipTypesService: MembershipTypesService,
    private branchService: BranchService
  ) {}

  ngOnInit() {
    this.loadMembershipTypes();
    this.loadBranches();
  }

  /* ================= LOAD ================= */

loadMembershipTypes(filters?: any) {
  this.membershipTypesService.getMembershipTypes(filters).subscribe({
    next: (res: any) => {

      const list = res.items || res;

      this.data = list.map((item: any) => ({
        ...item,

        // ✅ خليه دايماً Array عشان الـ badge
        branchAccess: item.allBranchesPermitted
          ? ['All Branches']
          : (item.branchNames || ['Selected']),
      }));

      this.filteredData = [...this.data];
    },
    error: err => console.error(err)
  });
}
  loadBranches() {
    this.branchService.getBranches().subscribe({
      next: (res: any[]) => {
        this.branches = res;

        this.branchOptions = [
          'All Branches',
          ...res.map(b => b.name)
        ];
      },
      error: err => console.error(err)
    });
  }

  /* ================= FILTER ================= */

  applyStatusFilter(value: string) {
    this.selectedStatus = value;
    this.applyFilters();
  }

  onBranchSelect(label: string) {
    this.selectedBranchLabel = label;

    if (label === 'All Branches') {
      this.selectedBranch = 'All';
    } else {
      const branch = this.branches.find(b => b.name === label);
      this.selectedBranch = branch?.id || 'All';
    }

    this.applyFilters();
  }

  applyFilters() {
    let filters: any = {};

    if (this.selectedStatus === 'Active') filters.isActive = true;
    if (this.selectedStatus === 'Inactive') filters.isActive = false;

    if (this.selectedBranch !== 'All') {
      filters.branchId = this.selectedBranch;
    }

    this.loadMembershipTypes(filters);
  }

  /* ================= ACTIONS ================= */

  openCreateModal() {
    this.editItem = null;
    this.isModalOpen = true;
  }

  openEditModal(row: any) {
    this.editItem = row;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveMembershipType(payload: any) {

    const requestBody = {
      clubId: this.branchService.getClubId(),
      name: payload.name,
      description: payload.description,
      allBranchesPermitted: payload.allBranches,
      branchIds: payload.allBranches ? [] : payload.selectedBranches
    };

    if (this.editItem) {
      this.membershipTypesService
        .updateMembershipType(this.editItem.id, requestBody)
        .subscribe(() => {
          this.loadMembershipTypes();
          this.closeModal();
        });
    } else {
      this.membershipTypesService
        .createMembershipType(requestBody)
        .subscribe(() => {
          this.loadMembershipTypes();
          this.closeModal();
        });
    }
  }

  toggleStatus(row: any) {
    this.membershipTypesService.toggleStatus(row.id).subscribe(() => {
      this.loadMembershipTypes();
    });
  }
}
