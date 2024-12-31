import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileCategoryDialogComponent } from './mobile-category-dialog.component';

describe('MobileCategoryDialogComponent', () => {
  let component: MobileCategoryDialogComponent;
  let fixture: ComponentFixture<MobileCategoryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MobileCategoryDialogComponent]
    });
    fixture = TestBed.createComponent(MobileCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
