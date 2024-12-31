import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPopupComponent } from './review-popup.component';

describe('ReviewPopupComponent', () => {
  let component: ReviewPopupComponent;
  let fixture: ComponentFixture<ReviewPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewPopupComponent]
    });
    fixture = TestBed.createComponent(ReviewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
