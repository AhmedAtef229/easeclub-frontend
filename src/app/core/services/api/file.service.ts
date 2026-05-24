import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../appconfig';

/**
 * Single source of truth for backend Purpose values
 * (Prevents enum mismatch completely)
 */
export const CLUB_FILE_PURPOSE = {
  LOGO: 'ClubLogo',
  COVER: 'ClubCover',
  IMAGE: 'ClubImage',
} as const;

export type ClubFilePurpose =
  typeof CLUB_FILE_PURPOSE[keyof typeof CLUB_FILE_PURPOSE];

@Injectable({
  providedIn: 'root',
})
export class FileService {

  private BASE_URL = `${AppConfig.ProdApi}/files`;

  constructor(private http: HttpClient) {}

  uploadClubFile(
    file: File,
    clubId: string,
    purpose: ClubFilePurpose = CLUB_FILE_PURPOSE.IMAGE
  ): Observable<any> {

    const formData = new FormData();

    formData.append('File', file);
    formData.append('ClubId', clubId);
    formData.append('Purpose', purpose);
    formData.append('IsPrivate', 'false');

    console.log('UPLOAD REQUEST:', [...formData.entries()]);

    return this.http.post(
      `${this.BASE_URL}/club`,
      formData
    );
  }
}
