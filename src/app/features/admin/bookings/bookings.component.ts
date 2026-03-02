import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { TablesComponent, TableColumn } from '../../../shared/components/tables/tables.component';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    TablesComponent
  ],
  templateUrl: './bookings.component.html',
})
export class BookingsComponent {

  columns: TableColumn[] = [
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'facility', label: 'Facility' },
    { key: 'user', label: 'User' },
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: 'status', label: 'Status', type: 'badge' },
  ];

  data = [
    {
      bookingId: 'B001',
      facility: 'Tennis Court 1',
      user: 'Alice Brown',
      date: '2026-01-18',
      time: '10:00 AM - 11:00 AM',
      status: 'Confirmed',
    },
    {
      bookingId: 'B002',
      facility: 'Swimming Pool',
      user: 'Robert Lee',
      date: '2026-01-20',
      time: '2:00 PM - 3:00 PM',
      status: 'Confirmed',
    },
    {
      bookingId: 'B003',
      facility: 'Gym',
      user: 'Emma Davis',
      date: '2026-01-19',
      time: '7:00 AM - 8:00 AM',
      status: 'Pending',
    },
    {
      bookingId: 'B004',
      facility: 'Basketball Court',
      user: 'John Doe',
      date: '2026-01-21',
      time: '5:00 PM - 6:00 PM',
      status: 'Confirmed',
    },
    {
      bookingId: 'B005',
      facility: 'Tennis Court 2',
      user: 'Sarah Smith',
      date: '2026-01-17',
      time: '9:00 AM - 10:00 AM',
      status: 'Cancelled',
    },
  ];
}
