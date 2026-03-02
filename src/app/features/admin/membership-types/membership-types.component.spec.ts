import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipTypesComponent } from './membership-types.component';

describe('MembershipTypesComponent', () => {
  let component: MembershipTypesComponent;
  let fixture: ComponentFixture<MembershipTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
