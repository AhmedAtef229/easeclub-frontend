import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingPolicyContentComponent } from './pricing-policy-content.component';

describe('PricingPolicyContentComponent', () => {
  let component: PricingPolicyContentComponent;
  let fixture: ComponentFixture<PricingPolicyContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingPolicyContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingPolicyContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
