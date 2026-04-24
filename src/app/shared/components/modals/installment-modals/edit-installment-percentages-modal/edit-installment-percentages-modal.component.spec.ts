import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInstallmentPercentagesModalComponent } from './edit-installment-percentages-modal.component';

describe('EditInstallmentPercentagesModalComponent', () => {
  let component: EditInstallmentPercentagesModalComponent;
  let fixture: ComponentFixture<EditInstallmentPercentagesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditInstallmentPercentagesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInstallmentPercentagesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
