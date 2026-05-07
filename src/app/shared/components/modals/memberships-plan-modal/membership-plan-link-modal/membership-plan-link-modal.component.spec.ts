import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipPlanLinkModalComponent } from './membership-plan-link-modal.component';

describe('MembershipPlanLinkModalComponent', () => {
  let component: MembershipPlanLinkModalComponent;
  let fixture: ComponentFixture<MembershipPlanLinkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipPlanLinkModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipPlanLinkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
