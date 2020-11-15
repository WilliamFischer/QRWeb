import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qr-print',
  templateUrl: './qr-print.component.html',
  styleUrls: ['./qr-print.component.css']
})
export class QrPrintComponent implements OnInit {

  qrCodeUrl : string;
  venue: any;

  constructor() { }

  ngOnInit(): void {
    this.venue = JSON.parse(localStorage.getItem('printVenue'));
    console.log(this.venue);
    // window.print(); 
    this.qrCodeUrl = this.venue.url;

  }

}
