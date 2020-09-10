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
  signedInUsers : any = [];
  currentUser : any;
  currentVenue : any;
  gridApi : any;
  selectedRows : any;

  guestUserObj = {
    fName: '',
    lName: '',
    address : '',
    email : '',
    ph : '',
    date: '',
    isFamily: ''
  }

  gridOptions = {
    defaultColDef: {
      flex: 1,
      sortable: true,
    },
    rowSelection: 'multiple',
    groupSelectsChildren: true,
    suppressRowClickSelection: true,
    suppressAggFuncInHeader: true,
  };

  guestGridOptions = {
    defaultColDef: {
      flex: 1,
      sortable: true,
    },
  };

  usersGuestColumns = [
    { maxWidth: 50, headerName: '', checkboxSelection: true},
    { headerName: 'First Name', editable: true, field: 'fName'},
    { headerName: 'Last Name', editable: true, field: 'lName'},
    { headerName: 'Address', editable: true, field: 'address'},
  ];

  signedInGuests = [
    { headerName: 'First Name', editable: true, field: 'fName'},
    { headerName: 'Last Name', editable: true, field: 'lName'},
    { headerName: 'Email', editable: true, field: 'email'},
    { headerName: 'Phone Number', editable: true, field: 'ph'},
    { headerName: 'Address', editable: true, field: 'address'},
  ];


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

  deleteGuests() {
    let selectedRows = this.gridApi.getSelectedRows();
    // console.log('DELETE : ')
    // console.log(selectedRows)


    for(let i in selectedRows){
      this.fireStore.doc('Users/' + this.currentUser.uid + '/companions/' + selectedRows[i].email).delete();
    }

    this.triggerGuestAdder()
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
    this.generateSignInTable();

    if (this.currentVenue['venueURL'] == 'guestlogin'){
      // alert('Thank you for creating an account!')
      this.router.navigate(['/']);
    }else{
      this.isDiningAlone = true;
    }
  }

  generateSignInTable(){
    this.currentUser.ph = this.currentUser.phone;

    if(this.rowData){
      this.signedInUsers.push(this.currentUser);

      for (var i = 0; i < this.selectedRows.length; i++) {
        this.signedInUsers.push(this.selectedRows[i]);
      }
    }else{
      this.signedInUsers.push(this.currentUser);
    }

    console.log(this.signedInUsers);
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
      // console.log(users);
      this.rowData = users;
      this.gridApi.setRowData(this.rowData);
      userCollection.unsubscribe();
    });
  }

  onChange(address: Address) {
    // console.log(address);
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
    console.log(this.currentUser);

    if(this.guestUserObj.isFamily){
      this.guestUserObj.email = this.currentUser['email'];
      this.guestUserObj.address = this.currentUser['address'];
      this.guestUserObj.ph = this.currentUser['phone'];

      let name =  this.guestUserObj['fName'] + ' ' +  this.guestUserObj['lName']
      this.fireStore.doc('Users/' + this.currentUser['uid'] + '/companions/' + name).set(this.guestUserObj,{
        merge: true
      });

    }else{
      if(this.guestUserObj.address){
        this.fireStore.doc('Users/' + this.currentUser['uid'] + '/companions/' + this.guestUserObj['email']).set(this.guestUserObj,{
          merge: true
        });
      }else if(this.currentUser['address']){
        this.guestUserObj.address = this.currentUser['address'];

        this.fireStore.doc('Users/' + this.currentUser['uid'] + '/companions/' + this.guestUserObj['email']).set(this.guestUserObj,{
          merge: true
        });
      }else{
        alert('Address not found. please login again.')
      }
    }

    let scope = this;
    setTimeout(function(){
      scope.triggerGuestAdder();
    }, 1000);

  }

  saveNewGuests() {
    if(this.selectedRows.length){
      for(let i in this.selectedRows){
        let row = this.selectedRows[i];
        let date = new Date().toString();
        let guestId = this.fireStore.createId();

        row['date'] = date;
        row['guestId'] = guestId;

        this.fireStore.doc('Venues/' + this.currentVenue.url + '/guests/' + guestId).set(row,{
          merge: true
        });
      }

      this.diningAlone();
    }else{
      alert('No rows selected')
    }
  }

  onRowClicked(params){
    this.selectedRows = this.gridApi.getSelectedRows();

    // console.log(selectedRows.length)

    if(!this.selectedRows.length){
      this.canConfirmGuests = false;
    }else{
      this.canConfirmGuests = true;
    }

    // console.log(this.canConfirmGuests)
  }


  onGridReady(params) {
    this.gridApi = params.api;
  }
}
