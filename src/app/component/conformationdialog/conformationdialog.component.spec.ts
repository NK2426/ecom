import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConformationdialogComponent } from './conformationdialog.component';

describe('ConformationdialogComponent', () => {
  let component: ConformationdialogComponent;
  let fixture: ComponentFixture<ConformationdialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConformationdialogComponent]
    });
    fixture = TestBed.createComponent(ConformationdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
