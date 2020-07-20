import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.scss']
})
export class VenueComponent implements OnInit {
  currentVenue : any;
  venueFound : boolean;
  showUserAddModel : boolean;
  showUserSignInModel : boolean;

  userObj = {
    name : '',
    email : '',
    password : '',
    postCode : '',
    ph : '',
    date : ''
  }

  constructor(
    private fireStore: AngularFirestore,
    private router: Router
  ) { }

  ngOnInit(): void {
    let venueCode = window.location.pathname.replace('/venue/', '');

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
        }
      });

      if(!venueExists){
        this.venueFound = false;
      }
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
    console.log(this.userObj)

    this.userObj.date = new Date().toString();
    let userAddress = this.fireStore.doc('Users/' + this.userObj.email);
    userAddress.set(this.userObj,{
      merge: true
    });

    this.signUserIn();
  }

  submitSignInDetails(){
    console.log(this.userObj);
  }

  signUserIn(){
    this.userObj.date = new Date().toString();
    let venueSignInAddress = this.fireStore.doc('Venues/' + this.currentVenue.venueURL + '/SIGNINS/' + this.userObj.date);
    venueSignInAddress.set(this.userObj,{
      merge: true
    });
  }

}
