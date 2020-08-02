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

  rowData : any;
  currentUser : any;
  currentVenue : any;
  gridApi : any;;

  guestUserObj = {
    name: '',
    address : '',
    email : '',
    ph : ''
  }

  gridOptions = {
    columnDefs: [
      { maxWidth: 30, headerName: '', checkboxSelection: true},
      { headerName: 'Full Name', field: 'name'},
      { headerName: 'Address', field: 'address'},
    ],
    defaultColDef: {
      flex: 1,
    },
    rowSelection: 'mutliple',
  };


  constructor(
    private router: Router,
    private fireStore : AngularFirestore,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('guestUser'));
    this.currentVenue = JSON.parse(localStorage.getItem('exisitingVenue'));

    if(!this.currentUser || !this.currentVenue){
      alert('Something went Wrong!')
      this.location.back();
    }
  }

  goHome(){
    this.router.navigate(['/']);
  }

  checkInAgain (){
    this.location.back();
  }

  diningAlone(){
    this.isDiningAlone = true;
  }

  triggerGuestAdder(){
    this.guestAdder = true;
    this.newGuestForm = false;

    let userCollection = this.fireStore.collection('Users/' + this.currentUser['email'] + '/companions').valueChanges().subscribe(
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

    this.fireStore.doc('Users/' + this.currentUser['email'] + '/companions/' + this.guestUserObj['email']).set(this.guestUserObj,{
      merge: true
    });

    console.log(this.guestUserObj);
    this.triggerGuestAdder()

  }

  saveNewGuests() {
    let selectedRows = this.gridApi.getSelectedRows();

    for(let i in selectedRows){
      let row = selectedRows[i];


      let date = new Date().toString();
      this.fireStore.doc('Venues/' + this.currentVenue.venueURL + '/guests/' + date).set(row,{
        merge: true
      });

      this.diningAlone();
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }
}
