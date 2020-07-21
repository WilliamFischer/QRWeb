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

      venueObj[0].forEach(venue => {
        if(this.user.uid == venue['uid']){
          console.log(venue)

          this.qrCodeUrl = window.location.href.replace('/myqr', '/' + venue.venueURL);
          console.log('Generated URL is ' + this.qrCodeUrl)

          this.canShowPage = true;
          venueCollection.unsubscribe();
        }
      });
    });
  }

  goHome(){
    this.router.navigate(['/']);
  }

  printTrigger(){
    window.print();
  }

}
