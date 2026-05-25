import { Component, EventEmitter, Input, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationReviewsService } from '../../../../core/services/api/application-reviews.service';
import { FileService, FileDto } from '../../../../core/services/api/file.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-application-reviews-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './application-reviews-modal.component.html',
})
export class ApplicationReviewsModalComponent implements OnInit {

  @Input() isOpen = false;
  @Input() data: any = null; // Clicked row data (has id, userName, email, plan, submittedAt, etc.)
  @Output() close = new EventEmitter<void>();
  @Output() reviewSubmitted = new EventEmitter<void>();

  applicationDetails: any = null;
  pricing: any = null;
  loading = false;
  activeStep = 1;
  loadedFiles: { [id: string]: FileDto } = {};

  showApproveConfirm = false;
  showRejectConfirm = false;
  rejectionReason = '';
  submitting = false;
  errorMessage = '';

  constructor(
    private service: ApplicationReviewsService,
    private fileService: FileService,
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
        this.loadFileMetadataForFields();
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

  isImage(contentType: string, fileName: string): boolean {
    if (contentType && contentType.startsWith('image/')) return true;
    if (!fileName) return false;
    const lower = fileName.toLowerCase();
    return lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp') || lower.endsWith('.gif');
  }

  isImageUrl(url: string): boolean {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.includes('.png') || lower.includes('.jpg') || lower.includes('.jpeg') || lower.includes('.webp') || lower.includes('.gif');
  }

  loadFileMetadataForFields() {
    if (!this.applicationDetails?.steps) return;

    const fileFields: any[] = [];
    this.applicationDetails.steps.forEach((step: any) => {
      step.sections?.forEach((section: any) => {
        section.fields?.forEach((field: any) => {
          if ((field.type === 'File' || field.type === 'file') && field.value) {
            fileFields.push(field);
          }
        });
      });
    });

    if (fileFields.length === 0) return;

    fileFields.forEach(field => {
      const fileValue = field.value;
      if (fileValue.startsWith('http://') || fileValue.startsWith('https://') || fileValue.includes('/')) {
        const fileName = this.getFileName(fileValue);
        this.loadedFiles[fileValue] = {
          id: fileValue,
          fileName: fileName,
          url: fileValue,
          contentType: this.isImageUrl(fileValue) ? 'image/png' : 'application/pdf',
          size: 0,
          category: 'ApplicationDocument'
        };
        return;
      }

      const fileId = fileValue;
      if (!this.loadedFiles[fileId]) {
        this.fileService.getFileMetadata(fileId).subscribe({
          next: (meta) => {
            this.loadedFiles[fileId] = meta;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error(`Error loading metadata for file ${fileId}:`, err);
          }
        });
      }
    });
  }

  previewFile(url: string): void {
    window.open(url, '_blank');
  }

  markAsPaid(item: any): void {
    item.status = 'Paid';
    this.cdr.detectChanges();
    alert(`Installment ${item.order} marked as paid successfully!`);
  }

  openApproveConfirm() {
    this.errorMessage = '';
    this.showApproveConfirm = true;
  }

  openRejectConfirm() {
    this.errorMessage = '';
    this.rejectionReason = '';
    this.showRejectConfirm = true;
  }

  closeConfirm() {
    this.showApproveConfirm = false;
    this.showRejectConfirm = false;
    this.errorMessage = '';
  }

  submitReview(decision: 'Approved' | 'Rejected') {
    if (!this.data?.id) return;

    if (decision === 'Rejected' && !this.rejectionReason.trim()) {
      this.errorMessage = 'Rejection reason is required.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    this.service.submitApplicationReview(
      this.data.id,
      decision,
      decision === 'Rejected' ? this.rejectionReason : undefined
    ).subscribe({
      next: () => {
        this.submitting = false;
        this.closeConfirm();
        this.reviewSubmitted.emit();
      },
      error: (err) => {
        this.submitting = false;
        console.error('Error submitting application review:', err);
        this.errorMessage = err?.error?.message || err?.error || 'Failed to submit review. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }
}

