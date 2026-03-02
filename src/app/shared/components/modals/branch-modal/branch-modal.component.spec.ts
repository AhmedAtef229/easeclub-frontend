import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchModalComponent } from './branch-modal.component';

describe('BranchModalComponent', () => {
  let component: BranchModalComponent;
  let fixture: ComponentFixture<BranchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
