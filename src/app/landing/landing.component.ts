import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

// Maps
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Address } from "ngx-google-places-autocomplete/objects/address";

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;

  showVenueAddModel : boolean;
  showVenueLoginModel : boolean;
  canShowPage : boolean;

  hasChecked : string;

  // options : any = {
  //   types: [],
  //   componentRestrictions: { country: 'AU' }
  // };

  venueACCOBJ : any = {
    email : '',
    pass : '',
    confirmPass : '',
  };

  venueOBJ : any = {
    email : '',
    uid : '',
    ph : '',
    location : '',
    industry : ''
  };

  venueShortOBJ : any = {
    email : '',
    password : ''
  };

  constructor(
    private fireStore : AngularFirestore,
    private afAuth : AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user){
        this.router.navigate(['/venuepanel']);
        // this.router.navigate(['/myqr']);
      }else{
        this.canShowPage = true;
      }
    });
  }

  triggerModel() {
    this.showVenueAddModel = true;
  }

  triggerSigninModel() {
    this.showVenueLoginModel = true;
  }

  closeModals() {
    this.showVenueAddModel = false;
    this.showVenueLoginModel = false;
  }

  submitVenue(){
    if(this.hasChecked){
      if(this.venueACCOBJ.email && this.venueACCOBJ.pass){
        if(this.venueOBJ.location){
          if(this.venueACCOBJ.pass.length >= 6){

            let scope = this;

            this.afAuth.createUserWithEmailAndPassword(this.venueACCOBJ.email, this.venueACCOBJ.pass).then(function() {
              scope.checkUserStatus();
            }).catch(function(error) {
              alert(error.message);
            });

          }else{
            alert('Your password is too short!')
          }
        }else{
          alert('Please enter an address')
        }
      }else{
        alert('Please enter a password & email')
      }
    }else{
      alert('You haven\'t agree to our terms & conditions')
    }
  }

  async login() {
    let scope = this;

    if(this.venueShortOBJ.email && this.venueShortOBJ.password){
      await this.afAuth.signInWithEmailAndPassword(this.venueShortOBJ.email, this.venueShortOBJ.password).then(function() {
        scope.router.navigate(['/venuepanel']);
      }).catch(function(error) {
        console.log(error);
        alert(error.message);
      });
    }else{
      alert('Something is missing...')
    }
  }

  checkUserStatus(){
    this.afAuth.authState.subscribe(user => {
      if (user){
        this.venueOBJ.uid = user.uid;
        this.venueOBJ.email = this.venueACCOBJ.email
        localStorage.setItem('user', JSON.stringify(user));

        this.saveUser();
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  saveUser(){
    console.log(this.venueOBJ);

    this.venueOBJ.venueURL = this.venueOBJ.venueName.toLowerCase().replace(/ /g, '');
    this.fireStore.doc('Venues/' + this.venueOBJ.venueURL).set(this.venueOBJ,{
      merge: true
    });

    alert('Welcome to QRWeb! You will now be taken to your QR Code');
    this.triggerModel();

    this.router.navigate(['/myqr']);
  }

  onChange(address: Address) {
    console.log(address);
    this.venueOBJ.location = address.formatted_address;
  }

  goHome(){
    this.router.navigate(['/']);
  }
}
