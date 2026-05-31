import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { Event, EventStatus, EventAccessType, CreateEventCommand } from './events.model';
import { EventModalComponent } from './event-modal/event-modal.component';
import { EventsService } from '../../../core/services/api/events.service';
import { AdminContextService } from '../../../core/services/api/admin-context.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, PageLayoutComponent, EventModalComponent],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  allEvents: Event[] = [];
  filteredEvents: Event[] = [];

  searchQuery = '';
  selectedStatus = 'All';
  selectedAccess = 'All';

  showCreateModal = false;
  createError: string | null = null;

  statusOptions = ['All', 'Draft', 'Published', 'Cancelled'];
  accessOptions = ['All', 'MembersOnly', 'Public'];

  clubId = '';
  totalCount = 0;
  publishedCount = 0;
  draftCount = 0;
  cancelledCount = 0;
  isLoading = false;

  constructor(
    private router: Router,
    private eventsService: EventsService,
    private adminContextService: AdminContextService
  ) {}

  ngOnInit() {
    this.adminContextService.getAdminContext().subscribe(ctx => {
      this.clubId = ctx.managedClubId;
      if (this.clubId) {
        this.loadStatusCounts();
        this.loadEvents();
      }
    });
  }

  loadStatusCounts() {
    if (!this.clubId) return;
    this.eventsService.getStatusCounts(this.clubId).subscribe({
      next: (counts) => {
        this.totalCount = counts.total;
        this.publishedCount = counts.published;
        this.draftCount = counts.draft;
        this.cancelledCount = counts.cancelled;
      },
      error: (err) => console.error('Failed to load status counts', err)
    });
  }

  loadEvents() {
    if (!this.clubId) return;
    this.isLoading = true;
    const statusFilter = this.selectedStatus === 'All' ? undefined : (this.selectedStatus as EventStatus);

    this.eventsService.getClubEvents(this.clubId, {
      search: this.searchQuery || undefined,
      status: statusFilter,
      page: 1,
      limit: 100
    }).subscribe({
      next: (res) => {
        this.allEvents = res.items;
        this.applyLocalFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load events', err);
        this.isLoading = false;
      }
    });
  }

  applyLocalFilters() {
    this.filteredEvents = this.allEvents.filter(e => {
      const matchAccess = this.selectedAccess === 'All' || e.accessType === this.selectedAccess;
      return matchAccess;
    });
  }

  onSearch() {
    this.loadEvents();
  }

  setStatus(s: string) {
    this.selectedStatus = s;
    this.loadEvents();
  }

  setAccess(a: string) {
    this.selectedAccess = a;
    this.applyLocalFilters();
  }

  manageEvent(event: Event) {
    this.router.navigate(['/admin/events', event.id]);
  }

  publishEvent(event: Event, domEvent: MouseEvent) {
    domEvent.stopPropagation();
    this.eventsService.publishEvent(event.id).subscribe({
      next: () => {
        event.status = 'Published';
        this.loadStatusCounts();
        this.loadEvents();
      },
      error: (err) => console.error('Failed to publish event', err)
    });
  }

  cancelEvent(event: Event, domEvent: MouseEvent) {
    domEvent.stopPropagation();
    this.eventsService.cancelEvent(event.id).subscribe({
      next: () => {
        event.status = 'Cancelled';
        this.loadStatusCounts();
        this.loadEvents();
      },
      error: (err) => console.error('Failed to cancel event', err)
    });
  }

  openCreateModal() { this.createError = null; this.showCreateModal = true; }
  closeCreateModal() { this.createError = null; this.showCreateModal = false; }

  onCreateEvent(cmd: CreateEventCommand) {
    if (!this.clubId) return;
    this.createError = null;
    this.eventsService.createEvent({ ...cmd, clubId: this.clubId }).subscribe({
      next: (res) => {
        this.closeCreateModal();
        this.loadStatusCounts();
        this.loadEvents();
        this.router.navigate(['/admin/events', res.id]);
      },
      error: (err) => {
        console.error('Failed to create event', err);
        this.createError = err?.error?.detail || err?.error?.title || 'Failed to create event.';
      }
    });
  }

  getStatusClass(status: EventStatus): string {
    const map: Record<EventStatus, string> = {
      Published: 'badge-published',
      Draft: 'badge-draft',
      Cancelled: 'badge-cancelled',
    };
    return map[status];
  }

  getAccessClass(access: EventAccessType): string {
    return access === 'MembersOnly' ? 'badge-members' : 'badge-public';
  }

  getCapacityPercent(event: Event): number {
    if (event.capacity === 0) return 0;
    return Math.min(100, Math.round(((event.capacity - event.remainingCapacity) / event.capacity) * 100));
  }

  formatDateRange(start: string, end: string): string {
    const s = new Date(start);
    const e = new Date(end);
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    if (s.toDateString() === e.toDateString()) {
      return s.toLocaleDateString('en-GB', { ...opts, year: 'numeric' });
    }
    return `${s.toLocaleDateString('en-GB', opts)} – ${e.toLocaleDateString('en-GB', { ...opts, year: 'numeric' })}`;
  }

  getGradient(index: number): string {
    const gradients = [
      'linear-gradient(135deg, #491F8D, #8A6DFF)',
      'linear-gradient(135deg, #1a6985, #00D1FF)',
      'linear-gradient(135deg, #7c3a1a, #f5a623)',
      'linear-gradient(135deg, #1a5c3a, #4ade80)',
      'linear-gradient(135deg, #6b1a4a, #FF5A5F)',
    ];
    return gradients[index % gradients.length];
  }
}
