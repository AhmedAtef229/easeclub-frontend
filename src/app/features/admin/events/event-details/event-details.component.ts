import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Event, TicketType, EventRegistration,
  EventStatus, CreateEventCommand, CreateTicketCommand
} from '../events.model';
import { EventModalComponent } from '../event-modal/event-modal.component';
import { TicketModalComponent } from '../ticket-modal/ticket-modal.component';
import { EventsService } from '../../../../core/services/api/events.service';
import { PricingPoliciesService, PricingPolicy, PolicyAssignment } from '../../../../core/services/api/pricing-policies.service';
import { BranchService } from '../../../../core/services/api/branches.service';

import { FormDropdownComponent } from '../../../../shared/components/form-dropdown/form-dropdown.component';

type Tab = 'tickets' | 'registrations' | 'pricing';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, FormsModule, EventModalComponent, TicketModalComponent, FormDropdownComponent],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
})
export class EventDetailsComponent implements OnInit {

  get compatiblePoliciesDropdownOptions() {
    return [
      { value: '', label: '— Choose a policy —' },
      ...this.unassignedCompatiblePolicies.map(p => {
        const effect = p.isIncrease ? '▲ Increase' : '▼ Discount';
        const detail = p.percentageValue != null ? `(${(p.percentageValue * 100).toFixed(0)}%)` :
                       p.fixedAmount != null ? `(EGP ${p.fixedAmount})` : '';
        return {
          value: p.id,
          label: `${p.name} | ${effect} ${detail}`
        };
      })
    ];
  }
  event: Event | null = null;
  registrations: EventRegistration[] = [];
  registrationsLoaded = false;
  eventId = '';
  clubId = '';

  activeTab: Tab = 'tickets';
  expandedRegId: string | null = null;

  showEditModal = false;
  editError: string | null = null;
  showTicketModal = false;
  editingTicket: TicketType | null = null;

  showConfirmPublish = false;
  showConfirmCancel = false;
  showConfirmDeleteTicket = false;
  ticketToDelete: TicketType | null = null;
  showConfirmCancelReg = false;
  regToCancel: EventRegistration | null = null;

  // ─── Pricing Tab State ───────────────────────────────────
  assignedPolicies: PolicyAssignment[] = [];
  availablePolicies: PricingPolicy[] = [];
  policiesLoaded = false;
  showAssignDrawer = false;
  assigningPolicyId = '';
  assigningPriority: number = 1;
  isAssigning = false;
  assignError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
    private pricingService: PricingPoliciesService,
    private branchService: BranchService
  ) {}

  ngOnInit() {
    this.clubId = this.branchService.getClubId();
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
    if (tab === 'pricing' && !this.policiesLoaded) {
      this.loadPolicies();
    }
  }

  // ─── Edit Event ─────────────────────────────────
  openEditModal() { this.editError = null; this.showEditModal = true; }
  closeEditModal() { this.editError = null; this.showEditModal = false; }
  onEditSave(cmd: CreateEventCommand) {
    if (!this.event) return;
    this.editError = null;
    this.eventsService.updateEvent(this.eventId, { ...cmd, id: this.eventId }).subscribe({
      next: () => {
        this.loadEventDetails();
        this.closeEditModal();
      },
      error: (err) => {
        console.error('Failed to update event', err);
        this.editError = err?.error?.detail || err?.error?.title || 'Failed to update event.';
      }
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

  // ─── Pricing Policies ────────────────────────────────────
  loadPolicies() {
    this.pricingService.getAssignments('Event', this.eventId).subscribe({
      next: (res) => {
        this.assignedPolicies = res;
      },
      error: (err) => console.error('Failed to load assigned policies', err)
    });
    this.pricingService.getCompatiblePolicies(this.clubId, 'Event').subscribe({
      next: (res) => {
        this.availablePolicies = res;
        this.policiesLoaded = true;
      },
      error: (err) => console.error('Failed to load compatible policies', err)
    });
  }

  get unassignedCompatiblePolicies(): PricingPolicy[] {
    const assignedIds = new Set(this.assignedPolicies.map(a => a.policyId));
    return this.availablePolicies.filter(p => !assignedIds.has(p.id));
  }

  openAssignDrawer() {
    this.assigningPolicyId = '';
    this.assigningPriority = (this.assignedPolicies.length || 0) + 1;
    this.assignError = '';
    this.showAssignDrawer = true;
  }

  closeAssignDrawer() {
    this.showAssignDrawer = false;
    this.assignError = '';
  }

  doAssignPolicy() {
    if (!this.assigningPolicyId) { this.assignError = 'Please select a policy.'; return; }
    if (!this.assigningPriority || this.assigningPriority < 1) { this.assignError = 'Priority must be at least 1.'; return; }
    this.isAssigning = true;
    this.assignError = '';
    this.pricingService.assignPolicies({
      targetId: this.eventId,
      targetType: 'Event',
      priority: this.assigningPriority,
      policies: [{ policyId: this.assigningPolicyId, priority: this.assigningPriority }]
    }).subscribe({
      next: () => {
        this.isAssigning = false;
        this.closeAssignDrawer();
        this.policiesLoaded = false;
        this.loadPolicies();
      },
      error: (err) => {
        this.isAssigning = false;
        this.assignError = err?.error?.detail || err?.error?.title || 'Failed to assign policy.';
      }
    });
  }

  doUnassignPolicy(policyId: string) {
    this.pricingService.unassignPolicy({
      policyId,
      targetId: this.eventId,
      targetType: 'Event'
    }).subscribe({
      next: () => {
        this.assignedPolicies = this.assignedPolicies.filter(a => a.policyId !== policyId);
      },
      error: (err) => console.error('Failed to unassign policy', err)
    });
  }

  getPolicyEffect(policy: PricingPolicy): string {
    const direction = policy.isIncrease ? '+' : '-';
    if (policy.percentageValue != null) return `${direction}${Math.round(policy.percentageValue * 100)}%`;
    if (policy.fixedAmount != null) return `${direction}EGP ${policy.fixedAmount}`;
    return direction;
  }

  getConditionSummary(policy: PricingPolicy): string {
    if (!policy.conditions?.length) return 'Always applies';
    return policy.conditions
      .map(c => {
        const op = c.operator === 'Equals' ? '=' : c.operator === 'NotEquals' ? '≠'
          : c.operator === 'GreaterThan' ? '>' : '<';
        const key = c.fieldKey.replace(/([A-Z])/g, ' $1').trim();
        return `${key} ${op} ${c.expectedValue}`;
      })
      .join(' & ');
  }

  getPolicyByAssignment(policyId: string): PricingPolicy | null {
    return this.availablePolicies.find(p => p.id === policyId) ?? null;
  }

  // ─── Computed ─────────────────────────────────────
  get confirmedCount() { return this.registrations.filter(r => r.status === 'Confirmed').length; }
  get pendingCount() { return this.registrations.filter(r => r.status === 'PendingPayment').length; }
  get cancelledRegCount() { return this.registrations.filter(r => r.status === 'Cancelled').length; }
  get capacityPercent() {
    if (!this.event || this.event.capacity === 0) return 0;
    return Math.min(100, Math.round(((this.event.capacity - this.event.remainingCapacity) / this.event.capacity) * 100));
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
