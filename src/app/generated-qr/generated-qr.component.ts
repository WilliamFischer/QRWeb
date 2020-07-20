import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-generated-qr',
  templateUrl: './generated-qr.component.html',
  styleUrls: ['./generated-qr.component.css']
})
export class GeneratedQRComponent implements OnInit {

  elementType = 'https://www.npmjs.com/package/@techiediaries/ngx-qrcode';
  value = 'Techiediaries';

  constructor() { }

  ngOnInit(): void {
    let theVenueName = 'testname';
    let theVenue = 'testurl';

    this.elementType = window.location.href.replace('/myqr', '/' + theVenue);
    this.value = theVenueName;

    console.log(this.elementType)
  }

}
