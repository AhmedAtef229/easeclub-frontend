import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTemplateModalComponent } from './create-template-modal.component';

describe('CreateTemplateModalComponent', () => {
  let component: CreateTemplateModalComponent;
  let fixture: ComponentFixture<CreateTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTemplateModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
