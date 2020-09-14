import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
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
  showConfirmDelete:boolean;
  showEdit: boolean;

  user: any;
  moreUserInfo: any;
  gridApi : any;

  rowData : any = [];
  venues : any = [];

  venueOBJ: any = {
    name : '',
    location : '',
    industry : '',
    url : '',
    date : '',
    createdBy : '',
    hidden: false
  }

  venueEdit: any = {
    name : '',
    address : '',
    industry: ''
  };

  gridOptions = {
    columnDefs: [
      {headerName: 'Check-in Date', field: 'date'},
      {headerName: 'UID', field: 'guestId'},
      {headerName: 'Options', cellRenderer : function(){
            return '<div class="optionButtons"><button id="reportGuest">Report Guest</button></div>'
      }},
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
    private router: Router,
    private location: Location
  ) {
    let scope = this;

    document.addEventListener('click', function (event) {
        if(event.target['id'] !== 'reportGuest') return;
      	event.preventDefault();

        scope.reportGuest(event)
    }, false);
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (!user){
        this.router.navigate(['/']);
      }else{
        this.user = user;
        this.canShowPage = true;

        this.getDbInfo(user);
        this.getRowData()
      }
    });
  }

  getRowData() {

    // console.log(this.user);

    let venueCollection = this.fireStore.collection('Venues/').valueChanges().subscribe(
    venues =>{
      let venueObj = [];
      let venueExists = false;

      venueObj.push(venues);

      venueObj[0].forEach(venue => {
        // console.log(this.user.uid +' vs '+ venue['createdBy'])
        if(this.user.uid == venue['createdBy']){
          venueExists = true;
          this.venues.push(venue);
          localStorage.setItem('venue', JSON.stringify(venue));
          // console.log(venue)

          let userCollection = this.fireStore.collection('Venues/' + venue['url']  + '/guests').valueChanges().subscribe(
          users =>{
            users.forEach(user => {
              this.rowData.push(user);
              this.gridApi.setRowData(this.rowData);
              console.log(this.rowData);
            });


            this.hasNoVenue = false;

            // venueCollection.unsubscribe();
            // userCollection.unsubscribe();
          });
        }
        //
        //
        //
          console.log(this.rowData);
        console.log(this.venues);
      });

      if(!venueExists){
        // console.log('Oops! We couldn\'t find any venues under your account, please login again.');
        // this.logout();
        this.hasNoVenue = true;
      }
    });
  }

  logout(){
    this.afAuth.signOut();
    this.router.navigate(['/']);
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


  submitVenue(){
    if(this.hasChecked){
      // console.log(this.venueOBJ);

      this.venueOBJ.url = this.venueOBJ.name.toLowerCase().replace(/ /g, '');
      this.venueOBJ.date = new Date().toString();
      this.venueOBJ.createdBy = this.user.uid;

      if(!this.venueOBJ.industry){
        this.venueOBJ.industry = 'N/A'
      }

      this.fireStore.doc('Venues/' + this.venueOBJ.url).set(this.venueOBJ,{
        merge: true
      });

      alert('You\'re venue has been created! You will now be taken to it\'s QR Code');
      this.triggerModel();

      this.router.navigate(['/myqr']);
    }else{
      alert('Please agree to the terms')
    }

  }

  onChange(address: Address) {
    // console.log(address);
    this.venueOBJ.location = address.formatted_address;
  }

  deleteVenue(){
    this.showConfirmDelete = true;
  }

  editVenue(){
    this.showEdit = true;
  }

  actuallyDeleteVenue(venue){
    this.fireStore.doc('Venues/' + venue.url).delete().then(() => {
      this.venueOBJ = null;
      this.venues = [];

      this.closeModals();
      location.reload();
    });
  }

  confirmEditVenue(){
    this.closeModals();
    location.reload();
  }

  triggerModel() {
    this.showVenueAddModel = true;
  }

  closeModals() {
    this.showVenueAddModel = false;
    this.showConfirmDelete = false;
    this.showEdit = false;
  }

  reportGuest(guest){
    let reportedID = guest.target.parentElement.parentElement.parentElement.parentNode.children[1].innerHTML;
    let checkedInTime = guest.target.parentElement.parentElement.parentElement.parentNode.children[0].innerHTML;

    let reportObject = {
      id : reportedID,
      reportedTime: new Date().toString(),
      checkedInTime : checkedInTime
    }

    setTimeout(() => {
      this.fireStore.doc('Reports/' + reportedID).set(reportObject,{
        merge: true
      }).catch((error) => {
        console.log(error)
      }).then(() => {
        console.log(reportObject)
        alert('User has been tagged reported. You will be emailed with further details.');
      });
    }, 1000);




  }


  onGridReady(params) {
    this.gridApi = params.api;
  }

}
