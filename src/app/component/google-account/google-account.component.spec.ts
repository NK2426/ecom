import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleAccountComponent } from './google-account.component';

describe('GoogleAccountComponent', () => {
  let component: GoogleAccountComponent;
  let fixture: ComponentFixture<GoogleAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoogleAccountComponent]
    });
    fixture = TestBed.createComponent(GoogleAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
