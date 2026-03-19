import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentPlanModalComponent } from './installment-plan-modal.component';

describe('InstallmentPlanModalComponent', () => {
  let component: InstallmentPlanModalComponent;
  let fixture: ComponentFixture<InstallmentPlanModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallmentPlanModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstallmentPlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
