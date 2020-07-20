import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedQRComponent } from './generated-qr.component';

describe('GeneratedQRComponent', () => {
  let component: GeneratedQRComponent;
  let fixture: ComponentFixture<GeneratedQRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneratedQRComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratedQRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
