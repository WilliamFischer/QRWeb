import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  showVenueAddModel : boolean;
  showVenueLoginModel : boolean;
  canShowPage : boolean;

  venueACCOBJ : any = {
    email : '',
    pass : '',
    confirmPass : '',
  };

  venueOBJ : any = {
    userName : '',
    uid : '',
    ph : '',
    location : {
      street : '',
      city : '',
      state : '',
      postcode : '',
      country : ''
    },
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
    if(this.venueACCOBJ.email && this.venueACCOBJ.pass){
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
      alert('Something is wrong!')
    }
  }

  async login() {
    if(this.venueShortOBJ.email && this.venueShortOBJ.password){
      var result = await this.afAuth.signInWithEmailAndPassword(this.venueShortOBJ.email, this.venueShortOBJ.password)
      this.router.navigate(['/venuepanel']);
    }else{
      alert('Something is missing...')
    }
  }

  checkUserStatus(){
    this.afAuth.authState.subscribe(user => {
      if (user){
        this.venueOBJ.uid = user.uid;
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
    let venueAddress = this.fireStore.doc('Venues/' + this.venueOBJ.venueURL);
    venueAddress.set(this.venueOBJ,{
      merge: true
    });

    alert('Welcome to QRWeb!');
    this.triggerModel();

    this.router.navigate(['/venuepanel']);
  }

}
