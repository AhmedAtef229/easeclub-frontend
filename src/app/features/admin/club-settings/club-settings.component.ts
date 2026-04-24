import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { switchMap, of } from 'rxjs';
import { ClubSettingService } from '../../../core/services/api/club-setting.service';
import { ChangeLogoComponent } from '../../../shared/components/modals/club-modal/change-logo/change-logo.component';
import { ChangePhotoComponent } from '../../../shared/components/modals/club-modal/change-photo/change-photo.component';
import { EditSettingComponent } from '../../../shared/components/modals/club-modal/edit-setting/edit-setting.component';

@Component({
  selector: 'app-club-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChangeLogoComponent,
    ChangePhotoComponent,
    EditSettingComponent,
  ],
  templateUrl: './club-settings.component.html',
})
export class ClubSettingsComponent implements OnInit {
  title = 'Club Settings';
  subtitle = 'Manage your club configuration';
  isEditing = false;

  showLogoModal = false;
  showImageModal = false;
  showAmenityModal = false;

  clubId: string = ''; // ✅ مهم

  club = {
    name: '',
    description: '',
    phone: '',
    email: '',
    workHours: [] as string[],
    amenities: [] as string[],
    logo: '',
    cover: '',
  };

  editData = { ...this.club };

  constructor(private clubService: ClubSettingService) {}

  ngOnInit() {
    this.loadClub();
  }
loadClub() {
  this.clubService
    .getClubs({ limit: 1 })
    .pipe(
      switchMap((res: any) => {
        // ❌ شيلنا الـ logs
        // console.log('CLUBS RESPONSE:', res);

        if (!res?.items || res.items.length === 0) {
          console.warn('No clubs found');
          return of(null);
        }

        // ✅ لازم ترجّع الـ id هنا
        this.clubId = res.items[0].id;

        return this.clubService.getClubById(this.clubId);
      })
    )
    .subscribe({
      next: (res) => {
        if (!res) return;

        this.club = this.mapClub(res);

        // ✅ copy علشان edit
        this.editData = JSON.parse(JSON.stringify(this.club));
      },
      error: (err) => console.error(err),
    });
}

 mapClub(res: any) {
  return {
    name: res.name || '',
    description: res.about || '',
    phone: res.contactInfo?.phone?.value || '',
    email: res.contactInfo?.email?.value || '',
    workHours:
      res.workSchedules?.map(
        (x: any) => `${x.label}: ${x.timeRange}`
      ) || [],
    amenities: res.amenities?.map((x: any) => x.name) || [],

    // ✅ fallback عشان مفيش صور من الباك
    logo: res.logoUrl || ' assets/images/logo_image.png',
    cover: res.coverImageUrl || 'assets/images/club_image.png',

  };
}

  startEdit() {
    this.isEditing = true;
    this.editData = JSON.parse(JSON.stringify(this.club));
  }

  cancelEdit() {
    this.isEditing = false;
  }

  saveEdit() {
    if (!this.clubId) {
      console.error('No clubId found');
      return;
    }

    const payload = {
      about: this.editData.description,
      phone: this.editData.phone,
      email: this.editData.email,
      amenities: this.editData.amenities || [],
      workSchedules: (this.editData.workHours || []).map((item: string) => {
        const [label, ...rest] = item.split(':');
        return {
          label: label.trim(),
          timeRange: rest.join(':').trim(),
        };
      }),
      logoId: undefined,
      coverImageId: undefined,
    };

    this.clubService.updateClub(this.clubId, payload).subscribe({
      next: () => {
        this.isEditing = false;
        this.loadClub();
      },
      error: (err) => console.error(err),
    });
  }

  onLogoChange(url: string) {
    this.editData.logo = url;
    this.showLogoModal = false;
  }

  onImageChange(url: string) {
    this.editData.cover = url;
    this.showImageModal = false;
  }

  onAddAmenity(name: string) {
    this.editData.amenities ??= [];
    this.editData.amenities.push(name);
    this.showAmenityModal = false;
  }
}
