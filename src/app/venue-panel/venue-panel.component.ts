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

  gridOptions = {
    columnDefs: [
      {headerName: 'Check-in Date', field: 'date'},
      {headerName: 'Full Name', field: 'name'},
      {headerName: 'Email Address', field: 'email'},
      {headerName: 'Address', field: 'address'},
      {headerName: 'Phone Number', field: 'ph'},
      {headerName: '# Of Guests', field: 'guestCount'}
    ],
    defaultColDef : {
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true
    },
    enableSorting: true,
    sideBar : {
        toolPanels: [
            {
                id: 'filters',
                labelDefault: 'Filters',
                labelKey: 'filters',
                iconKey: 'filter',
                toolPanel: 'agFiltersToolPanel',
            }
        ],
        defaultToolPanel: ''
    }
  };

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

    console.log(this.user);

    let venueCollection = this.fireStore.collection('Venues/').valueChanges().subscribe(
    venues =>{
      let venueObj = [];
      let venueExists = false;

      venueObj.push(venues);

      venueObj[0].forEach(venue => {
        console.log(this.user.email +' vs '+ venue['email'])
        if(this.user.email == venue['email']){
          venueExists = true;
          this.venue = venue;
          console.log(venue)

          let userCollection = this.fireStore.collection('Venues/' + venue['venueURL']  + '/guests').valueChanges().subscribe(
          users =>{
            console.log(users);
            this.rowData = users;

            venueCollection.unsubscribe();
            userCollection.unsubscribe();
          });
        }
      });

      if(!venueExists){
        alert('Oops! We couldn\'t find any venues under your account, please login again.');
        this.logout();
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
