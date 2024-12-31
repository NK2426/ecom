import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagWithIdComponent } from './tag-with-id.component';

describe('TagWithIdComponent', () => {
  let component: TagWithIdComponent;
  let fixture: ComponentFixture<TagWithIdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TagWithIdComponent]
    });
    fixture = TestBed.createComponent(TagWithIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
