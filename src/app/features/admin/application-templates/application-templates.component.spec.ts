import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationTemplatesComponent } from './application-templates.component';

describe('ApplicationTemplatesComponent', () => {
  let component: ApplicationTemplatesComponent;
  let fixture: ComponentFixture<ApplicationTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationTemplatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
