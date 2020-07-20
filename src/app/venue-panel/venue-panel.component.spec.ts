import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenuePanelComponent } from './venue-panel.component';

describe('VenuePanelComponent', () => {
  let component: VenuePanelComponent;
  let fixture: ComponentFixture<VenuePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenuePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenuePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
