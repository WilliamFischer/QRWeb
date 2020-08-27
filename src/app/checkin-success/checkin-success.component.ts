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
  selector: 'app-checkin-success',
  templateUrl: './checkin-success.component.html',
  styleUrls: ['./checkin-success.component.scss']
})
export class CheckinSuccessComponent implements OnInit {

  isDiningAlone:boolean;
  guestAdder:boolean;
  newGuestForm:boolean;
  canConfirmGuests:boolean;
  quickLogin : boolean;

  rowData : any;
  currentUser : any;
  currentVenue : any;
  gridApi : any;;

  guestUserObj = {
    name: '',
    address : '',
    email : '',
    ph : '',
    date: ''
  }

  gridOptions = {
    columnDefs: [
      { maxWidth: 50, headerName: '', checkboxSelection: true},
      { headerName: 'Full Name', editable: true, field: 'name'},
      { headerName: 'Address', editable: true, field: 'address'},
    ],
    defaultColDef: {
      flex: 1,
      sortable: true,
    },
    rowSelection: 'multiple',
    groupSelectsChildren: true,
    suppressRowClickSelection: true,
    suppressAggFuncInHeader: true,
  };


  constructor(
    private router: Router,
    private fireStore : AngularFirestore,
    private afAuth : AngularFireAuth,
    private location: Location
  ) { }

  ngOnInit(): void {

    this.currentUser = JSON.parse(localStorage.getItem('guestUser'));
    this.currentVenue = JSON.parse(localStorage.getItem('exisitingVenue'));

    if(!this.currentUser || !this.currentVenue){
      alert('Something went Wrong!')
      this.location.back();
    }else if (this.currentVenue['venueURL'] == 'guestlogin'){
      this.quickLogin = true;
    }

    if(!this.currentUser.phone){
      this.getDbInfo(this.currentUser)
    }

    console.log(this.currentUser)
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
          this.currentUser = userObj;
          usersCollection.unsubscribe();
        }
      });

    });
  }

  goHome(){
    this.router.navigate(['/']);
  }

  checkInAgain (){
    this.location.back();
  }

  diningAlone(){
    if (this.currentVenue['venueURL'] == 'guestlogin'){
      // alert('Thank you for creating an account!')
      this.router.navigate(['/']);
    }else{
      this.isDiningAlone = true;
    }
  }

  logout(){
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/']);
    })
  }


  triggerGuestAdder(){
    this.guestAdder = true;
    this.newGuestForm = false;

    console.log(this.currentUser)
    let userCollection = this.fireStore.collection('Users/' + this.currentUser['uid'] + '/companions').valueChanges().subscribe(
    users =>{
      console.log(users);
      this.rowData = users;
      userCollection.unsubscribe();
    });
  }

  onChange(address: Address) {
    console.log(address);
    this.guestUserObj.address = address.formatted_address;
  }

  addNewGuest(){
    this.newGuestForm = true;
  }

  dontAddNewGuest(){
    this.newGuestForm = false;
  }

  dontAddGuest(){
    this.guestAdder = false;
    this.newGuestForm = false;
  }

  submitNewGuest(){

    if(!this.guestUserObj.address){
      this.guestUserObj.address = this.currentUser['address'];
    }

    this.fireStore.doc('Users/' + this.currentUser['uid'] + '/companions/' + this.guestUserObj['email']).set(this.guestUserObj,{
      merge: true
    });

    console.log(this.guestUserObj);
    this.triggerGuestAdder()

  }

  saveNewGuests() {
    let selectedRows = this.gridApi.getSelectedRows();

    if(selectedRows.length){
      for(let i in selectedRows){
        let row = selectedRows[i];
        let date = new Date().toString();
        let guestId = this.fireStore.createId();

        row['date'] = date;
        row['guestId'] = guestId;

        this.fireStore.doc('Venues/' + this.currentVenue.url + '/guests/' + guestId).set(row,{
          merge: true
        });
      }

      this.diningAlone();
    }
  }

  onRowClicked(params){
    let selectedRows = this.gridApi.getSelectedRows();

    console.log(selectedRows.length)

    if(!selectedRows.length){
      this.canConfirmGuests = false;
    }else{
      this.canConfirmGuests = true;
    }

    console.log(this.canConfirmGuests)
  }


  onGridReady(params) {
    this.gridApi = params.api;
  }
}
