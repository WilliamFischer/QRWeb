import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-generated-qr',
  templateUrl: './generated-qr.component.html',
  styleUrls: ['./generated-qr.component.css']
})
export class GeneratedQRComponent implements OnInit {

  qrCodeUrl : string;

  user : any;
  printVenue : any;
  canShowPage: boolean;


  constructor(
    private fireStore : AngularFirestore,
    private afAuth : AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (!user){
        this.router.navigate(['/']);
      }else{
        this.user = user;

        this.generateMyQR()
      }
    });
  }

  generateMyQR(){
    let venueCollection = this.fireStore.collection('Venues/').valueChanges().subscribe(
    venues =>{
      let venueObj = [];
      venueObj.push(venues);

      let hasVenue = false;

      venueObj[0].forEach(venue => {
        if(this.user.uid == venue['createdBy']){
          // console.log(venue)

          this.qrCodeUrl = window.location.href.replace('/myqr', '/' + venue.url);
          // console.log('Generated URL is ' + this.qrCodeUrl)
          this.printVenue = venue;

          this.canShowPage = true;
          hasVenue = true;
          venueCollection.unsubscribe();
        }
      });

      // if(!hasVenue){
      //   this.logout();
      // }
    });
  }

  goHome(){
    this.router.navigate(['/']);
  }

  goToVenuePanel(){
    this.router.navigate(['/venue']);
  }

  printTrigger(){
    localStorage.setItem('printVenue', JSON.stringify(this.printVenue));
    this.router.navigate(['/qrPrint']);
  }

  logout(){
    this.afAuth.signOut();
    this.router.navigate(['/']);
  }

}
