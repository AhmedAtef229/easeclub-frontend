import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentTemplatesComponent } from './installment-templates.component';

describe('InstallmentTemplatesComponent', () => {
  let component: InstallmentTemplatesComponent;
  let fixture: ComponentFixture<InstallmentTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallmentTemplatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstallmentTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
