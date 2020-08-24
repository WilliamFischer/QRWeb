import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'app-venue-login',
  templateUrl: './venue-login.component.html',
  styleUrls: ['./venue-login.component.scss']
})
export class VenueLoginComponent implements OnInit {
  googleResults: any;

  guestObj : any = {
    email: '',
    password : ''
  }

  constructor(
    private fireStore: AngularFirestore,
    private router: Router,
    private afAuth : AngularFireAuth
  ) { }

  ngOnInit(): void {
  }

  goToPage(page){
    this.router.navigateByUrl(page)
  }

  async googleSignin(){
    let scope = this;
    const provider = new firebase.auth.GoogleAuthProvider()

    await this.afAuth.signInWithPopup(provider).then(function(results) {
      scope.googleResults = results.user;
      scope.userAddedSuccess();
    }).catch(function(error) {
      console.log(error);
      alert(error.message);
    });
  }

  userAddedSuccess(){
    localStorage.setItem('accountType', 'venue');
    localStorage.setItem('guestUser', JSON.stringify(this.googleResults));
    this.router.navigateByUrl('/moreinfo');
  }
}
