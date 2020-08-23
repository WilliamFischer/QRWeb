import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueLoginComponent } from './venue-login.component';

describe('VenueLoginComponent', () => {
  let component: VenueLoginComponent;
  let fixture: ComponentFixture<VenueLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenueLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
