import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

// Maps
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Address } from "ngx-google-places-autocomplete/objects/address";

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';

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

  userObj = {
    name : '',
    email : '',
    address : '',
    guestCount: '',
    ph : '',
    date : ''
  }

  constructor(
    private fireStore: AngularFirestore,
    private router: Router
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

  submitUserDetails(){
    if(this.userObj.name){
      if(this.userObj.address){
        console.log(this.userObj)

        this.userObj.date = new Date().toString();

        this.fireStore.doc('Users/' + this.userObj.email).set(this.userObj,{
          merge: true
        });

        this.signUserIn();
      }else{
        alert('Please enter an address')
      }
    }else{
      alert('Something is missing..')
    }
  }

  submitSignInDetails(){
    console.log(this.userObj);
  }

  signUserIn(){
    this.userObj.date = new Date().toString();
    this.fireStore.doc('Venues/' + this.currentVenue.venueURL + '/guests/' + this.userObj.date).set(this.userObj,{
      merge: true
    });

    this.router.navigateByUrl('/success')
  }

  goHome(){
    this.router.navigate(['/']);
  }

  onChange(address: Address) {
    console.log(address);
    this.userObj.address = address.formatted_address;
  }

}
