import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PricingPoliciesService, PricingPolicy, PolicyAssignment } from '../../../../core/services/api/pricing-policies.service';
import { ApplicationTemplateService } from '../../../../core/services/api/application-templates.service';
import { BranchService } from '../../../../core/services/api/branches.service';

@Component({
  selector: 'app-pricing-policy-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pricing-policy-assignment.component.html',
})
export class PricingPolicyAssignmentComponent implements OnInit {
  clubId!: string;
  templates: any[] = [];
  selectedTemplateId = '';

  // Currently assigned policies
  assignments: PolicyAssignment[] = [];
  assignmentsLoaded = false;

  // Available policies for assignment (compatible with selected template)
  availablePolicies: PricingPolicy[] = [];
  policiesLoaded = false;

  // Drawer / Assign form state
  showAssignForm = false;
  assigningPolicyId = '';
  assigningPriority = 1;
  assignError = '';
  isAssigning = false;

  constructor(
    private pricingService: PricingPoliciesService,
    private templateService: ApplicationTemplateService,
    private branchService: BranchService
  ) {}

  ngOnInit(): void {
    this.clubId = this.branchService.getClubId();
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.templateService.getTemplates(this.clubId).subscribe({
      next: (res) => {
        this.templates = res.items || [];
      },
      error: (err) => console.error('Failed to load templates', err)
    });
  }

  selectedTemplateFieldKeys = new Set<string>();

  onTemplateChange(templateId: string): void {
    this.selectedTemplateId = templateId;
    this.assignments = [];
    this.assignmentsLoaded = false;
    this.showAssignForm = false;
    this.selectedTemplateFieldKeys.clear();
    
    if (templateId) {
      this.loadAssignments();
      this.loadCompatiblePolicies();
      this.loadTemplateDetails();
    }
  }

  loadTemplateDetails(): void {
    this.selectedTemplateFieldKeys.clear();
    this.templateService.getTemplateById(this.selectedTemplateId).subscribe({
      next: (res) => {
        const keys = new Set<string>();
        // Always support basefee
        keys.add('basefee');

        if (res && res.steps) {
          res.steps.forEach((step: any) => {
            if (step.sections) {
              step.sections.forEach((sec: any) => {
                if (sec.fields) {
                  sec.fields.forEach((f: any) => {
                    if (f.key) {
                      keys.add(f.key.toLowerCase());
                    }
                  });
                }
              });
            }
          });
        }
        this.selectedTemplateFieldKeys = keys;
      },
      error: (err) => console.error('Failed to load template details', err)
    });
  }

  loadAssignments(): void {
    this.pricingService.getAssignments('ApplicationTemplate', this.selectedTemplateId).subscribe({
      next: (res) => {
        this.assignments = res;
        this.assignmentsLoaded = true;
      },
      error: (err) => console.error('Failed to load assignments', err)
    });
  }

  loadCompatiblePolicies(): void {
    this.pricingService.getCompatiblePolicies(this.clubId, 'ApplicationTemplate', this.selectedTemplateId).subscribe({
      next: (res) => {
        this.availablePolicies = res;
        this.policiesLoaded = true;
      },
      error: (err) => console.error('Failed to load compatible policies', err)
    });
  }

  get unassignedCompatiblePolicies(): PricingPolicy[] {
    const assignedIds = new Set(this.assignments.map(a => a.policyId));
    return this.availablePolicies.filter(p => !assignedIds.has(p.id));
  }

  openAssignForm(): void {
    this.assigningPolicyId = '';
    this.assigningPriority = (this.assignments.length || 0) + 1;
    this.assignError = '';
    this.showAssignForm = true;
  }

  closeAssignForm(): void {
    this.showAssignForm = false;
    this.assignError = '';
  }

  doAssignPolicy(): void {
    if (!this.assigningPolicyId) {
      this.assignError = 'Please select a policy.';
      return;
    }
    if (!this.assigningPriority || this.assigningPriority < 1) {
      this.assignError = 'Priority must be at least 1.';
      return;
    }

    this.isAssigning = true;
    this.assignError = '';

    this.pricingService.assignPolicies({
      targetId: this.selectedTemplateId,
      targetType: 'ApplicationTemplate',
      priority: this.assigningPriority,
      policies: [{ policyId: this.assigningPolicyId, priority: this.assigningPriority }]
    }).subscribe({
      next: () => {
        this.isAssigning = false;
        this.closeAssignForm();
        this.loadAssignments();
      },
      error: (err) => {
        this.isAssigning = false;
        this.assignError = err?.error?.detail || err?.error?.title || 'Failed to assign policy.';
      }
    });
  }

  doUnassignPolicy(policyId: string): void {
    const confirmed = confirm('Are you sure you want to unassign this policy from the template?');
    if (!confirmed) return;

    this.pricingService.unassignPolicy({
      policyId,
      targetId: this.selectedTemplateId,
      targetType: 'ApplicationTemplate'
    }).subscribe({
      next: () => {
        this.assignments = this.assignments.filter(a => a.policyId !== policyId);
      },
      error: (err) => console.error('Failed to unassign policy', err)
    });
  }

  // Helpers to fetch policy metadata for listing
  getPolicyByAssignment(policyId: string): PricingPolicy | undefined {
    return this.availablePolicies.find(p => p.id === policyId);
  }

  getPolicyEffect(policy: PricingPolicy): string {
    if (policy.percentageValue != null) {
      return `${policy.isIncrease ? '+' : '-'}${policy.percentageValue * 100}%`;
    }
    if (policy.fixedAmount != null) {
      return `${policy.isIncrease ? '+' : '-'}${policy.fixedAmount} EGP`;
    }
    return '—';
  }

  getConditionSummary(policy: PricingPolicy): string {
    if (!policy.conditions || policy.conditions.length === 0) {
      return 'Applies unconditionally';
    }
    return 'Applies if: ' + policy.conditions.map(c => `${c.fieldKey} ${this.formatOperator(c.operator)} "${c.expectedValue}"`).join(' AND ');
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

  get selectedAssigningPolicy(): PricingPolicy | undefined {
    return this.availablePolicies.find(p => p.id === this.assigningPolicyId);
  }

  get policyRequirements(): { key: string; exists: boolean; type: string }[] {
    const policy = this.selectedAssigningPolicy;
    if (!policy) return [];

    const reqs: { key: string; exists: boolean; type: string }[] = [];

    // Add multiplier source key if it is present
    if (policy.multiplierSourceKey) {
      const key = policy.multiplierSourceKey;
      reqs.push({
        key,
        exists: this.selectedTemplateFieldKeys.has(key.toLowerCase()),
        type: 'Multiplier'
      });
    }

    // Add condition field keys
    if (policy.conditions) {
      policy.conditions.forEach(c => {
        if (c.fieldKey) {
          const key = c.fieldKey;
          reqs.push({
            key,
            exists: this.selectedTemplateFieldKeys.has(key.toLowerCase()),
            type: 'Condition Field'
          });
        }
      });
    }

    return reqs;
  }
}
