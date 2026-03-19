import { TestBed } from '@angular/core/testing';

import { InstallmentTemplatesService } from './installment-templates.service';

describe('InstallmentTemplatesService', () => {
  let service: InstallmentTemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstallmentTemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
