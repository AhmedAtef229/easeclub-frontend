import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipPlan } from '../../../../../core/services/api/membership-plans.service';
import { InstallmentTemplatesService, InstallmentTemplate, TemplateDetails } from '../../../../../core/services/api/installment-templates.service';
import { BranchService } from '../../../../../core/services/api/branches.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-membership-plan-link-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './membership-plan-link-modal.component.html',
})
export class MembershipPlanLinkModalComponent implements OnInit {
  @Input() plan!: MembershipPlan;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<string[]>();

  templates: (InstallmentTemplate & { details?: TemplateDetails })[] = [];
  selectedIds: string[] = [];
  loading = true;

  constructor(
    private installmentService: InstallmentTemplatesService,
    private branchService: BranchService
  ) {}

  ngOnInit(): void {
    const clubId = this.branchService.getClubId();
    this.selectedIds = this.plan.installmentTemplateIds || 
                       this.plan.templates?.map((t: any) => t.id) || 
                       [];

    this.installmentService.getAll(clubId, { active: true }).subscribe({
      next: (allTemplates) => {
        // 2. Fetch details for all active templates to show breakdown
        const detailRequests = allTemplates.map(t => this.installmentService.getById(t.id));

        if (detailRequests.length === 0) {
          this.loading = false;
          return;
        }

        forkJoin(detailRequests).subscribe({
          next: (detailsList) => {
            this.templates = allTemplates.map((t, index) => ({
              ...t,
              details: detailsList[index]
            }));
            this.loading = false;
          },
          error: (err) => {
            console.error('Error fetching template details', err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error fetching templates', err);
        this.loading = false;
      }
    });
  }

  toggleTemplate(id: string) {
    if (this.selectedIds.includes(id)) {
      this.selectedIds = this.selectedIds.filter(x => x !== id);
    } else {
      this.selectedIds = [...this.selectedIds, id];
    }
  }

  submit() {
    this.save.emit(this.selectedIds);
  }

  getInstallmentAmount(percentage: number): string {
    const amount = (this.plan.price * percentage) / 100;
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  isSelected(id: string): boolean {
    return this.selectedIds.includes(id);
  }
}
