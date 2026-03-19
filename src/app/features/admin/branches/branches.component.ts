import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { TablesComponent, TableColumn } from '../../../shared/components/tables/tables.component';
import { BranchModalComponent } from '../../../shared/components/modals/branch-modal/branch-modal.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { BranchService } from '../../../core/services/api/branches.service';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    TablesComponent,
    BranchModalComponent,
    SearchInputComponent,
  ],
  templateUrl: './branches.component.html',
})
export class BranchesComponent implements OnInit {

  constructor(private branchService: BranchService) {}

 columns: TableColumn[] = [
  { key: 'name', label: 'Branch Name' },
  { key: 'createdAt', label: 'Created At', type: 'text' },  
];

  data: any[] = [];
  filteredData: any[] = [];

  showModal = false;
  editItem: any = null;

  ngOnInit() {

    this.loadBranches();

  }

  /* ================= LOAD ================= */

  loadBranches() {

    this.branchService.getBranches().subscribe({

      next: (res: any[]) => {

        this.data = res || [];
        this.filteredData = [...this.data];

      },

      error: (err) => {

        if (err.status === 404) {

          this.data = [];
          this.filteredData = [];

        } else {

          console.error(err);

        }

      }

    });

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

  /* ================= SAVE ================= */

  onSaveBranch(branch: any) {

    const payload = {
      name: branch.name
    };

    if (branch.id) {

      this.branchService.updateBranch(branch.id, payload).subscribe({

        next: () => {

          this.loadBranches();
          this.closeModal();

        },

        error: (err) => console.error(err)

      });

    } else {

      this.branchService.createBranch(payload).subscribe({

        next: () => {

          this.loadBranches();
          this.closeModal();

        },

        error: (err) => console.error(err)

      });

    }

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
        item.name?.toLowerCase().includes(text)

    );

  }

}
