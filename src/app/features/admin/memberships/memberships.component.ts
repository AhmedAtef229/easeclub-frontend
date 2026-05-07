import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { TablesComponent, TableColumn } from '../../../shared/components/tables/tables.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { MembershipsService } from '../../../core/services/api/memberships.service';
import { BranchService } from '../../../core/services/api/branches.service';

@Component({
  selector: 'app-memberships',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    TablesComponent,
    SearchInputComponent
  ],
  templateUrl: './memberships.component.html',
})
export class MembershipsComponent implements OnInit {

  constructor(
    private membershipsService: MembershipsService,
    private branchService: BranchService
  ) {}

  loading = false;

  clubId = '';

  search = '';
  selectedStatus: string | undefined = undefined;
  showStatus = false;

  columns: TableColumn[] = [
    { key: 'memberName', label: 'Member' },
    { key: 'membershipNumber', label: 'Membership Number' },
    { key: 'membershipTypeName', label: 'Type' },
    { key: 'membershipPlanName', label: 'Plan' },
    { key: 'family', label: 'Family' },
    { key: 'period', label: 'Period' },
    { key: 'createdAt', label: 'Created At' },
    { key: 'status', label: 'Status', type: 'badge' },
  ];

  data: any[] = [];

  ngOnInit() {
    this.loadContext();
  }

  /* ================= GET CLUB ID ================= */

  loadContext() {
    this.clubId = this.branchService.getClubId();
    this.loadMemberships();
  }

  /* ================= LOAD DATA ================= */

  loadMemberships() {

    if (!this.clubId) return;

    this.loading = true;

    this.membershipsService
      .getClubMemberships(
        this.clubId,
        this.selectedStatus,
        this.search || ''
      )
      .subscribe({
        next: (res: any) => {

          const items = res?.items || [];

          this.data = items.map((item: any) => ({
            memberName: item.memberName,
            membershipNumber: item.membershipNumber,
            membershipTypeName: item.membershipTypeName,
            membershipPlanName: item.membershipPlanName,
            family: item.isFamilyMembership ? 'Yes' : 'No',

            period:
              this.formatDate(item?.currentCycle?.period?.startDate)
              + ' → ' +
              this.formatDate(item?.currentCycle?.period?.endDate),

            createdAt: this.formatDate(item.createdAt),

            status: item.status ? [item.status] : [],
          }));

          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          // If the backend strictly requires a search term and returns 400,
          // we gracefully show an empty table instead of breaking the UI.
          if (err.status === 400 && !this.search) {
            this.data = [];
            console.warn('Backend requires a search term. Please type something in the search box.');
          }
        }
      });
  }

  /* ================= SEARCH ================= */

  onSearch(value: string) {
    this.search = value;
    this.loadMemberships();
  }

  /* ================= STATUS ================= */

  toggleStatus() {
    this.showStatus = !this.showStatus;
  }

  setStatus(status?: string) {
    this.selectedStatus = status;
    this.showStatus = false;
    this.loadMemberships();
  }

  /* ================= FORMAT ================= */

  formatDate(date: string) {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }
}
