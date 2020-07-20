import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinSuccessComponent } from './checkin-success.component';

describe('CheckinSuccessComponent', () => {
  let component: CheckinSuccessComponent;
  let fixture: ComponentFixture<CheckinSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckinSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
