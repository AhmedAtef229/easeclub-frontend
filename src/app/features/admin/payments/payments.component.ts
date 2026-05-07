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

  statusOptions = [
    'All Statuses',
    'Pending',
    'Paid',
    'Overdue',
    'Issued',
    'Void'
  ];

  selectedStatus = 'All Statuses';
  searchValue = '';

  /* ================= STATS (DYNAMIC) ================= */

  stats = [
    {
      title: 'Total Receivables',
      value: '$0',
      subtitle: 'Unpaid Installments',
      icon: 'fa-dollar-sign',
      iconBg: 'bg-lavender/30',
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
    this.loadInstallments();
    this.loadInvoices(); // 🔥 مهم عشان نحسب stats
  }

  /* ================= SWITCH TAB ================= */

  switchTab(tab: 'installments' | 'invoices') {
    this.activeTab = tab;
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
        { key: 'amount', label: 'Amount' },
        { key: 'dueDate', label: 'Due Date' },
        { key: 'status', label: 'Status' },
        { key: 'invoiceId', label: 'Invoice ID' },
      ];

      this.filteredPayments = [...this.installments];

    } else {

      this.columns = [
        { key: 'invoiceReadableId', label: 'Invoice ID' },
        { key: 'userName', label: 'User Name' },
        { key: 'billingItemType', label: 'Type' },
        { key: 'amount', label: 'Amount' },
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
        1,
        10
      )
      .subscribe((res: any) => {

        this.installments = res.items.map((x: any) => ({

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

        this.setColumns();
        this.calculateStats(); // 🔥
      });
  }

  /* ================= LOAD INVOICES ================= */

  loadInvoices() {

    this.service
      .getClubInvoices(
        this.clubId,
        this.selectedStatus,
        this.searchValue,
        1,
        10
      )
      .subscribe((res: any) => {

        this.invoices = res.items.map((x: any) => ({

          invoiceReadableId: x.invoiceReadableId,

          userName: x.userName,

          billingItemType: x.billingItemType,

          amount: x.amount,

          status: x.status,

          paidAt: x.paidAt
            ? new Date(x.paidAt).toLocaleDateString()
            : null,

          method: x.method || '—'
        }));

        this.setColumns();
        this.calculateStats(); // 🔥
      });
  }

  /* ================= CALCULATE STATS ================= */

  calculateStats() {

    // Total Receivables = Pending + Overdue
    const unpaid = this.installments
      .filter(i => i.status === 'Pending' || i.status === 'Overdue')
      .reduce((sum, i) => sum + i.amount, 0);

    // Overdue فقط
    const overdue = this.installments
      .filter(i => i.status === 'Overdue')
      .reduce((sum, i) => sum + i.amount, 0);

    const overdueCount =
      this.installments.filter(i => i.status === 'Overdue').length;

    // Paid invoices
    const paid = this.invoices
      .filter(i => i.status === 'Paid')
      .reduce((sum, i) => sum + i.amount, 0);

    /* ================= UPDATE UI ================= */

    this.stats[0].value = `$${unpaid.toFixed(2)}`;
    this.stats[1].value = `$${overdue.toFixed(2)}`;
    this.stats[1].subtitle = `${overdueCount} High Priority`;
    this.stats[2].value = `$${paid.toFixed(2)}`;
  }

  /* ================= SEARCH ================= */

  onSearch(value: string) {

    this.searchValue = value;

    if (this.activeTab === 'installments')
      this.loadInstallments();
    else
      this.loadInvoices();
  }

  /* ================= STATUS ================= */

  onStatusChange(status: string) {

    this.selectedStatus = status;

    if (this.activeTab === 'installments')
      this.loadInstallments();
    else
      this.loadInvoices();
  }

}
