import { TestBed } from '@angular/core/testing';

import { PricingPoliciesService } from './pricing-policies.service';

describe('PricingPoliciesService', () => {
  let service: PricingPoliciesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PricingPoliciesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
