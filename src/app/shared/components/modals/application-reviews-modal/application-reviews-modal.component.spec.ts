import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationReviewsModalComponent } from './application-reviews-modal.component';

describe('ApplicationReviewsModalComponent', () => {
  let component: ApplicationReviewsModalComponent;
  let fixture: ComponentFixture<ApplicationReviewsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationReviewsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationReviewsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
