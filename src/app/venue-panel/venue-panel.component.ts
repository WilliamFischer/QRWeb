import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Maps
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Address } from "ngx-google-places-autocomplete/objects/address";

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
  hasNoVenue: boolean;
  showVenueAddModel: boolean;
  loadingImageUpload: boolean;
  hasChecked: boolean;

  user: any;
  venue : any;
  rowData : any;

  venueOBJ: any = {
    name : '',
    location : '',
    industry : '',
    url : '',
    date : '',
    createdBy : ''
  }

  gridOptions = {
    columnDefs: [
      {headerName: 'Check-in Date', field: 'date'},
      {headerName: 'UID', field: 'guestId'},
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
        console.log(this.user.uid +' vs '+ venue['createdBy'])
        if(this.user.uid == venue['createdBy']){
          venueExists = true;
          this.venue = venue;
          localStorage.setItem('venue', JSON.stringify(venue));
          console.log(venue)

          let userCollection = this.fireStore.collection('Venues/' + venue['url']  + '/guests').valueChanges().subscribe(
          users =>{
            console.log(users);
            this.rowData = users;
            this.hasNoVenue = false;

            venueCollection.unsubscribe();
            userCollection.unsubscribe();
          });
        }
      });

      if(!venueExists){
        console.log('Oops! We couldn\'t find any venues under your account, please login again.');
        // this.logout();
        this.hasNoVenue = true;
      }

    });
  }

  logout(){
    this.afAuth.signOut();
    this.router.navigate(['/']);
  }


  submitVenue(){
    if(this.hasChecked){
      console.log(this.venueOBJ);

      this.venueOBJ.url = this.venueOBJ.name.toLowerCase().replace(/ /g, '');
      this.venueOBJ.date = new Date().toString();
      this.venueOBJ.createdBy = this.user.uid;

      if(!this.venueOBJ.industry){
        this.venueOBJ.industry = 'N/A'
      }

      this.fireStore.doc('Venues/' + this.venueOBJ.url).set(this.venueOBJ,{
        merge: true
      });

      alert('Welcome to QRWeb! You will now be taken to your QR Code');
      this.triggerModel();

      this.router.navigate(['/myqr']);
    }else{
      alert('Please agree to the terms')
    }

  }

  onChange(address: Address) {
    console.log(address);
    this.venueOBJ.location = address.formatted_address;
  }



  triggerModel() {
    this.showVenueAddModel = true;
  }

  closeModals() {
    this.showVenueAddModel = false;
  }

}
