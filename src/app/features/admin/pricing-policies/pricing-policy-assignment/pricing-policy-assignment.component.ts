import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingPoliciesService } from '../../../../core/services/api/pricing-policies.service';

@Component({
  selector: 'app-pricing-policy-assignment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing-policy-assignment.component.html',
})
export class PricingPolicyAssignmentComponent {

  constructor(private pricingService: PricingPoliciesService) {}

  targetType = '';
  target = '';

  targetTypes = [
    { label: 'Application Template', value: 'ApplicationTemplate' },
    { label: 'Event', value: 'Event' },
  ];

  targets: any[] = [];

  assignments: any[] = [];

  /* ================= TARGET TYPE ================= */

  onTargetTypeChange(value: string) {
    this.targetType = value;

    // 🔥 هنا بعدين تجيب targets من API
    this.targets = [];
  }

  /* ================= TARGET SELECT ================= */

  onTargetChange(value: string) {
    this.target = value;

    this.loadAssignments();
  }

  /* ================= LOAD ASSIGNMENTS ================= */

  loadAssignments() {
    if (!this.targetType || !this.target) return;

    this.pricingService
      .getAssignments(this.targetType, this.target)
      .subscribe({
        next: (res) => {
          this.assignments = res;
          console.log('Assignments:', res);
        },
        error: (err) => {
          console.error('❌ Error loading assignments:', err);
        }
      });
  }
}
