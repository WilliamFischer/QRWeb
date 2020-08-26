import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'app-guest-login',
  templateUrl: './guest-login.component.html',
  styleUrls: ['./guest-login.component.scss']
})
export class GuestLoginComponent implements OnInit {
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
    localStorage.removeItem('guestUser');

    localStorage.setItem('guestUser', JSON.stringify(this.googleResults));
    this.router.navigateByUrl('/moreinfo');
  }

}
