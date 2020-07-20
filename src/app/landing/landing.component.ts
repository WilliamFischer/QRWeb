import { Component, OnInit } from '@angular/core';

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  showVenueAddModel : boolean;
  venueOBJ : any = {
    userName : '',
    email : '',
    ph : '',
    pass : '',
    confirmPass : '',
    venueName : '',
    venueURL : '',
    location : {
      street : '',
      city : '',
      state : '',
      postcode : '',
      country : ''
    },
    industry : ''
  }

  constructor(private fireStore : AngularFirestore) { }

  ngOnInit(): void {
  }

  triggerModel() {
    this.showVenueAddModel = !this.showVenueAddModel;
  }

  submitVenue(){
    console.log(this.venueOBJ)

    this.venueOBJ.venueURL = this.venueOBJ.venueName.toLowerCase().replace(/ /g, '');
    let venueAddress = this.fireStore.doc('Venues/' + this.venueOBJ.venueURL);
    venueAddress.set(this.venueOBJ,{
      merge: true
    });

    console.log('Data set')
    this.triggerModel();
  }

}
