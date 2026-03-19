import { TestBed } from '@angular/core/testing';

import { MembershipPlansService } from './membership-plans.service';

describe('MembershipPlansService', () => {
  let service: MembershipPlansService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MembershipPlansService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
