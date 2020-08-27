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

  accountType: string;

  constructor(private fireStore : AngularFirestore, private router: Router, private afAuth : AngularFireAuth) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user){
        // console.log(user.uid)

        let venueCollection = this.fireStore.collection('Users/').valueChanges().subscribe(
        venues =>{
          let userArr = [];
          let venueExists = false;

          userArr.push(venues);

          userArr[0].forEach(user => {
            if(user['uid'] == user.uid){
              this.accountType = user.accountType;


              if(user.address && user.phone){
                if(this.accountType == 'venue'){
                  this.router.navigate(['/venue']);
                }else{
                  this.router.navigate(['/member']);
                }
              }

              venueCollection.unsubscribe();
            }
          });
        });

      } else {
        this.router.navigate(['/']);
      }
    });
  }

  onChange(address: Address) {
    // console.log(address);
    this.moreDetailsObj.address = address.formatted_address;
  }

  saveUser(){
    let otherUserDetails = JSON.parse(localStorage.getItem('guestUser'));
    // otherUserDetails.address = this.moreDetailsObj.address;
    // otherUserDetails.phone = this.moreDetailsObj.phone;
    this.moreDetailsObj.accountType = this.accountType;
    this.moreDetailsObj.email = otherUserDetails.email;
    this.moreDetailsObj.name = otherUserDetails.displayName;
    this.moreDetailsObj.uid = otherUserDetails.uid;
    this.moreDetailsObj.photoURL = otherUserDetails.photoURL;

    //     console.log(otherUserDetails)
    // console.log(this.moreDetailsObj)

    this.fireStore.doc('Users/' + this.moreDetailsObj.uid).set(this.moreDetailsObj, {
      merge: true
    });

    if(this.accountType == 'venue'){
      this.router.navigate(['/venue']);
    }else{
      this.router.navigate(['/member']);
    }
  }


}
