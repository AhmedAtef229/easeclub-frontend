import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLogoComponent } from './change-logo.component';

describe('ChangeLogoComponent', () => {
  let component: ChangeLogoComponent;
  let fixture: ComponentFixture<ChangeLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeLogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
