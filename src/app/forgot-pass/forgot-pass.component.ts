import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit {

  userEmail : string;

  constructor(
    private router: Router,
    private fireStore : AngularFirestore,
    private afAuth : AngularFireAuth
  ) { }

  ngOnInit(): void {
  }

  resetPassword() {
    if(this.userEmail){
      return this.afAuth.sendPasswordResetEmail(this.userEmail)
        .then(() => alert('Sent Password Reset Email!'))
        .catch((error) => console.log(error))
    }else{
      alert('Please enter an email address')
    }
  }

  goToPage(page){
    this.router.navigateByUrl(page)
  }

  goBack(){
    window.history.back();
  }

}
