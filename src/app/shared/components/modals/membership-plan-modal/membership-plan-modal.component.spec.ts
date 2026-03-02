import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipPlanModalComponent } from './membership-plan-modal.component';

describe('MembershipPlanModalComponent', () => {
  let component: MembershipPlanModalComponent;
  let fixture: ComponentFixture<MembershipPlanModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipPlanModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipPlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
