// application-reviews.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';

import {
  TableColumn,
  TablesComponent,
} from '../../../shared/components/tables/tables.component';

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
  ],

  templateUrl: './application-reviews.component.html',
})

export class ApplicationReviewsComponent {

  // =========================================================
  // FILTERS
  // =========================================================

  search = '';

  selectedStatus = 'All statuses';

  statusOptions = [
    'All statuses',
    'Submitted',
    'Approved',
    'Rejected',
    'UnderReview',
  ];

  dateFrom = '';

  dateTo = '';

  // =========================================================
  // TABLE COLUMNS
  // =========================================================

  columns: TableColumn[] = [

    {
      key: 'trackingNumber',
      label: 'Tracking #',
    },

    {
      key: 'member',
      label: 'Member Name',
    },

    {
      key: 'plan',
      label: 'Plan',
    },

    {
      key: 'submittedAt',
      label: 'Submitted',
    },

    {
      key: 'statusText',
      label: 'Status',
    },

  ];

  // =========================================================
  // DATA
  // =========================================================

  data: any[] = [
    {
      trackingNumber: 'APP-2025-001',

      member: `
        John Smith
        john.smith@email.com
      `,

      plan: 'Annual Gold Membership',

      submittedAt: 'Feb 10, 2025',

      statusText: 'Submitted',

      isActive: true,
    },

    {
      trackingNumber: 'APP-2025-002',

      member: `
        Sarah Johnson
        sarah.j@email.com
      `,

      plan: 'Quarterly Silver Membership',

      submittedAt: 'Feb 11, 2025',

      statusText: 'Approved',

      isActive: true,
    },

    {
      trackingNumber: 'APP-2025-003',

      member: `
        Tech Corp Inc.
        contact@techcorp.com
      `,

      plan: 'Family Platinum Membership',

      submittedAt: 'Feb 13, 2025',

      statusText: 'UnderReview',

      isActive: true,
    },
  ];

  // =========================================================
  // EVENTS
  // =========================================================

  onSearch(value: string) {

    this.search = value;

    console.log(value);

  }

  onStatusChange(value: string) {

    this.selectedStatus = value;

    console.log(value);

  }

  onEdit(row: any) {

    console.log('View Application:', row);

  }

  onToggleStatus(row: any) {

    console.log('Toggle:', row);

  }

}
