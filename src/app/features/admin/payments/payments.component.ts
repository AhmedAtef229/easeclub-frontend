import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablesComponent } from '../../../shared/components/tables/tables.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

import { PaymentsService } from '../../../core/services/api/payments.service';
import { BranchService } from '../../../core/services/api/branches.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    TablesComponent,
    SearchInputComponent,
    DropdownComponent,
    PageLayoutComponent,
  ],
  templateUrl: './payments.component.html',
})
export class PaymentsComponent implements OnInit {

  constructor(
    private service: PaymentsService,
    private branchService: BranchService
  ) {}

  clubId!: string;

  /* ================= TABS ================= */

  activeTab: 'installments' | 'invoices' = 'installments';

  /* ================= FILTERS ================= */

  get statusOptions(): string[] {
    if (this.activeTab === 'installments') {
      return ['All Statuses', 'Pending', 'Paid', 'Overdue', 'Cancelled'];
    } else {
      return ['All Statuses', 'Issued', 'Paid', 'Void'];
    }
  }

  selectedStatus = 'All Statuses';
  searchValue = '';

  get searchPlaceholder(): string {
    if (this.activeTab === 'installments') {
      return 'Search by Membership Number or Installment ID...';
    } else {
      return 'Search by Invoice ID or Billing Item ID...';
    }
  }

  /* ================= PAGINATION ================= */

  currentPage = 1;
  pageSize = 10;
  totalCount = 0;

  /* ================= STATS (DYNAMIC) ================= */

  stats = [
    {
      title: 'Total Receivables',
      value: '$0',
      subtitle: 'Unpaid Installments',
      icon: 'fa-dollar-sign',
      iconBg: 'bg-[#6900ff4d]',
      iconColor: 'text-primary',
    },
    {
      title: 'Overdue Dues',
      value: '$0',
      subtitle: '0 High Priority',
      icon: 'fa-triangle-exclamation',
      iconBg: 'bg-red-100',
      iconColor: 'text-danger',
    },
    {
      title: 'Monthly Revenue',
      value: '$0',
      subtitle: 'Paid Invoices',
      icon: 'fa-arrow-trend-up',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-500',
    },
  ];

  /* ================= DATA ================= */

  installments: any[] = [];
  invoices: any[] = [];

  /* ================= TABLE ================= */

  columns: any[] = [];
  filteredPayments: any[] = [];

  /* ================= INIT ================= */

  ngOnInit() {
    this.clubId = this.branchService.getClubId();
    this.setColumns();
    this.loadStats();
    if (this.activeTab === 'installments') {
      this.loadInstallments();
    } else {
      this.loadInvoices();
    }
  }

  /* ================= SWITCH TAB ================= */

  switchTab(tab: 'installments' | 'invoices') {
    this.activeTab = tab;
    this.currentPage = 1;

    // Reset status filter if not compatible with the new tab
    const allowed = this.statusOptions;
    if (!allowed.includes(this.selectedStatus)) {
      this.selectedStatus = 'All Statuses';
    }

    this.setColumns();

    if (tab === 'installments') {
      this.loadInstallments();
    } else {
      this.loadInvoices();
    }
  }

  /* ================= COLUMNS ================= */

  setColumns() {

    if (this.activeTab === 'installments') {

      this.columns = [
        { key: 'membershipNumber', label: 'Membership Number' },
        { key: 'readableId', label: 'Installment ID' },
        { key: 'membershipPeriod', label: 'Membership Period' },
        { key: 'amount', label: 'Amount', type: 'currency' },
        { key: 'dueDate', label: 'Due Date' },
        { key: 'status', label: 'Status' },
      ];

      this.filteredPayments = [...this.installments];

    } else {

      this.columns = [
        { key: 'invoiceReadableId', label: 'Invoice ID' },
        { key: 'userName', label: 'User Name' },
        { key: 'billingItemType', label: 'Type' },
        { key: 'billingItemReadableId', label: 'Billing Item ID' },
        { key: 'amount', label: 'Amount', type: 'currency' },
        { key: 'status', label: 'Status' },
        { key: 'paidAt', label: 'Paid At' },
        { key: 'method', label: 'Method' },
      ];

      this.filteredPayments = [...this.invoices];
    }
  }

  /* ================= LOAD INSTALLMENTS ================= */

  loadInstallments() {

    this.service
      .getClubInstallments(
        this.clubId,
        this.selectedStatus,
        this.searchValue,
        this.currentPage,
        this.pageSize
      )
      .subscribe((res: any) => {

        this.installments = (res.items || []).map((x: any) => ({

          membershipNumber: x.membershipNumber,

          readableId: x.readableId,

          membershipPeriod:
            new Date(x.membershipPeriod.startDate).toLocaleDateString()
            + ' → ' +
            new Date(x.membershipPeriod.endDate).toLocaleDateString(),

          amount: x.amount,

          dueDate: new Date(x.dueDate).toLocaleDateString(),

          status: x.status,

          invoiceId: x.invoiceId ?? '—'
        }));

        this.totalCount = res.totalCount || 0;
        this.setColumns();
      });
  }

  /* ================= LOAD INVOICES ================= */

  loadInvoices() {

    this.service
      .getClubInvoices(
        this.clubId,
        this.selectedStatus,
        this.searchValue,
        this.currentPage,
        this.pageSize
      )
      .subscribe((res: any) => {

        this.invoices = (res.items || []).map((x: any) => ({

          invoiceReadableId: x.invoiceReadableId,

          userName: x.userName,

          billingItemType: x.billingItemType,

          billingItemReadableId: x.billingItemReadableId || '—',

          amount: x.amount,

          status: x.status,

          paidAt: x.paidAt
            ? new Date(x.paidAt).toLocaleDateString()
            : null,

          method: x.method || '—'
        }));

        this.totalCount = res.totalCount || 0;
        this.setColumns();
      });
  }

  /* ================= LOAD STATS ================= */

  loadStats() {
    this.service
      .getClubPaymentStats(this.clubId)
      .subscribe((res: any) => {
        this.stats[0].value = `$${(res.totalReceivables || 0).toFixed(2)}`;
        this.stats[1].value = `$${(res.overdueDues || 0).toFixed(2)}`;
        this.stats[1].subtitle = `${res.overdueCount || 0} High Priority`;
        this.stats[2].value = `$${(res.monthlyRevenue || 0).toFixed(2)}`;
      });
  }

  /* ================= SEARCH ================= */

  onSearch(value: string) {

    this.searchValue = value;
    this.currentPage = 1;

    if (this.activeTab === 'installments')
      this.loadInstallments();
    else
      this.loadInvoices();
  }

  /* ================= STATUS ================= */

  onStatusChange(status: string) {

    this.selectedStatus = status;
    this.currentPage = 1;

    if (this.activeTab === 'installments')
      this.loadInstallments();
    else
      this.loadInvoices();
  }

  /* ================= PAGE CHANGE ================= */

  onPageChange(page: number) {
    this.currentPage = page;
    if (this.activeTab === 'installments') {
      this.loadInstallments();
    } else {
      this.loadInvoices();
    }
  }

}
