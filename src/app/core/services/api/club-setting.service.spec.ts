import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ClubSettingService } from './club-setting.service';

describe('ClubSettingService', () => {
  let service: ClubSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(ClubSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
