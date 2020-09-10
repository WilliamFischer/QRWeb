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

  quickGuest : any = {
    first_name : '',
    last_name : '',
    email : '',
    phone : '',
    address : '',
    password : '',
    confPass : ''
  }

  venue = 'venueName';
  autoCompleteData : any;
  guestUser : any;
  googleResults: any;


  constructor(
    private fireStore : AngularFirestore,
    private afAuth : AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user){
        this.canShowPage = true;

        // let venueCollection = this.fireStore.collection('Users/').valueChanges().subscribe(
        // venues =>{
        //   let venueObj = [];
        //   let venueExists = false;
        //
        //   venueObj.push(venues);
        //
        //   venueObj[0].forEach(venue => {
        //     console.log(user['email'] +' vs '+ venue.email)
        //     if(user['email'] == venue.email && venue.accountType == 'venue'){
        //       venueCollection.unsubscribe();
        //       venueExists = true;
        //       this.guestUser = null;
        //       this.canShowPage = false;
        //       this.router.navigate(['/venue']);
        //     }
        //   });
        //
        //   if(!venueExists){
        //     this.guestUser = user;
        //     this.canShowPage = true;
        //     venueCollection.unsubscribe();
        //   }
        //
        //   console.log(this.guestUser)
        //
        // });

        // this.router.navigate(['/myqr']);
      }else{
        console.log('NO USER')
        this.canShowPage = true;
      }
    });

    localStorage.removeItem('viewingVenue');
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
    this.router.navigateByUrl('/moreinfo');
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

  submitQuickGuest(){
    // console.log(this.quickGuest);

    let scope = this;

    if(this.quickGuest.address){
      this.afAuth.createUserWithEmailAndPassword(this.quickGuest.email, this.quickGuest.password).then(function() {

        // alert('Welcome to Ezy Checkin! You will now be taken to your QR Code');
        // this.triggerModel();
        //
        // this.router.navigate(['/myqr']);

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
          scope.router.navigateByUrl('/member');
        });

      }).catch(function(error) {
        alert(error.message);
      });
    }else{
      alert('Invalid Address')
    }

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
        scope.router.navigate(['/venue']);
      }).catch(function(error) {
        console.warn(error);
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
    this.venueOBJ.venueDate = new Date().toString();

    this.fireStore.doc('Venues/' + this.venueOBJ.venueURL).set(this.venueOBJ,{
      merge: true
    });

    alert('Welcome to Ezy Checkin! You will now be taken to your QR Code');
    this.triggerModel();

    this.router.navigate(['/myqr']);
  }

  onChange(address: Address) {
    // console.log(address);
    this.venueOBJ.location = address.formatted_address;
    this.quickGuest['address'] = address.formatted_address;
  }

  goHome(){
    this.router.navigate(['/']);
  }

  guestSigninModel(){
    this.router.navigate(['/guestlogin']);
  }

  directSuccess(){
    this.router.navigate(['/member']);
  }

  logout(){
    this.afAuth.signOut().then(() => {
      location.reload();
    })
  }

  goToPage(page){
    this.router.navigateByUrl(page)
  }
}
