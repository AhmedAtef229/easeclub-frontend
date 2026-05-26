// =============================================
//  Event Module — TypeScript Models
// =============================================

export type EventStatus = 'Draft' | 'Published' | 'Cancelled';
export type EventAccessType = 'MembersOnly' | 'Public';
export type TicketCategory = 'Member' | 'Guest' | 'FamilyMember' | 'Public';
export type RegistrationStatus = 'Confirmed' | 'PendingPayment' | 'Cancelled';

// ---- Ticket Type ----
export interface TicketType {
  id: string;
  eventId: string;
  category: TicketCategory;
  basePrice: number;
  totalQuantity: number;
  availableQuantity: number;
  maxPerMember: number | null;
  requiresMembership: boolean;
  minAge: number | null;
  maxAge: number | null;
  genderRestriction: string | null;
}

// ---- Attendee ----
export interface Attendee {
  id: string;
  name: string;
  ticketCategory: TicketCategory;
  age: number;
  gender: string;
}

// ---- Registration ----
export interface EventRegistration {
  id: string;
  eventId: string;
  registrantName: string;
  registrantInitials: string;
  status: RegistrationStatus;
  attendeeCount: number;
  totalPrice: number;
  appliedPolicies: string[];
  attendees: Attendee[];
}

// ---- Event (Full Detail) ----
export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  capacity: number;
  registrationsCount: number;
  accessType: EventAccessType;
  status: EventStatus;
  imageUrl: string | null;
  badge: string | null;
  ticketTypes: TicketType[];
}

// ---- Create/Edit Command ----
export interface CreateEventCommand {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  capacity: number;
  accessType: EventAccessType;
  imageUrl: string | null;
  badge: string | null;
}

export interface CreateTicketCommand {
  eventId: string;
  category: TicketCategory;
  basePrice: number;
  totalQuantity: number;
  maxPerMember: number | null;
  requiresMembership: boolean;
  minAge: number | null;
  maxAge: number | null;
  genderRestriction: string | null;
}
