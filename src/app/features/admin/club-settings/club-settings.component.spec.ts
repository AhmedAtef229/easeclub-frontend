import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubSettingsComponent } from './club-settings.component';

describe('ClubSettingsComponent', () => {
  let component: ClubSettingsComponent;
  let fixture: ComponentFixture<ClubSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClubSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
