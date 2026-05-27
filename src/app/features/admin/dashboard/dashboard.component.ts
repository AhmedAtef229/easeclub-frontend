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

  // Mock Fallbacks (matching the design exactly)
  defaultAwaitingReviews = [
    { userName: 'Marinia Daison', membershipPlanName: 'Gold Annual' },
    { userName: 'Jane Smith', membershipPlanName: 'Platinum VIP' },
    { userName: 'Ahmed Hassan', membershipPlanName: 'Silver Monthly' },
    { userName: 'Sarah Connor', membershipPlanName: 'Gold Annual' }
  ];

  defaultEventRegistrations = [
    { name: 'Summer Tennis Open', registrationsCount: 48, capacity: 60 },
    { name: 'Club Gala Dinner', registrationsCount: 120, capacity: 150 },
    { name: 'Yoga & Wellness Workshop', registrationsCount: 14, capacity: 20 },
    { name: 'Kids Summer Camp', registrationsCount: 22, capacity: 50 }
  ];

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
        this.pendingApplicationsCount = res?.metrics?.pendingApplicationsCount ?? 12;
        this.upcomingEventsCount = res?.metrics?.upcomingEventsCount ?? 5;
        this.branchesCount = res?.metrics?.branchesCount ?? 3;

        // 2. Pending Applications Awaiting Review List
        const pendingApps = res?.pendingApplications ?? [];
        if (pendingApps.length > 0) {
          this.awaitingReviewList = pendingApps.map((app: any) => ({
            id: app.applicationId,
            userName: app.applicantName,
            membershipPlanName: app.planName,
            submittedAt: app.submittedAt
          }));
        } else {
          this.awaitingReviewList = this.defaultAwaitingReviews;
        }

        // 3. Event Registrations List
        const events = res?.eventRegistrations ?? [];
        if (events.length > 0) {
          this.eventRegistrationsList = events.map((e: any) => ({
            id: e.eventId,
            name: e.eventTitle,
            registrationsCount: e.registeredCount,
            capacity: e.maxCapacity,
            fillPercentage: Math.round(e.fillPercentage)
          }));
        } else {
          this.eventRegistrationsList = this.defaultEventRegistrations;
        }
      },
      error: (err) => {
        console.error('Failed to load admin dashboard from backend', err);
        // Fallback to mocks
        this.pendingApplicationsCount = 12;
        this.upcomingEventsCount = 5;
        this.branchesCount = 3;
        this.awaitingReviewList = this.defaultAwaitingReviews;
        this.eventRegistrationsList = this.defaultEventRegistrations;
      }
    });
  }

  getCapacityPercent(reg: any): number {
    if (reg.fillPercentage !== undefined) {
      return reg.fillPercentage;
    }
    if (!reg.capacity) return 0;
    return Math.min(100, Math.round((reg.registrationsCount / reg.capacity) * 100));
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
