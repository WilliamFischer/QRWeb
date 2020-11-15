import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrPrintComponent } from './qr-print.component';

describe('QrPrintComponent', () => {
  let component: QrPrintComponent;
  let fixture: ComponentFixture<QrPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
