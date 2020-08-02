import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

// Maps
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Address } from "ngx-google-places-autocomplete/objects/address";

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.scss']
})
export class VenueComponent implements OnInit {
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;

  currentVenue : any;
  venueFound : boolean;
  showUserAddModel : boolean;
  showUserSignInModel : boolean;
  venueLoaded : boolean;
  emailSignupMode : boolean;
  emailSigninMode : boolean;
  googleSigninMode: boolean;

  userObj = {
    name : '',
    email : '',
    password : '',
    address : '',
    // guestCount: '',
    ph : '',
    date : '',
    provider : 'email',
  }

  googleUserObj = {
    date : '',
    email : '',
    name : '',
    uid : '',
    address : '',
    ph : '',
    provider : 'google',
  }

  signinObj = {
    email : '',
    password : '',
  }

  googleResults : any;

  constructor(
    private fireStore: AngularFirestore,
    private router: Router,
    private afAuth : AngularFireAuth,
  ) { }

  ngOnInit(): void {
    let venueCode = window.location.pathname.replace('/', '');

    let venueCollection = this.fireStore.collection('Venues/').valueChanges().subscribe(
    venues =>{
      let venueObj = [];
      let venueExists = false;

      venueObj.push(venues);

      venueObj[0].forEach(venue => {
        if(venueCode == venue.venueURL){
          this.currentVenue = venue;
          this.venueFound = true;
          venueExists = true;

          venueCollection.unsubscribe();
        }
      });

      if(!venueExists){
        this.venueFound = false;
        venueCollection.unsubscribe();
      }

      this.venueLoaded = true;
    });
  }

  goToLanding(){
    this.router.navigateByUrl('/')
  }

  triggerModel(){
    this.showUserAddModel = !this.showUserAddModel;
  }

  triggerSignInModel(){
    this.showUserSignInModel = !this.showUserSignInModel;
  }

  hideModels(){
    this.showUserAddModel = false;
    this.showUserSignInModel = false;
  }

  submitSignInDetails(){
    console.log(this.userObj);
  }

  goHome(){
    this.router.navigate(['/']);
  }

  onChange(address: Address) {
    console.log(address);
    this.userObj.address = address.formatted_address;
    this.googleUserObj.address = address.formatted_address;
  }

  triggerEmailSignup(){
    this.emailSignupMode = true;
  }

  triggerEmailSignin() {
    this.emailSigninMode = true;
  }

  selectionHomeTrigger() {
    this.emailSignupMode = false;
    this.emailSigninMode = false;
  }

  async googleSignin(){
    let scope = this;
    const provider = new firebase.auth.GoogleAuthProvider()

    await this.afAuth.signInWithPopup(provider).then(function(results) {
      scope.googleResults = results;
      scope.checkForGoogleUser();
    }).catch(function(error) {
      console.log(error);
      alert(error.message);
    });
  }

  async signUserIn() {
    let scope = this;
    if(this.userObj.email && this.userObj.password){
      await this.afAuth.signInWithEmailAndPassword(this.userObj.email, this.userObj.password).then(function() {
        scope.router.navigateByUrl('/success');
      }).catch(function(error) {
        console.log(error);
        alert(error.message);
      });
    }else{
      alert('Something is missing...');
    }
  }

  async createUser(){
    let scope = this;
    this.afAuth.createUserWithEmailAndPassword(this.signinObj.email, this.signinObj.password).then(function() {
      scope.submitUserDetails();
    }).catch(function(error) {
      alert(error.message);
    });
  }

  checkForGoogleUser(){
    if(this.googleResults.user){

      this.googleUserObj.date = new Date().toString();
      this.googleUserObj.name = this.googleResults.user.displayName;
      this.googleUserObj.email = this.googleResults.user.email;
      this.googleUserObj.uid = this.googleResults.user.uid;

      console.log(this.googleUserObj);

      let guestCollection = this.fireStore.collection('Users').valueChanges().subscribe(
      guests =>{
        let guestObj = [];
        let guestExists = false;

        guestObj.push(guests);

        guestObj[0].forEach(guest => {
          if(this.googleResults.user.uid == guest.uid){
            guestExists = true;
            console.log(guest);

            this.googleUserObj.ph = guest.ph;
            this.googleUserObj.address = guest.address;
          }
        });

        guestCollection.unsubscribe();

        if(guestExists){
          this.saveGoogleUser();
        }else{
          this.googleSigninMode = true;
        }
      });
    }
  }

  saveGoogleUser(){
    this.fireStore.doc('Venues/' + this.currentVenue.venueURL + '/guests/' + this.googleUserObj.date).set(this.googleUserObj,{
      merge: true
    });

    this.userAddedSuccess();
  }

  saveNewGoogleUser(){
    this.fireStore.doc('Users/' + this.googleUserObj.email).set(this.googleUserObj,{
      merge: true
    });

    this.fireStore.doc('Venues/' + this.currentVenue.venueURL + '/guests/' + this.googleUserObj.date).set(this.googleUserObj,{
      merge: true
    });

    this.userAddedSuccess();
  }

  userAddedSuccess(){
    localStorage.setItem('guestUser', JSON.stringify(this.googleUserObj));
    localStorage.setItem('exisitingVenue', JSON.stringify(this.currentVenue));
    this.router.navigateByUrl('/success');
  }

  submitUserDetails(){
    if(this.userObj.name){
      if(this.userObj.address){
        console.log(this.userObj)

        this.userObj.date = new Date().toString();

        this.fireStore.doc('Users/' + this.userObj.email).set(this.userObj,{
          merge: true
        });

        this.saveUserData();
      }else{
        alert('Please enter an address')
      }
    }else{
      alert('Something is missing..')
    }
  }

  saveUserData() {

    this.userObj.date = new Date().toString();
    this.fireStore.doc('Venues/' + this.currentVenue.venueURL + '/guests/' + this.userObj.date).set(this.userObj,{
      merge: true
    });

    this.userAddedSuccess();
  }

}
