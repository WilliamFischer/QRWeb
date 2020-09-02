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
  hasVenues: boolean;

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

     var x = document.getElementById("burgerLinks");
     if (x.style.display === "block") {
       x.style.display = "none";
     }

    this.router.navigateByUrl(page);
  }

  logout(){
    this.router.navigate(['/']);

    this.afAuth.signOut().then(() => {
      location.reload();
      localStorage.removeItem('guestUser')
      localStorage.removeItem('accountType')
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
          this.checkiIfUserHasVenue();
          usersCollection.unsubscribe();
        }
      });

    });
  }

  checkiIfUserHasVenue(){
    // CHECK IF USER HAS VENUES
    let usersCollection = this.fireStore.collection('Venues/').valueChanges().subscribe(
    venue =>{
      let venueArr = [];

      venueArr.push(venue);

      venueArr[0].forEach(userObj => {
        if(this.moreUserInfo['uid'] == userObj.createdBy){
          this.hasVenues = true;
        }
      });

    });
  }
  triggerBurgerMenu(){
     var x = document.getElementById("burgerLinks");
     if (x.style.display === "block") {
       x.style.display = "none";
     } else {
       x.style.display = "block";
     }
  }

}
