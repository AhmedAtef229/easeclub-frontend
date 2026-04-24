import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingPoliciesComponent } from './pricing-policies.component';

describe('PricingPoliciesComponent', () => {
  let component: PricingPoliciesComponent;
  let fixture: ComponentFixture<PricingPoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingPoliciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
