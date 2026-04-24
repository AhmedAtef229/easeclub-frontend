import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentPreviewModalComponent } from './installment-preview-modal.component';

describe('InstallmentPreviewModalComponent', () => {
  let component: InstallmentPreviewModalComponent;
  let fixture: ComponentFixture<InstallmentPreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallmentPreviewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstallmentPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
