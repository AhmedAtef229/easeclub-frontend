import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTemplateConnectionsModalComponent } from './manage-template-connections-modal.component';

describe('ManageTemplateConnectionsModalComponent', () => {
  let component: ManageTemplateConnectionsModalComponent;
  let fixture: ComponentFixture<ManageTemplateConnectionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTemplateConnectionsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageTemplateConnectionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
