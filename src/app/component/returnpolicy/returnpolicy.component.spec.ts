import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnpolicyComponent } from './returnpolicy.component';

describe('ReturnpolicyComponent', () => {
  let component: ReturnpolicyComponent;
  let fixture: ComponentFixture<ReturnpolicyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReturnpolicyComponent]
    });
    fixture = TestBed.createComponent(ReturnpolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
