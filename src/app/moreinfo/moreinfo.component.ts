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

          userArr[0].forEach(oneUser => {
            if(user['uid'] == oneUser.uid){
              this.accountType = oneUser.accountType;


              if(oneUser.address && oneUser.phone){
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
    if(this.moreDetailsObj.phone){
      if(this.moreDetailsObj.address){
        let otherUserDetails = JSON.parse(localStorage.getItem('guestUser'));

        if(this.accountType){
          this.moreDetailsObj.accountType = this.accountType;
        }else if(this.accountType){
          this.accountType = localStorage.getItem('accountType')
        }else{
          this.accountType = 'guest';
        }

        this.moreDetailsObj.email = otherUserDetails.email;
        this.moreDetailsObj.name = otherUserDetails.displayName;
        this.moreDetailsObj.uid = otherUserDetails.uid;
        this.moreDetailsObj.photoURL = otherUserDetails.photoURL;

        this.fireStore.doc('Users/' + this.moreDetailsObj.uid).set(this.moreDetailsObj, {
          merge: true
        });

        if(this.accountType == 'venue'){
          this.router.navigate(['/venue']);
        }else{
          this.router.navigate(['/member']);
        }
      }else{
        alert('Invalid Address')
      }
    }else{
      alert('Invalid Phone Number')
    }
  }


}
