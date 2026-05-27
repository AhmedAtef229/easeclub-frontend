import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { ClubSettingService } from '../../../core/services/api/club-setting.service';
import { BranchService } from '../../../core/services/api/branches.service';
import { AdminContextService } from '../../../core/services/api/admin-context.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, PageLayoutComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  clubId = '';

  // Stats Counters
  pendingApplicationsCount = 0;
  upcomingEventsCount = 0;
  branchesCount = 0;

  // Lists
  awaitingReviewList: any[] = [];
  eventRegistrationsList: any[] = [];

  constructor(
    private router: Router,
    private clubSettingService: ClubSettingService,
    private branchService: BranchService,
    private adminContextService: AdminContextService
  ) {}

  ngOnInit() {
    this.adminContextService.getAdminContext().subscribe(ctx => {
      this.clubId = ctx.managedClubId || this.branchService.getClubId();
      if (this.clubId) {
        this.loadDashboardData();
      }
    });
  }

  loadDashboardData() {
    this.clubSettingService.getAdminDashboard(this.clubId).subscribe({
      next: (res: any) => {
        // 1. Metrics
        this.pendingApplicationsCount = res?.metrics?.pendingApplicationsCount ?? 0;
        this.upcomingEventsCount = res?.metrics?.upcomingEventsCount ?? 0;
        this.branchesCount = res?.metrics?.branchesCount ?? 0;

        // 2. Pending Applications Awaiting Review List
        const pendingApps = res?.pendingApplications ?? [];
        this.awaitingReviewList = pendingApps.map((app: any) => ({
          id: app.applicationId,
          userName: app.applicantName,
          membershipPlanName: app.planName,
          submittedAt: app.submittedAt
        }));

        // 3. Event Registrations List
        const events = res?.eventRegistrations ?? [];
        this.eventRegistrationsList = events.map((e: any) => ({
          id: e.eventId,
          name: e.eventTitle,
          soldTickets: e.soldTickets,
          capacity: e.maxCapacity,
          fillPercentage: Math.round(e.fillPercentage ?? 0)
        }));
      },
      error: (err) => {
        console.error('Failed to load admin dashboard from backend', err);
        this.pendingApplicationsCount = 0;
        this.upcomingEventsCount = 0;
        this.branchesCount = 0;
        this.awaitingReviewList = [];
        this.eventRegistrationsList = [];
      }
    });
  }

  getCapacityPercent(reg: any): number {
    if (reg.fillPercentage !== undefined) {
      return reg.fillPercentage;
    }
    if (!reg.capacity) return 0;
    return Math.min(100, Math.round((reg.soldTickets / reg.capacity) * 100));
  }

  navigateToReviews() {
    this.router.navigate(['/admin/application-reviews']);
  }

  navigateToEvents() {
    this.router.navigate(['/admin/events']);
  }

  navigateToBranches() {
    this.router.navigate(['/admin/branches']);
  }
}
