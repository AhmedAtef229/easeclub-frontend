import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { TablesComponent, TableColumn } from '../../../shared/components/tables/tables.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
@Component({
  selector: 'app-memberships',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, TablesComponent,SearchInputComponent],
  templateUrl: './memberships.component.html',
})
export class MembershipsComponent {

  activeTab:  'active' | 'expired' = 'active';

  columns: TableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'date', label: 'Date Applied' },
    { key: 'type', label: 'Type', type: 'badge' },
  ];

  data = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      date: '2026-01-10',
      type: 'Premium',
    },
    {
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      phone: '+1 234 567 8901',
      date: '2026-01-12',
      type: 'Standard',
    },
    {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1 234 567 8902',
      date: '2026-01-13',
      type: 'Premium',
    },
  ];
    onSearch(value: string) {
  const text = value.toLowerCase();

   this.data = this.data.filter(plan =>
     plan.name.toLowerCase().includes(text) ||
     plan.email.toLowerCase().includes(text) ||
     plan.phone.toLowerCase().includes(text) ||
     plan.date.toLowerCase().includes(text)
   );
}
}
