import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { TablesComponent, TableColumn } from '../../../shared/components/tables/tables.component';

import { CreateTemplateModalComponent } from '../../../shared/components/modals/template-builder/create-template-modal/create-template-modal.component';

import { BranchService } from '../../../core/services/api/branches.service';

import { ApplicationTemplateService } from '../../../core/services/api/application-templates.service';

@Component({
  selector: 'app-application-templates',
  standalone: true,

  imports: [
    CommonModule,
    PageLayoutComponent,
    TablesComponent,
    CreateTemplateModalComponent, // Ensure this is imported correctly
  ],

  templateUrl: './application-templates.component.html',
})
export class ApplicationTemplatesComponent implements OnInit {
  constructor(
    private service: ApplicationTemplateService,
    private branchService: BranchService,
  ) {}

  // =========================================================
  // STATE
  // =========================================================

  clubId!: string;

  data: any[] = [];

  currentPage = 1;

  pageSize = 10;

  totalCount = 0;

  hasMore = false;

  showCreateModal = false;

  selectedTemplate: any = null;
  selectedTemplateId: string | undefined = undefined;
  selectedTemplateData: any = null;

  showConnectionsModal = false;

  // =========================================================
  // TABLE
  // =========================================================

  columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Template Name',
    },

    {
      key: 'plans',
      label: 'Connected Plans',
      type: 'badge',
    },

    {
      key: 'isActive',
      label: 'Status',
      type: 'status',
    },

    {
      key: 'lastModified',
      label: 'Last Modified',
    },
  ];

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {
    this.clubId = this.branchService.getClubId();

    this.loadData();
  }

  // =========================================================
  // LOAD DATA
  // =========================================================

  loadData(): void {
    this.service
      .getTemplates(this.clubId, {
        page: this.currentPage,
        limit: this.pageSize,
      })
      .subscribe({
        next: (res: any) => {
          this.totalCount = res.totalCount;

          this.hasMore = res.hasMore;

          this.data = (res.items || []).map((item: any) => ({
            id: item.id,

            name: item.name,

            plans: item.connectedMembershipPlans || [],

            isActive: item.isActive,

            lastModified: this.formatDate(item.lastModified),
          }));
        },

        error: (err) => {
          console.error('❌ Load Templates Error:', err);
        },
      });
  }

  // =========================================================
  // FORMAT DATE
  // =========================================================

  formatDate(date: string): string {
    if (!date) return '-';

    return new Date(date).toLocaleDateString();
  }

  // =========================================================
  // EDIT
  // =========================================================

  onEdit(row: any): void {
    console.log('✏️ Edit Template:', row);

    this.service.getTemplateById(row.id).subscribe({
      next: (res) => {
        console.log('📦 Template Details:', res);
        this.selectedTemplateId = row.id;
        this.selectedTemplateData = res;
        this.showCreateModal = true;
      },
      error: (err) => {
        console.error('❌ Details Error:', err);
      },
    });
  }

  // =========================================================
  // MANAGE CONNECTIONS
  // =========================================================

  onManageConnections(row: any): void {
    this.selectedTemplate = row;

    this.showConnectionsModal = true;
  }

  closeConnectionsModal(): void {
    this.showConnectionsModal = false;
  }

  // =========================================================
  // DELETE
  // =========================================================

  onDelete(row: any): void {
    const confirmed = confirm('Are you sure you want to delete this template?');

    if (!confirmed) return;

    this.service.deleteTemplate(row.id).subscribe({
      next: () => {
        this.loadData();
      },

      error: (err) => {
        console.error('❌ Delete Error:', err);
      },
    });
  }

  // =========================================================
  // PAGINATION
  // =========================================================

  onPageChange(page: number): void {
    this.currentPage = page;

    this.loadData();
  }

  nextPage(): void {
    if (!this.hasMore) return;

    this.currentPage++;

    this.loadData();
  }

  prevPage(): void {
    if (this.currentPage === 1) return;

    this.currentPage--;

    this.loadData();
  }

  // =========================================================
  // MODAL
  // =========================================================

  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.selectedTemplateId = undefined;
    this.selectedTemplateData = null;
  }

  // =========================================================
  // CREATE / UPDATE
  // =========================================================

  onCreateTemplate(data: any): void {
    const payload = {
      clubId: this.clubId,
      templateId: data.templateId,
      name: data.name,
      steps: data.steps,
    };

    console.log('🚀 EXACT PAYLOAD BEING SENT:', JSON.stringify(payload, null, 2));

    this.service.upsertTemplate(payload).subscribe({
      next: () => {
        this.loadData();

        this.closeCreateModal();
      },

      error: (err) => {
        console.error('❌ Upsert Error Details:', err.error);
        if (err.error && err.error.errors) {
          console.table(err.error.errors);
        }
      },
    });
  }

  // =========================================================
  // SYNC MEMBERSHIP PLANS
  // =========================================================

  onSaveConnections(planIds: string[]): void {
    if (!this.selectedTemplate) return;

    this.service.syncMembershipPlans(this.selectedTemplate.id, planIds).subscribe({
      next: () => {
        this.closeConnectionsModal();

        this.loadData();
      },

      error: (err) => {
        console.error('❌ Sync Plans Error:', err);
      },
    });
  }
}
