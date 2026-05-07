import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingPolicyAssignmentComponent } from './pricing-policy-assignment.component';

describe('PricingPolicyAssignmentComponent', () => {
  let component: PricingPolicyAssignmentComponent;
  let fixture: ComponentFixture<PricingPolicyAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingPolicyAssignmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingPolicyAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
