import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Event, TicketType, EventRegistration,
  EventStatus, CreateEventCommand, CreateTicketCommand
} from '../events.model';
import { MOCK_EVENTS, MOCK_REGISTRATIONS } from '../events.mock';
import { EventModalComponent } from '../event-modal/event-modal.component';
import { TicketModalComponent } from '../ticket-modal/ticket-modal.component';

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

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.event = MOCK_EVENTS.find(e => e.id === id) || null;
  }

  // ─── Navigation ─────────────────────────────────
  goBack() { this.router.navigate(['/admin/events']); }

  // ─── Tabs ───────────────────────────────────────
  switchTab(tab: Tab) {
    this.activeTab = tab;
    if (tab === 'registrations' && !this.registrationsLoaded) {
      this.registrations = MOCK_REGISTRATIONS.filter(r => r.eventId === this.event?.id);
      this.registrationsLoaded = true;
    }
  }

  // ─── Edit Event ─────────────────────────────────
  openEditModal() { this.showEditModal = true; }
  closeEditModal() { this.showEditModal = false; }
  onEditSave(cmd: CreateEventCommand) {
    if (!this.event) return;
    Object.assign(this.event, {
      name: cmd.name,
      description: cmd.description,
      startDate: cmd.startDate,
      endDate: cmd.endDate,
      venue: cmd.venue,
      capacity: cmd.capacity,
      imageUrl: cmd.imageUrl,
      badge: cmd.badge,
    });
    this.closeEditModal();
  }

  // ─── Publish / Cancel Event ─────────────────────
  confirmPublish() { this.showConfirmPublish = true; }
  doPublish() { if (this.event) { this.event.status = 'Published'; } this.showConfirmPublish = false; }

  confirmCancel() { this.showConfirmCancel = true; }
  doCancel() { if (this.event) { this.event.status = 'Cancelled'; } this.showConfirmCancel = false; }

  // ─── Ticket CRUD ─────────────────────────────────
  openAddTicket() { this.editingTicket = null; this.showTicketModal = true; }
  openEditTicket(t: TicketType) { this.editingTicket = t; this.showTicketModal = true; }
  closeTicketModal() { this.showTicketModal = false; this.editingTicket = null; }

  onTicketSave(cmd: CreateTicketCommand) {
    if (!this.event) return;
    if (this.editingTicket) {
      // Edit existing
      const idx = this.event.ticketTypes.findIndex(t => t.id === this.editingTicket!.id);
      if (idx >= 0) {
        this.event.ticketTypes[idx] = {
          ...this.event.ticketTypes[idx],
          category: cmd.category,
          basePrice: cmd.basePrice,
          totalQuantity: cmd.totalQuantity,
          maxPerMember: cmd.maxPerMember,
          requiresMembership: cmd.requiresMembership,
          minAge: cmd.minAge,
          maxAge: cmd.maxAge,
          genderRestriction: cmd.genderRestriction,
        };
      }
    } else {
      // Add new
      const newTicket: TicketType = {
        id: Date.now().toString(),
        eventId: this.event.id,
        category: cmd.category,
        basePrice: cmd.basePrice,
        totalQuantity: cmd.totalQuantity,
        availableQuantity: cmd.totalQuantity,
        maxPerMember: cmd.maxPerMember,
        requiresMembership: cmd.requiresMembership,
        minAge: cmd.minAge,
        maxAge: cmd.maxAge,
        genderRestriction: cmd.genderRestriction,
      };
      this.event.ticketTypes.push(newTicket);
    }
    this.closeTicketModal();
  }

  confirmDeleteTicket(t: TicketType) { this.ticketToDelete = t; this.showConfirmDeleteTicket = true; }
  doDeleteTicket() {
    if (!this.event || !this.ticketToDelete) return;
    this.event.ticketTypes = this.event.ticketTypes.filter(t => t.id !== this.ticketToDelete!.id);
    this.ticketToDelete = null;
    this.showConfirmDeleteTicket = false;
  }

  // ─── Registrations ───────────────────────────────
  toggleRegExpand(regId: string) {
    this.expandedRegId = this.expandedRegId === regId ? null : regId;
  }

  confirmCancelReg(reg: EventRegistration) { this.regToCancel = reg; this.showConfirmCancelReg = true; }
  doCancelReg() {
    if (this.regToCancel) { this.regToCancel.status = 'Cancelled'; }
    this.regToCancel = null;
    this.showConfirmCancelReg = false;
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
