import { TestBed } from '@angular/core/testing';

import { ApplicationTemplatesService } from './application-templates.service';

describe('ApplicationTemplatesService', () => {
  let service: ApplicationTemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationTemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
