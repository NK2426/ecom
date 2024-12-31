import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelReasonDialogComponent } from './cancel-reason-dialog.component';

describe('CancelReasonDialogComponent', () => {
  let component: CancelReasonDialogComponent;
  let fixture: ComponentFixture<CancelReasonDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancelReasonDialogComponent]
    });
    fixture = TestBed.createComponent(CancelReasonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
