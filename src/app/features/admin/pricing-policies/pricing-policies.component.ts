import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { TablesComponent, TableColumn } from '../../../shared/components/tables/tables.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';

@Component({
  selector: 'app-pricing-policies',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    TablesComponent,
    SearchInputComponent
  ],
  templateUrl: './pricing-policies.component.html',
})
export class PricingPoliciesComponent implements OnInit {

  /* ================= DATA ================= */
  data: any[] = [];
  filteredData: any[] = [];

  search = '';

  /* ================= TABLE ================= */
  columns: TableColumn[] = [
    { key: 'name', label: 'Policy Name' },
    { key: 'effect', label: 'Effect' },
    { key: 'value', label: 'Value' },
    { key: 'conditions', label: 'Conditions' },
  ];

  /* ================= INIT ================= */
  ngOnInit(): void {
    this.loadData();
  }

  /* ================= LOAD ================= */
  loadData() {
    // 🔥 هنا هتربط بالـ API بعدين
    this.data = [
      {
        name: 'Early Bird Discount',
        effect: 'Discount',
        value: '10%',
        conditions: '1 Condition'
      },
      {
        name: 'Student Discount',
        effect: 'Discount',
        value: '$50',
        conditions: '2 Conditions'
      },
      {
        name: 'Peak Season Surcharge',
        effect: 'Increase',
        value: '15%',
        conditions: '1 Condition'
      }
    ];

    this.applyFilter();
  }

  /* ================= SEARCH ================= */
  onSearch(value: string) {
    this.search = value;
    this.applyFilter();
  }

  applyFilter() {
    if (!this.search) {
      this.filteredData = this.data;
      return;
    }

    this.filteredData = this.data.filter(item =>
      item.name.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  /* ================= ACTIONS ================= */
  onEdit(row: any) {
    console.log('Edit:', row);
  }

  openCreateModal() {
    console.log('Open Create Modal');
  }
}
