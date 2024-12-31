import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnReasonDialogComponent } from './return-reason-dialog.component';

describe('ReturnReasonDialogComponent', () => {
  let component: ReturnReasonDialogComponent;
  let fixture: ComponentFixture<ReturnReasonDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReturnReasonDialogComponent]
    });
    fixture = TestBed.createComponent(ReturnReasonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
