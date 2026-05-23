import { Component, EventEmitter, Input, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationReviewsService } from '../../../../core/services/api/application-reviews.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-application-reviews-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './application-reviews-modal.component.html',
})
export class ApplicationReviewsModalComponent implements OnInit {

  @Input() isOpen = false;
  @Input() data: any = null; // Clicked row data (has id, userName, email, plan, submittedAt, etc.)
  @Output() close = new EventEmitter<void>();

  applicationDetails: any = null;
  pricing: any = null;
  loading = false;
  activeStep = 1;

  constructor(
    private service: ApplicationReviewsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.data?.id) {
      this.loadApplicationDetails(this.data.id);
    }
  }

  loadApplicationDetails(id: string) {
    this.loading = true;
    this.applicationDetails = null;
    this.pricing = null;

    // Load main application details
    this.service.getApplicationDetails(id).subscribe({
      next: (res) => {
        this.applicationDetails = res;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Application details loaded successfully:', res);
      },
      error: (err) => {
        console.error('Error loading application review details:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    // Load pricing details (independent and graceful)
    this.service.getApplicationPricing(id).subscribe({
      next: (res) => {
        this.pricing = res;
        this.cdr.detectChanges();
        console.log('Application pricing loaded successfully:', res);
      },
      error: (err) => {
        console.error('Error loading application pricing details:', err);
      }
    });
  }

  setStep(step: number) {
    this.activeStep = step;
  }

  closeModal() {
    this.close.emit();
  }

  // Helpers for file handling
  getFileName(url: string): string {
    if (!url) return '';
    try {
      const decodedUrl = decodeURIComponent(url);
      const parts = decodedUrl.split('/');
      const fileNameWithQuery = parts[parts.length - 1];
      return fileNameWithQuery.split('?')[0];
    } catch (e) {
      const parts = url.split('/');
      return parts[parts.length - 1];
    }
  }

  isImage(url: string): boolean {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.includes('.png') || lower.includes('.jpg') || lower.includes('.jpeg') || lower.includes('.webp') || lower.includes('.gif');
  }

  previewFile(url: string): void {
    window.open(url, '_blank');
  }

  markAsPaid(item: any): void {
    item.status = 'Paid';
    this.cdr.detectChanges();
    alert(`Installment ${item.order} marked as paid successfully!`);
  }
}

