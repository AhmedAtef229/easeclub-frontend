import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipTypeModalComponent } from './membership-type-modal.component';

describe('MembershipTypeModalComponent', () => {
  let component: MembershipTypeModalComponent;
  let fixture: ComponentFixture<MembershipTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipTypeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
