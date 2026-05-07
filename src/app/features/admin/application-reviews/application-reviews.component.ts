import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { ApplicationReviewsService } from '../../../core/services/api/application-reviews.service';
import { BranchService } from '../../../core/services/api/branches.service';
import { TableColumn, TablesComponent } from '../../../shared/components/tables/tables.component';
import { ApplicationReviewsModalComponent } from '../../../shared/components/modals/application-reviews-modal/application-reviews-modal.component';

@Component({
  selector: 'app-application-reviews',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageLayoutComponent,
    SearchInputComponent,
    DropdownComponent,
    TablesComponent,
    ApplicationReviewsModalComponent
  ],
  templateUrl: './application-reviews.component.html',
})
export class ApplicationReviewsComponent implements OnInit {

  constructor(
    private service: ApplicationReviewsService,
    private branchService: BranchService,
  ) {}

  /* ================= MODAL ================= */

  isModalOpen = false;
  selectedRow: any = null;

  /* ================= FILTERS ================= */

  search = '';
  selectedStatus = 'All statuses';

  statusOptions = ['All statuses', 'Submitted', 'NeedsChanges', 'Approved', 'Rejected'];

  dateFrom = '';
  dateTo = '';

  clubId = '';

  /* ================= TABLE ================= */

  columns: TableColumn[] = [
    { key: 'trackingNumber', label: 'Tracking #' },
    { key: 'member', label: 'Member Name' },
    { key: 'plan', label: 'Plan' },
    { key: 'submittedAt', label: 'Submitted' },
    { key: 'statusText', label: 'Status', type: 'badge' },
  ];

  data: any[] = [];
  loading = false;

  /* ================= INIT ================= */

  ngOnInit(): void {
    this.clubId = this.branchService.getClubId();
    this.loadData();
  }

  /* ================= API ================= */

  loadData() {
    if (!this.clubId) return;

    this.loading = true;

    this.service
      .getApplications(
        this.clubId,
        this.selectedStatus === 'All statuses' ? undefined : this.selectedStatus,
        this.dateFrom,
        this.dateTo,
        this.search,
      )
      .subscribe({
        next: (res: any) => {
          const items = res?.items ?? [];

          this.data = items.map((item: any) => ({
            id: item?.id ?? '',
            trackingNumber: item?.trackingNumber ?? '',
            member: `${item?.userName ?? ''} ${item?.email ?? ''}`,
            plan: item?.membershipPlanName ?? '',
            submittedAt: this.formatDate(item?.submittedAt),
            statusText: item?.status ? [item.status] : [],
          }));

          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  /* ================= EVENTS ================= */

  onSearch(value: string) {
    this.search = value;
    this.loadData();
  }

  onStatusChange(value: string) {
    this.selectedStatus = value;
    this.loadData();
  }

  /* ================= VIEW CLICK ================= */

  onView(row: any) {
    this.selectedRow = row;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  /* ================= FORMAT ================= */

  formatDate(date: string) {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }
}
