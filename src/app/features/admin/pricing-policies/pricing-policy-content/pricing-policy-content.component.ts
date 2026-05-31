import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TablesComponent,
  TableColumn,
} from '../../../../shared/components/tables/tables.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { PricingPoliciesService } from '../../../../core/services/api/pricing-policies.service';
import { BranchService } from '../../../../core/services/api/branches.service';
import { CreatePolicyModalComponent } from '../../../../shared/components/modals/create-policy-modal/create-policy-modal.component';

@Component({
  selector: 'app-pricing-policy-content',
  standalone: true,
  imports: [CommonModule, TablesComponent, SearchInputComponent, CreatePolicyModalComponent],
  templateUrl: './pricing-policy-content.component.html',
})
export class PricingPolicyContentComponent implements OnInit {

  constructor(
    private pricingService: PricingPoliciesService,
    private branchService: BranchService
  ) {}

  clubId!: string;

  data: any[] = [];
  filteredData: any[] = [];

  search = '';

  columns: TableColumn[] = [
    { key: 'name', label: 'Policy Name', type: 'policy-name' },
    { key: 'compatibility', label: 'Compatibility', type: 'badge' },
    { key: 'conditions', label: 'Conditions' },
  ];

  ngOnInit(): void {
    this.clubId = this.branchService.getClubId();
    this.loadData();
  }

  /* ================= LOAD FROM API ================= */

  loadData() {
    this.pricingService.getAllPolicies(this.clubId).subscribe({
      next: (res) => {

        // 🔥 transform الداتا عشان تناسب الجدول
        this.data = res.map((item: any) => ({
          id: item.id,
          name: item.name,

          // Compatibility badge list
          compatibility: this.getCompatibility(item),

          // Conditions count
          conditions: `${item.conditions?.length || 0} Condition${item.conditions?.length === 1 ? '' : 's'}`,

          // Keep original data for editing
          originalData: item,
          value: this.getValue(item)
        }));

        this.applyFilter();
      },
      error: (err) => {
        console.error('❌ Error loading policies:', err);
      }
    });
  }

  /* ================= HELPERS ================= */

  getCompatibility(item: any): string[] {
    const eventKeys = new Set([
      'attendeecategory', 'ticketbaseprice', 'attendeeage',
      'attendeegender', 'attendeecount', 'guestcount',
      'familymembercount', 'ismember'
    ]);

    const requiredKeys: string[] = [];
    if (item.conditions) {
      item.conditions.forEach((c: any) => {
        if (c.fieldKey) requiredKeys.push(c.fieldKey.toLowerCase());
      });
    }
    if (item.multiplierSourceKey) {
      requiredKeys.push(item.multiplierSourceKey.toLowerCase());
    }

    if (requiredKeys.length === 0) {
      return ['Event', 'Template'];
    }

    const allKeysAreEventKeys = requiredKeys.every(k => eventKeys.has(k));
    if (allKeysAreEventKeys) {
      return ['Event', 'Template'];
    } else {
      return ['Template Only'];
    }
  }

  getValue(item: any): string {
    if (item.percentageValue != null) return `${item.percentageValue * 100}%`;
    if (item.fixedAmount != null) return `${item.fixedAmount} EGP`;
    return '-';
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

    this.filteredData = this.data.filter((item) =>
      item.name.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  /* ================= ACTIONS ================= */




showModal = false;
isEdit = false;
selectedPolicy: any = null;

openCreate() {
  this.isEdit = false;
  this.selectedPolicy = null;
  this.showModal = true;
}

openEdit(row: any) {
  this.isEdit = true;
  
  // Map original API data to match the form structure in the modal
  const item = row.originalData;

  // Detect target type from condition field keys
  const eventKeys = new Set([
    'attendeecategory', 'requiresmembership', 'ticketbaseprice',
    'attendeeage', 'attendeegender', 'attendeecount',
    'guestcount', 'familymembercount', 'ismember'
  ]);
  const conditionKeys: string[] = (item.conditions || []).map((c: any) => c.fieldKey?.toLowerCase());
  const multiplierKey = item.multiplierSourceKey?.toLowerCase();
  const allKeys = multiplierKey ? [...conditionKeys, multiplierKey] : conditionKeys;
  const isEventTarget = allKeys.length === 0 || allKeys.every((k: string) => eventKeys.has(k));

  this.selectedPolicy = {
    id: item.id,
    name: item.name,
    type: item.isIncrease ? 'increase' : 'discount',
    targetType: isEventTarget ? 'Event' : 'Template',
    method: item.percentageValue ? 'percentage' : 'fixed',
    amount: item.fixedAmount,
    percentage: item.percentageValue ? item.percentageValue * 100 : null,
    multiplierSource: item.multiplierSourceKey || 'BaseFee',
    conditions: item.conditions ? item.conditions.map((c: any) => ({
      field: c.fieldKey,
      operator: c.operator,
      value: c.expectedValue
    })) : []
  };
  
  this.showModal = true;
}

onSavePolicy(data: any) {
  // Map form data back to API payload format
  const payload = {
    clubId: this.clubId,
    name: data.name,
    priority: 1, // Default priority
    isIncrease: data.type === 'increase',
    fixedAmount: data.method === 'fixed' ? data.amount : undefined,
    percentageValue: data.method === 'percentage' ? (data.percentage / 100) : undefined,
    multiplierKey: data.method === 'percentage' ? data.multiplierSource : undefined,
    conditions: data.conditions ? data.conditions.map((c: any) => ({
      fieldKey: c.field,
      operator: c.operator,
      expectedValue: String(c.value) // Ensure value is sent as string per DTO
    })) : []
  };

  if (this.isEdit) {
    this.pricingService.updatePolicy(this.selectedPolicy.id, { ...payload, id: this.selectedPolicy.id }).subscribe({
      next: () => {
        this.showModal = false;
        this.loadData(); // Refresh table
      },
      error: (err) => {
        console.error('❌ Error updating policy:', err);
      }
    });
  } else {
    this.pricingService.createPolicy(payload).subscribe({
      next: () => {
        this.showModal = false;
        this.loadData(); // Refresh table
      },
      error: (err) => {
        console.error('❌ Error creating policy:', err);
      }
    });
  }
}

  showViewModal = false;
  viewingPolicy: any = null;

  openView(row: any) {
    this.viewingPolicy = row.originalData;
    this.showViewModal = true;
  }

  closeView() {
    this.showViewModal = false;
    this.viewingPolicy = null;
  }

  getConditionSummary(c: any): string {
    return `${c.fieldKey} ${this.formatOperator(c.operator)} "${c.expectedValue}"`;
  }

  formatOperator(op: string): string {
    switch (op) {
      case 'Equals': return '=';
      case 'NotEquals': return '!=';
      case 'GreaterThan': return '>';
      case 'LessThan': return '<';
      default: return op;
    }
  }
}
