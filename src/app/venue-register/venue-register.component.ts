import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'app-venue-register',
  templateUrl: './venue-register.component.html',
  styleUrls: ['./venue-register.component.scss']
})
export class VenueRegisterComponent implements OnInit {
  googleResults: any;

  userObj : any = {
    email : '',
    name : '',
    accountType : 'venue',
    uid : ''
  }

  tempPasswords = {
    password : '',
    confirm_password : ''
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

  async register(){
    let scope = this;

    if(this.tempPasswords.password == this.tempPasswords.confirm_password){
      this.afAuth.createUserWithEmailAndPassword(this.userObj.email, this.tempPasswords.password).then(function(fbUserObj) {
        scope.submitUserDetails(fbUserObj);
      }).catch(function(error) {
        alert(error.message);
      });
    }else{
      alert('Your passwords do not match')
    }

  }

  submitUserDetails(fbUserObj){

    this.userObj.uid = fbUserObj.user.uid;

    if(this.userObj.uid){
      this.fireStore.doc('Users/' + this.userObj.uid).set(this.userObj,{
        merge: true
      });

      this.goToPage('venue');
    }

  }


  userAddedSuccess(){
    localStorage.setItem('accountType', 'venue');
    localStorage.setItem('guestUser', JSON.stringify(this.googleResults));
    this.router.navigateByUrl('/moreinfo');
  }
}
