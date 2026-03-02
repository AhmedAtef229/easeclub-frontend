import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentsTemplateModalComponent } from './installments-template-modal.component';

describe('InstallmentsTemplateModalComponent', () => {
  let component: InstallmentsTemplateModalComponent;
  let fixture: ComponentFixture<InstallmentsTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallmentsTemplateModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstallmentsTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
