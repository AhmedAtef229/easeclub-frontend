import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationReviewsComponent } from './application-reviews.component';

describe('ApplicationReviewsComponent', () => {
  let component: ApplicationReviewsComponent;
  let fixture: ComponentFixture<ApplicationReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
