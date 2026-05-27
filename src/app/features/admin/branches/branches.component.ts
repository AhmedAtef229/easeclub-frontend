import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { TablesComponent, TableColumn } from '../../../shared/components/tables/tables.component';
import { BranchModalComponent } from '../../../shared/components/modals/branch-modal/branch-modal.component';
import { BranchService } from '../../../core/services/api/branches.service';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    TablesComponent,
    BranchModalComponent,
    DropdownComponent

  ],
  templateUrl: './branches.component.html',
})
export class BranchesComponent implements OnInit {

  constructor(private branchService: BranchService) {}

  columns: TableColumn[] = [
    { key: 'name', label: 'Branch Name' },
    { key: 'address', label: 'Address' },
    { key: 'createdAt', label: 'Created At' },
    { key: 'isActive', label: 'Status', type: 'status' },
  ];

  data: any[] = [];

  showModal = false;
  editItem: any = null;

  /* Dropdown */

  selectedFilter = 'All';

  ngOnInit() {
    this.loadBranches();
  }

  /* ================= LOAD ================= */
  loadBranches(filter?: boolean) {
    this.branchService.getBranches(filter).subscribe({
      next: (res) => {
        this.data = res || [];
      },
      error: () => {
        this.data = [];
      }
    });
  }

  /* ================= FILTER ================= */


applyFilter(option: string) {
  this.selectedFilter = option;

  if (option === 'Active') {
    this.loadBranches(true);
  } else if (option === 'Inactive') {
    this.loadBranches(false);
  } else {
    this.loadBranches();
  }
}

  /* ================= MODAL ================= */
  openCreateModal() {
    this.editItem = null;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onEdit(row: any) {
    this.editItem = row;
    this.showModal = true;
  }

  /* ================= STATUS ================= */
  onToggleStatus(row: any) {
    this.branchService.toggleStatus(row.id).subscribe({
      next: () => this.loadBranches(),
      error: (err) => console.error(err)
    });
  }

  /* ================= SAVE ================= */
  onSaveBranch(branch: any) {

    if (branch.id) {
      this.branchService.updateBranch(branch.id, {
        name: branch.name,
        address: branch.address
      }).subscribe({
        next: () => {
          this.loadBranches();
          this.closeModal();
        }
      });
    } else {
      this.branchService.createBranch({
        name: branch.name,
        address: branch.address
      }).subscribe({
        next: () => {
          this.loadBranches();
          this.closeModal();
        }
      });
    }
  }
}
