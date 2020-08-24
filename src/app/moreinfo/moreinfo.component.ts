import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

// Maps
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Address } from "ngx-google-places-autocomplete/objects/address";

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-moreinfo',
  templateUrl: './moreinfo.component.html',
  styleUrls: ['./moreinfo.component.scss']
})
export class MoreinfoComponent implements OnInit {
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;

  moreDetailsObj : any = {
    phone : '',
    address : '',
    email : '',
    name : '',
    uid : '',
    photoURL : '',
    accountType : ''
  }

  constructor(private fireStore : AngularFirestore, private router: Router) {}

  ngOnInit(): void {
  }

  onChange(address: Address) {
    console.log(address);
    this.moreDetailsObj.address = address.formatted_address;
  }

  saveUser(){
    let otherUserDetails = JSON.parse(localStorage.getItem('guestUser'));
    // otherUserDetails.address = this.moreDetailsObj.address;
    // otherUserDetails.phone = this.moreDetailsObj.phone;
    this.moreDetailsObj.accountType = 'guest';
    this.moreDetailsObj.email = otherUserDetails.user.email;
    this.moreDetailsObj.name = otherUserDetails.user.displayName;
    this.moreDetailsObj.uid = otherUserDetails.user.uid;
    this.moreDetailsObj.photoURL = otherUserDetails.user.photoURL;

    console.log(this.moreDetailsObj)

    this.fireStore.doc('Users/' + this.moreDetailsObj.uid).set(this.moreDetailsObj, {
      merge: true
    });

    this.router.navigate(['/success']);
  }


}
