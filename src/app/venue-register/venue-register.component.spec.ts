import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueRegisterComponent } from './venue-register.component';

describe('VenueRegisterComponent', () => {
  let component: VenueRegisterComponent;
  let fixture: ComponentFixture<VenueRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenueRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
