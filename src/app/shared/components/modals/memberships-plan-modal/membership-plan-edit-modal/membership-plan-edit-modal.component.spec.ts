import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipPlanEditModalComponent } from './membership-plan-edit-modal.component';

describe('MembershipPlanEditModalComponent', () => {
  let component: MembershipPlanEditModalComponent;
  let fixture: ComponentFixture<MembershipPlanEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipPlanEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipPlanEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
