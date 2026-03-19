import { TestBed } from '@angular/core/testing';

import { MembershipTypesService } from './membership-types.service';

describe('MembershipTypesService', () => {
  let service: MembershipTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MembershipTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
