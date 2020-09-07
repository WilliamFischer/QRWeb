import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Maps
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Address } from "ngx-google-places-autocomplete/objects/address";

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';


@Component({
  selector: 'app-guest-register',
  templateUrl: './guest-register.component.html',
  styleUrls: ['./guest-register.component.scss']
})
export class GuestRegisterComponent implements OnInit {


  quickGuest : any = {
    first_name : '',
    last_name : '',
    email : '',
    phone : '',
    address : '',
    password : '',
    confPass : ''
  }

  googleResults: any;


  constructor(
    private fireStore : AngularFirestore,
    private afAuth : AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  async googleSignin(){
    let scope = this;
    const provider = new firebase.auth.GoogleAuthProvider()

    await this.afAuth.signInWithPopup(provider).then(function(results) {
      scope.googleResults = results.user;
      scope.userAddedSuccess();
    }).catch(function(error) {
      // console.log(error);
      alert(error.message);
    });
  }

  userAddedSuccess(){
    localStorage.removeItem('guestUser');

    localStorage.setItem('guestUser', JSON.stringify(this.googleResults));

    let vewingVenue = localStorage.getItem('viewingVenue');
    console.log(vewingVenue)

    if(vewingVenue){
      this.router.navigate(['/' + vewingVenue]);
    }else{
      this.router.navigate(['/member']);
    }
  }

  submitQuickGuest(){
    let scope = this;

    if(this.quickGuest.address){
      this.afAuth.createUserWithEmailAndPassword(this.quickGuest.email, this.quickGuest.password).then(function() {
        scope.afAuth.authState.subscribe(user => {

          let cleanUser = {
            accountType : 'guest',
            address : scope.quickGuest.address,
            email : scope.quickGuest.email,
            name : scope.quickGuest.first_name + ' ' + scope.quickGuest.last_name,
            phone : scope.quickGuest.phone,
            photoURL : 'https://mcdowellhomes.com.au/wp-content/uploads/2016/09/no-user-image-300x300.gif',
            uid : user.uid,
          }
          scope.fireStore.doc('Users/' + user.uid).set(cleanUser, {
            merge: true
          });

          localStorage.setItem('guestUser', JSON.stringify(cleanUser));

          let vewingVenue = localStorage.getItem('viewingVenue');
          console.log(vewingVenue)

          if(vewingVenue){
            scope.router.navigate(['/' + vewingVenue]);
          }else{
            scope.router.navigate(['/member']);
          }

        });

      }).catch(function(error) {
        alert(error.message);
      });
    }else{
      alert('Invalid Address')
    }

  }

  onChange(address: Address) {
    this.quickGuest['address'] = address.formatted_address;
  }

  goToPage(page){
    this.router.navigateByUrl(page)
  }
}
