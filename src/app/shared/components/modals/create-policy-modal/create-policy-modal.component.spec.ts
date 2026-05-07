import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePolicyModalComponent } from './create-policy-modal.component';

describe('CreatePolicyModalComponent', () => {
  let component: CreatePolicyModalComponent;
  let fixture: ComponentFixture<CreatePolicyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePolicyModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePolicyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
