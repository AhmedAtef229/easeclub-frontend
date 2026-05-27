import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Event, TicketType, EventRegistration,
  EventStatus, CreateEventCommand, CreateTicketCommand
} from '../events.model';
import { EventModalComponent } from '../event-modal/event-modal.component';
import { TicketModalComponent } from '../ticket-modal/ticket-modal.component';
import { EventsService } from '../../../../core/services/api/events.service';

type Tab = 'tickets' | 'registrations';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, EventModalComponent, TicketModalComponent],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
})
export class EventDetailsComponent implements OnInit {
  event: Event | null = null;
  registrations: EventRegistration[] = [];
  registrationsLoaded = false;
  eventId = '';

  activeTab: Tab = 'tickets';
  expandedRegId: string | null = null;

  showEditModal = false;
  showTicketModal = false;
  editingTicket: TicketType | null = null;

  showConfirmPublish = false;
  showConfirmCancel = false;
  showConfirmDeleteTicket = false;
  ticketToDelete: TicketType | null = null;
  showConfirmCancelReg = false;
  regToCancel: EventRegistration | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventId = id;
      this.loadEventDetails();
    }
  }

  loadEventDetails() {
    this.eventsService.getEventById(this.eventId).subscribe({
      next: (event) => {
        this.event = event;
        if (this.activeTab === 'registrations') {
          this.loadRegistrations();
        }
      },
      error: (err) => console.error('Failed to load event details', err)
    });
  }

  loadRegistrations() {
    this.eventsService.getEventRegistrations(this.eventId, 1, 100).subscribe({
      next: (res) => {
        this.registrations = res.items.map((r: any) => ({
          id: r.id,
          eventId: r.eventId,
          registrantName: `User ${r.registrantId.substring(0, 4)}`,
          registrantInitials: 'U',
          status: r.status,
          attendeeCount: r.attendees?.length || 0,
          totalPrice: r.finalTotal || (r.totalBasePrice - r.discountAmount),
          appliedPolicies: r.appliedPolicies ? r.appliedPolicies.split(',') : [],
          attendees: (r.attendees || []).map((a: any) => ({
            id: a.id,
            name: a.attendeeName,
            ticketCategory: 'Public', // Fallback display category
            age: a.age || 0,
            gender: a.gender || ''
          }))
        }));
        this.registrationsLoaded = true;
      },
      error: (err) => console.error('Failed to load registrations', err)
    });
  }

  // ─── Navigation ─────────────────────────────────
  goBack() { this.router.navigate(['/admin/events']); }

  // ─── Tabs ───────────────────────────────────────
  switchTab(tab: Tab) {
    this.activeTab = tab;
    if (tab === 'registrations' && !this.registrationsLoaded) {
      this.loadRegistrations();
    }
  }

  // ─── Edit Event ─────────────────────────────────
  openEditModal() { this.showEditModal = true; }
  closeEditModal() { this.showEditModal = false; }
  onEditSave(cmd: CreateEventCommand) {
    if (!this.event) return;
    this.eventsService.updateEvent(this.eventId, { ...cmd, id: this.eventId }).subscribe({
      next: () => {
        this.loadEventDetails();
        this.closeEditModal();
      },
      error: (err) => console.error('Failed to update event', err)
    });
  }

  // ─── Publish / Cancel Event ─────────────────────
  confirmPublish() { this.showConfirmPublish = true; }
  doPublish() {
    if (!this.event) return;
    this.eventsService.publishEvent(this.eventId).subscribe({
      next: () => {
        this.loadEventDetails();
        this.showConfirmPublish = false;
      },
      error: (err) => {
        console.error('Failed to publish event', err);
        this.showConfirmPublish = false;
      }
    });
  }

  confirmCancel() { this.showConfirmCancel = true; }
  doCancel() {
    if (!this.event) return;
    this.eventsService.cancelEvent(this.eventId).subscribe({
      next: () => {
        this.loadEventDetails();
        this.showConfirmCancel = false;
      },
      error: (err) => {
        console.error('Failed to cancel event', err);
        this.showConfirmCancel = false;
      }
    });
  }

  // ─── Ticket CRUD ─────────────────────────────────
  openAddTicket() { this.editingTicket = null; this.showTicketModal = true; }
  openEditTicket(t: TicketType) { this.editingTicket = t; this.showTicketModal = true; }
  closeTicketModal() { this.showTicketModal = false; this.editingTicket = null; }

  onTicketSave(cmd: CreateTicketCommand) {
    if (!this.event) return;
    if (this.editingTicket) {
      this.eventsService.updateTicketType(this.eventId, this.editingTicket.id, {
        ...cmd,
        ticketTypeId: this.editingTicket.id
      }).subscribe({
        next: () => {
          this.loadEventDetails();
          this.closeTicketModal();
        },
        error: (err) => console.error('Failed to update ticket type', err)
      });
    } else {
      this.eventsService.addTicketType(this.eventId, cmd).subscribe({
        next: () => {
          this.loadEventDetails();
          this.closeTicketModal();
        },
        error: (err) => console.error('Failed to add ticket type', err)
      });
    }
  }

  confirmDeleteTicket(t: TicketType) { this.ticketToDelete = t; this.showConfirmDeleteTicket = true; }
  doDeleteTicket() {
    if (!this.event || !this.ticketToDelete) return;
    this.eventsService.removeTicketType(this.eventId, this.ticketToDelete.id).subscribe({
      next: () => {
        this.loadEventDetails();
        this.ticketToDelete = null;
        this.showConfirmDeleteTicket = false;
      },
      error: (err) => console.error('Failed to delete ticket type', err)
    });
  }

  // ─── Registrations ───────────────────────────────
  toggleRegExpand(regId: string) {
    this.expandedRegId = this.expandedRegId === regId ? null : regId;
  }

  confirmCancelReg(reg: EventRegistration) { this.regToCancel = reg; this.showConfirmCancelReg = true; }
  doCancelReg() {
    if (!this.regToCancel) return;
    this.eventsService.cancelRegistration(this.eventId, this.regToCancel.id).subscribe({
      next: () => {
        if (this.activeTab === 'registrations') {
          this.loadRegistrations();
        }
        this.loadEventDetails();
        this.regToCancel = null;
        this.showConfirmCancelReg = false;
      },
      error: (err) => console.error('Failed to cancel registration', err)
    });
  }

  // ─── Computed ─────────────────────────────────────
  get confirmedCount() { return this.registrations.filter(r => r.status === 'Confirmed').length; }
  get pendingCount() { return this.registrations.filter(r => r.status === 'PendingPayment').length; }
  get cancelledRegCount() { return this.registrations.filter(r => r.status === 'Cancelled').length; }
  get capacityPercent() {
    if (!this.event || this.event.capacity === 0) return 0;
    return Math.min(100, Math.round((this.event.registrationsCount / this.event.capacity) * 100));
  }

  // ─── Helpers ──────────────────────────────────────
  formatDate(iso: string): string {
    return new Date(iso).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  getStatusClass(status: EventStatus): string {
    const map: Record<EventStatus, string> = {
      Published: 'status-published',
      Draft: 'status-draft',
      Cancelled: 'status-cancelled',
    };
    return map[status];
  }

  getCategoryColor(cat: string): string {
    const map: Record<string, string> = {
      Member: 'cat-member',
      Guest: 'cat-guest',
      FamilyMember: 'cat-family',
      Public: 'cat-public',
    };
    return map[cat] || 'cat-public';
  }

  getRegStatusClass(status: string): string {
    const map: Record<string, string> = {
      Confirmed: 'reg-confirmed',
      PendingPayment: 'reg-pending',
      Cancelled: 'reg-cancelled',
    };
    return map[status] || '';
  }

  getInitialsBg(initials: string): string {
    const colors = ['bg-purple-500','bg-sky-500','bg-emerald-500','bg-amber-500','bg-rose-500'];
    const i = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % colors.length;
    return colors[i];
  }

  getGradient(): string {
    return 'linear-gradient(135deg, #491F8D, #8A6DFF)';
  }
}
