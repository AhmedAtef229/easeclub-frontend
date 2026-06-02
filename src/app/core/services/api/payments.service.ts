import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AdminContextStoreService } from './admin-context-store.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  private baseUrl = 'https://easeclub.runasp.net/api/v1';
  private readonly adminContextStore = inject(AdminContextStoreService);

  constructor(private http: HttpClient) {}

  /* ================= INSTALLMENTS ================= */

 getClubInstallments(
  clubId?: string,
  status?: string,
  search?: string,
  page: number = 1,
  limit: number = 10
) {
  const activeClubId = clubId || this.adminContextStore.getClubId();

  let params = new HttpParams()
    .set('Page', page)
    .set('Limit', limit);

  if (status && status !== 'All Statuses')
    params = params.set('status', status);

  if (search)
    params = params.set('search', search);

  return this.http.get(
    `${this.baseUrl}/clubs/${activeClubId}/memberships/installments`,
    { params }
  );
}

  /* ================= INVOICES ================= */

  getClubInvoices(
    clubId?: string,
    status?: string,
    search?: string,
    page: number = 1,
    limit: number = 10
  ) {
    const activeClubId = clubId || this.adminContextStore.getClubId();

    let params = new HttpParams()
      .set('Page', page)
      .set('Limit', limit);

    if (status && status !== 'All Statuses')
      params = params.set('status', status);

    if (search)
      params = params.set('search', search);

    return this.http.get(
      `${this.baseUrl}/clubs/${activeClubId}/invoices`,
      { params }
    );
  }

  /* ================= ISSUE INVOICE ================= */

  issueInvoice(body: {
    billingItemId: string;
    type: string;
  }) {
    return this.http.post(
      `${this.baseUrl}/invoices/issue`,
      body
    );
  }

  /* ================= PROCESS PAYMENT ================= */

  processPayment(body: {
    invoiceId: string;
    cardDetails: {
      number: string;
      expiryMonth: string;
      expiryYear: string;
      cvv: string;
      holderName: string;
    }
  }) {
    return this.http.post(
      `${this.baseUrl}/payments/process`,
      body
    );
  }

  /* ================= FINALIZE ================= */

  finalizePayment(body: {
    transactionId: string;
    threeDSecureId: string;
  }) {
    return this.http.post(
      `${this.baseUrl}/payments/finalize`,
      body
    );
  }

  /* ================= STATUS ================= */

  getInvoiceStatus(invoiceId: string) {
    return this.http.get(
      `${this.baseUrl}/invoices/${invoiceId}/status`
    );
  }

  /* ================= STATISTICS ================= */

  getClubPaymentStats(clubId?: string) {
    const activeClubId = clubId || this.adminContextStore.getClubId();
    return this.http.get(
      `${this.baseUrl}/clubs/${activeClubId}/invoices/stats`
    );
  }
}
