import { TestBed } from '@angular/core/testing';

import { ApplicationReviewsService } from './application-reviews.service';

describe('ApplicationReviewsService', () => {
  let service: ApplicationReviewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationReviewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
