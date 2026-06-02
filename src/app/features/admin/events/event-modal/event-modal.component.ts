import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Event, CreateEventCommand, EventAccessType } from '../events.model';
import { FileService } from '../../../../core/services/api/file.service';
import { AdminContextService } from '../../../../core/services/api/admin-context.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-event-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-modal.component.html',
})
export class EventModalComponent implements OnInit {
  @Input() event: Event | null = null;
  @Input() error: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateEventCommand>();

  form!: FormGroup;
  clubId: string = '';
  selectedFile: File | null = null;
  isUploading = false;

  constructor(
    private fb: FormBuilder,
    private fileService: FileService,
    private adminContextService: AdminContextService
  ) {}

  ngOnInit() {
    this.adminContextService.getAdminContext().subscribe(ctx => {
      this.clubId = ctx.managedClubId;
    });

    this.form = this.fb.group({
      name: [this.event?.name || '', Validators.required],
      description: [this.event?.description || ''],
      startDate: [this.event ? this.toInputDate(this.event.startDate) : '', Validators.required],
      endDate: [this.event ? this.toInputDate(this.event.endDate) : '', Validators.required],
      venue: [this.event?.venue || ''],
      capacity: [this.event?.capacity || 50, [Validators.required, Validators.min(1)]],
      accessType: [this.event?.accessType || 'MembersOnly', Validators.required],
      imageUrl: [this.event?.imageUrl || ''],
      badge: [this.event?.badge || ''],
    });
  }

  private toInputDate(iso: string): string {
    return iso ? iso.substring(0, 16) : '';
  }



  extractUuid(url: string): string | undefined {
    if (!url) return undefined;
    const match = url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    return match ? match[0] : undefined;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
    this.form.patchValue({
      imageUrl: URL.createObjectURL(file)
    });
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isUploading = true;
    let finalImageId: string | null = null;

    if (this.event?.imageUrl) {
      finalImageId = this.extractUuid(this.event.imageUrl) || null;
    }

    try {
      if (this.selectedFile && this.clubId) {
        const res = await firstValueFrom(
          this.fileService.uploadClubFile(this.selectedFile, this.clubId, 'EventImage')
        );
        console.log('EVENT IMAGE UPLOADED:', res);
        finalImageId = res.fileId;
      }

      const v = this.form.value;
      
      // If imageUrl was cleared, set finalImageId to null
      if (!v.imageUrl) {
        finalImageId = null;
      }

      this.save.emit({
        name: v.name,
        description: v.description,
        startDate: v.startDate,
        endDate: v.endDate,
        venue: v.venue,
        capacity: +v.capacity,
        accessType: v.accessType,
        imageId: finalImageId,
        badge: v.badge || null,
      });
    } catch (err) {
      console.error('Image upload failed', err);
    } finally {
      this.isUploading = false;
    }
  }
}
