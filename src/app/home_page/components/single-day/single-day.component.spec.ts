import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDayComponent } from './single-day.component';

describe('SingleDayComponent', () => {
  let component: SingleDayComponent;
  let fixture: ComponentFixture<SingleDayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleDayComponent]
    });
    fixture = TestBed.createComponent(SingleDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
