import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-venue-panel',
  templateUrl: './venue-panel.component.html',
  styleUrls: ['./venue-panel.component.scss']
})
export class VenuePanelComponent implements OnInit {
  canShowPage : boolean;

  user: any;
  venue : any;
  rowData : any;

  columnDefs = [
      {headerName: 'Name', field: 'name'},
      {headerName: 'Email Address', field: 'email'},
      {headerName: 'Postcode', field: 'postCode'},
      {headerName: 'Phone Number', field: 'ph'},
      {headerName: 'Check-in Date', field: 'date'}
  ];

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
        this.canShowPage = true;

        this.getRowData()
      }
    });
  }

  getRowData() {
    let venueCollection = this.fireStore.collection('Venues/').valueChanges().subscribe(
    venues =>{
      let venueObj = [];
      let venueExists = false;

      venueObj.push(venues);

      venueObj[0].forEach(venue => {
        if(this.user.uid == venue['uid']){
          venueExists = true;
          this.venue = venue;
          console.log(venue)

          let userCollection = this.fireStore.collection('Venues/' + venue['venueURL']  + '/SIGNINS').valueChanges().subscribe(
          users =>{
            console.log(users);
            this.rowData = users;
          });
        }
      });

      if(!venueExists){
        alert('Oops! We couldn\'t find any venues under your account, please login again.');
      }

    });
  }

  logout(){
    this.afAuth.signOut();
    this.router.navigate(['/']);
  }

  myQR(){this.router.navigateByUrl('/myqr')
  }

}
