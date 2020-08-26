import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Firebase
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'QRWeb';
  user: any;
  moreUserInfo: any;

  loadingImageUpload: boolean;

  constructor(
    private router: Router,
    private afAuth : AngularFireAuth,
    private fireStore : AngularFirestore,
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user){
        this.user = user;
        this.getDbInfo(user);
      }
    });
  }

  goToPage(page){
    this.router.navigateByUrl(page)
  }

  logout(){
    this.afAuth.signOut().then(() => {
      location.reload();
    })
  }

  getDbInfo(user) {
    // GET USER FROM FIREBASE
    let usersCollection = this.fireStore.collection('Users/').valueChanges().subscribe(
    users =>{
      let userArr = [];
      let venueExists = false;

      userArr.push(users);

      userArr[0].forEach(userObj => {
        if(user['uid'] == userObj.uid){
          this.moreUserInfo = userObj;
          usersCollection.unsubscribe();
        }
      });

    });
  }

}
