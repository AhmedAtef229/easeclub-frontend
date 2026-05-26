import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { Event, EventStatus, EventAccessType, CreateEventCommand } from './events.model';
import { MOCK_EVENTS } from './events.mock';
import { EventModalComponent } from './event-modal/event-modal.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, PageLayoutComponent,EventModalComponent],
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

  statusOptions = ['All', 'Draft', 'Published', 'Cancelled'];
  accessOptions = ['All', 'MembersOnly', 'Public'];

  constructor(private router: Router) {}

  ngOnInit() {
    this.allEvents = [...MOCK_EVENTS];
    this.applyFilters();
  }

  get totalCount() { return this.allEvents.length; }
  get publishedCount() { return this.allEvents.filter(e => e.status === 'Published').length; }
  get draftCount() { return this.allEvents.filter(e => e.status === 'Draft').length; }
  get cancelledCount() { return this.allEvents.filter(e => e.status === 'Cancelled').length; }

  applyFilters() {
    this.filteredEvents = this.allEvents.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchStatus = this.selectedStatus === 'All' || e.status === this.selectedStatus;
      const matchAccess = this.selectedAccess === 'All' || e.accessType === this.selectedAccess;
      return matchSearch && matchStatus && matchAccess;
    });
  }

  onSearch() { this.applyFilters(); }
  setStatus(s: string) { this.selectedStatus = s; this.applyFilters(); }
  setAccess(a: string) { this.selectedAccess = a; this.applyFilters(); }

  manageEvent(event: Event) {
    this.router.navigate(['/admin/events', event.id]);
  }

  publishEvent(event: Event, domEvent: MouseEvent) {
    domEvent.stopPropagation();
    event.status = 'Published';
    this.applyFilters();
  }

  cancelEvent(event: Event, domEvent: MouseEvent) {
    domEvent.stopPropagation();
    event.status = 'Cancelled';
    this.applyFilters();
  }

  openCreateModal() { this.showCreateModal = true; }
  closeCreateModal() { this.showCreateModal = false; }

  onCreateEvent(cmd: CreateEventCommand) {
    const newEvent: Event = {
      id: Date.now().toString(),
      name: cmd.name,
      description: cmd.description,
      startDate: cmd.startDate,
      endDate: cmd.endDate,
      venue: cmd.venue,
      capacity: cmd.capacity,
      registrationsCount: 0,
      accessType: cmd.accessType,
      status: 'Draft',
      imageUrl: cmd.imageUrl,
      badge: cmd.badge,
      ticketTypes: [],
    };
    this.allEvents.unshift(newEvent);
    this.closeCreateModal();
    this.applyFilters();
    this.router.navigate(['/admin/events', newEvent.id]);
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
    return Math.min(100, Math.round((event.registrationsCount / event.capacity) * 100));
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
