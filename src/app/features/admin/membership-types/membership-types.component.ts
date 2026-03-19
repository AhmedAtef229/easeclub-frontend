import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { TablesComponent, TableColumn } from '../../../shared/components/tables/tables.component';
import { MembershipTypeModalComponent } from '../../../shared/components/modals/membership-type-modal/membership-type-modal.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { MembershipTypesService } from '../../../core/services/api/membership-types.service';
import { BranchService } from '../../../core/services/api/branches.service';
@Component({
  selector: 'app-membership-types',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    TablesComponent,
    MembershipTypeModalComponent,
    SearchInputComponent,
  ],
  templateUrl: './membership-types.component.html',
})
export class MembershipTypesComponent implements OnInit {
  /* 🔥 IMPORTANT: لازم دي تبقى UUIDs من API */
  branches: any[] = [];

  data: any[] = [];
  filteredData: any[] = [];

  columns: TableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },

    { key: 'branches', label: 'Branches', type: 'badge' },
  ];

  isModalOpen = false;
  editItem: any = null;

  constructor(
    private membershipTypesService: MembershipTypesService,
    private branchService: BranchService,
  ) {}

  ngOnInit(): void {
    this.loadMembershipTypes();
    this.loadBranches(); // 🔥 مهم
  }

  /* ================= LOAD ================= */

  loadMembershipTypes() {
    this.membershipTypesService.getMembershipTypes().subscribe({
      next: (res: any[]) => {
        this.data = res.map((item) => ({
          ...item,
          family: item.familyAllowed ? `Max ${item.maxFamilyMembers}` : '—',
          branches: item.allBranchesPermitted ? 'All Branches' : 'Selected',
        }));

        this.filteredData = [...this.data];
      },
      error: (err) => console.error(err),
    });
  }

  /* 🔥 هات الفروع من API */
  loadBranches() {
    this.branchService.getBranches().subscribe({
      next: (res) => {
        this.branches = res;
      },
      error: (err: any) => console.error(err),
    });
  }

  /* ================= MODAL ================= */

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

  /* ================= SAVE ================= */

  saveMembershipType(payload: any) {
    const requestBody = {
      name: payload.name,
      description: payload.description,
      familyAllowed: payload.familyAllowed,
      maxFamilyMembers: payload.maxFamilyMembers,
      allBranchesPermitted: payload.allBranches,

      branchIds: payload.allBranches
        ? this.branches.map((b) => b.id) // ✅ UUIDs
        : payload.selectedBranches, // ✅ UUIDs
    };

    console.log('REQUEST BODY:', requestBody);

    if (this.editItem) {
      this.membershipTypesService.updateMembershipType(this.editItem.id, requestBody).subscribe({
        next: () => {
          this.loadMembershipTypes();
          this.closeModal();
        },
        error: (err) => console.error(err),
      });
    } else {
      this.membershipTypesService.createMembershipType(requestBody).subscribe({
        next: () => {
          this.loadMembershipTypes();
          this.closeModal();
        },
        error: (err) => console.error(err),
      });
    }
  }

  /* ================= TOGGLE ================= */

  toggleStatus(row: any) {
    this.membershipTypesService.toggleStatus(row.id).subscribe({
      next: () => this.loadMembershipTypes(),
      error: (err) => console.error(err),
    });
  }

  /* ================= SEARCH ================= */

  onSearch(value: string) {
    const text = value.toLowerCase();

    this.filteredData = this.data.filter(
      (item) =>
        item.name?.toLowerCase().includes(text) || item.description?.toLowerCase().includes(text),
    );
  }
}
