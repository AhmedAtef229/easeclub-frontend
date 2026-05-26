import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, firstValueFrom, switchMap } from 'rxjs';

import { ClubSettingService } from '../../../core/services/api/club-setting.service';
import { AdminContextService } from '../../../core/services/api/admin-context.service';
import { FileService } from '../../../core/services/api/file.service';

import { EditSettingComponent } from '../../../shared/components/modals/club-modal/edit-setting/edit-setting.component';

@Component({
  selector: 'app-club-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EditSettingComponent,
  ],
  templateUrl: './club-settings.component.html',
})
export class ClubSettingsComponent implements OnInit {

  title = 'Club Settings';
  subtitle = 'Manage your club configuration';

  isEditing = false;
  isSaving = false;
  errorMessage = '';

  showAmenityModal = false;

  clubId: string = '';

  // ================= FILES =================
  selectedLogoFile: File | null = null;
  selectedCoverFile: File | null = null;

  uploadedLogoId?: string;
  uploadedCoverId?: string;

  club = {
    name: '',
    description: '',
    phone: '',
    email: '',
    workHours: [] as string[],
    amenities: [] as string[],
    logo: '',
    cover: '',
    logoId: '',
    coverImageId: '',
  };

  editData = { ...this.club };

  constructor(
    private clubService: ClubSettingService,
    private adminContextService: AdminContextService,
    private fileService: FileService
  ) {}

  ngOnInit() {
    this.loadClub();
  }

  // ================= LOAD CLUB =================
  loadClub() {
    this.adminContextService
      .getAdminContext()
      .pipe(
        switchMap((context: any) => {
          console.log('ADMIN CONTEXT:', context);
          this.clubId = context.managedClubId;
          return this.clubService.getClubById(this.clubId);
        })
      )
      .subscribe({
        next: (res: any) => {
          console.log('CLUB DETAILS:', res);
          this.club = this.mapClub(res);
          this.uploadedLogoId = this.club.logoId;
          this.uploadedCoverId = this.club.coverImageId;

          this.editData = JSON.parse(
            JSON.stringify(this.club)
          );
        },
        error: (err) => {
          console.error('LOAD CLUB ERROR:', err);
        },
      });
  }

  // ================= EXTRACT UUID =================
  extractUuid(url: string): string | undefined {
    if (!url) return undefined;
    const match = url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    return match ? match[0] : undefined;
  }

  // ================= MAP CLUB =================
  mapClub(res: any) {
    const logoId = res.logoId || this.extractUuid(res.logoUrl);
    const coverImageId = res.coverImageId || this.extractUuid(res.coverImageUrl);
    return {
      name: res.name || '',
      description: res.about || '',
      phone: res.contactInfo?.phone?.value || '',
      email: res.contactInfo?.email?.value || '',
      workHours: res.workSchedules?.map(
        (x: any) => `${x.label}: ${x.timeRange}`
      ) || [],
      amenities: res.amenities?.map(
        (x: any) => x.name
      ) || [],
      logo: res.logoUrl || 'assets/images/logo_image.png',
      cover: res.coverImageUrl || 'assets/images/club_image.png',
      logoId: logoId || '',
      coverImageId: coverImageId || '',
    };
  }

  // ================= START EDIT =================
  startEdit() {
    this.isEditing = true;
    this.selectedLogoFile = null;
    this.selectedCoverFile = null;
    this.uploadedLogoId = this.club.logoId;
    this.uploadedCoverId = this.club.coverImageId;
    this.errorMessage = '';
    this.editData = JSON.parse(
      JSON.stringify(this.club)
    );
  }

  // ================= CANCEL EDIT =================
  cancelEdit() {
    this.isEditing = false;
    this.selectedLogoFile = null;
    this.selectedCoverFile = null;
    this.uploadedLogoId = this.club.logoId;
    this.uploadedCoverId = this.club.coverImageId;
    this.errorMessage = '';
  }

  // ================= SAVE EDIT =================
  async saveEdit() {
    if (!this.clubId) {
      console.error('No clubId found');
      return;
    }

    console.log(
      'SELECTED COVER FILE:',
      this.selectedCoverFile
    );

    console.log(
      'SELECTED LOGO FILE:',
      this.selectedLogoFile
    );

    this.isSaving = true;
    this.errorMessage = '';

    try {
      if (this.selectedLogoFile) {
        const res = await firstValueFrom(
          this.fileService.uploadClubFile(this.selectedLogoFile, this.clubId, 'ClubLogo')
        );
        console.log('LOGO UPLOADED:', res);
        this.uploadedLogoId = res.fileId;
      }

      if (this.selectedCoverFile) {
        const res = await firstValueFrom(
          this.fileService.uploadClubFile(this.selectedCoverFile, this.clubId, 'ClubBanner')
        );
        console.log('COVER UPLOADED:', res);
        this.uploadedCoverId = res.fileId;
      }

      const payload = {
        about: this.editData.description,
        phone: this.editData.phone,
        email: this.editData.email,
        amenities: this.editData.amenities || [],
        workSchedules: (this.editData.workHours || []).map(
          (item: string) => {
            const [label, ...rest] = item.split(':');
            return {
              label: label.trim(),
              timeRange: rest.join(':').trim(),
            };
          }
        ),
        logoId: this.uploadedLogoId || undefined,
        coverImageId: this.uploadedCoverId || undefined,
      };

      console.log('UPDATE PAYLOAD WITH IMAGES:', payload);
      await firstValueFrom(this.clubService.updateClub(this.clubId, payload));

      console.log('CLUB UPDATED SUCCESSFULLY');
      this.isSaving = false;
      this.isEditing = false;
      this.selectedLogoFile = null;
      this.selectedCoverFile = null;
      this.loadClub();
    } catch (err: any) {
      console.log('FULL ERROR:', err);
      console.log('VALIDATION ERRORS:', err.error?.errors);
      console.error('SAVE EDIT ERROR:', err);
      this.isSaving = false;
      
      if (err.error && err.error.errors) {
        console.log(err.error.errors);
        const validationMsgs = Object.entries(err.error.errors)
          .map(([field, msgs]: any) => `${field}: ${msgs.join(', ')}`)
          .join(' | ');
        this.errorMessage = `Validation Error: ${validationMsgs}`;
      } else {
        this.errorMessage = err.error?.title || err.message || 'Failed to save changes. Please try again.';
      }
    }
  }

  // ================= LOGO UPLOAD =================
  onLogoSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedLogoFile = file;
    this.editData.logo = URL.createObjectURL(file);
    console.log('LOGO SELECTED FOR PREVIEW:', file);
  }

  // ================= COVER UPLOAD =================
  onCoverSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedCoverFile = file;
    this.editData.cover = URL.createObjectURL(file);
    console.log('COVER SELECTED FOR PREVIEW:', file);
  }

  // ================= ADD AMENITY =================
  onAddAmenity(name: string) {
    this.editData.amenities ??= [];
    this.editData.amenities.push(name);
    this.showAmenityModal = false;
  }

  removeAmenity(index: number) {
    this.editData.amenities.splice(index, 1);
  }
}

