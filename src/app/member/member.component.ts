import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';


// Maps
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Address } from "ngx-google-places-autocomplete/objects/address";


@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {

  currentUser: any;
  currentVenue: any;
  autoCompleteData : any;
  guestAdder:boolean;
  newGuestForm:boolean;
  canConfirmGuests:boolean;
    isDiningAlone:boolean;

  rowData : any;
  gridApi : any;

  searchBy = 'name';

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

  guestUserObj = {
    name: '',
    address : '',
    email : '',
    ph : '',
    date: ''
  }

  constructor(
    private fireStore : AngularFirestore,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.currentUser = JSON.parse(localStorage.getItem('guestUser'));
    this.currentVenue = JSON.parse(localStorage.getItem('exisitingVenue'));

    console.log(this.currentUser)
    if(this.currentUser){
      this.loadAutoCompleteData();
    }

    if(!this.currentUser.phone){
      this.getDbInfo(this.currentUser)
    }
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

  triggerGuestAdder(){
    this.guestAdder = true;
    this.newGuestForm = false;

    let userCollection = this.fireStore.collection('Users/' + this.currentUser['uid'] + '/companions').valueChanges().subscribe(
    users =>{
      // console.log(users);
      this.rowData = users;
      this.gridApi.setRowData(this.rowData);
      userCollection.unsubscribe();
    });
  }

  loadAutoCompleteData(){
    let venueCollection = this.fireStore.collection('Venues').valueChanges().subscribe(
    venues =>{

      let cleanVenues = [];

      for(let i in venues){
        if(venues[i]['url'] !== 'test'){
          cleanVenues.push(venues[i])
        }
      }

      // console.log(cleanVenues);

      this.autoCompleteData = cleanVenues;
      venueCollection.unsubscribe();
    });
  }

  openVenue(item){
    // console.log(item);
    this.router.navigate(['/' + item.url]);
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

    if(this.guestUserObj.address && this.currentUser['address']){
      this.guestUserObj.address = this.currentUser['address'];

      this.fireStore.doc('Users/' + this.currentUser['uid'] + '/companions/' + this.guestUserObj['email']).set(this.guestUserObj,{
        merge: true
      });

      this.triggerGuestAdder()
    }else{
      alert('Address not found. please login again.')
    }

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

  deleteGuests() {
    let selectedRows = this.gridApi.getSelectedRows();
    // console.log('DELETE : ')
    // console.log(selectedRows)


    for(let i in selectedRows){
      this.fireStore.doc('Users/' + this.currentUser.uid + '/companions/' + selectedRows[i].email).delete();
    }

    this.triggerGuestAdder()
  }

  diningAlone(){
    if (this.currentVenue['url'] == 'test'){
      // alert('Thank you for creating an account!')
      this.router.navigate(['/']);
    }else{
      this.isDiningAlone = true;
    }
  }

  onRowClicked(params){
    let selectedRows = this.gridApi.getSelectedRows();

    // console.log(selectedRows.length)

    if(!selectedRows.length){
      this.canConfirmGuests = false;
    }else{
      this.canConfirmGuests = true;
    }

    // console.log(this.canConfirmGuests)
  }


  onGridReady(params) {
    this.gridApi = params.api;
  }

  onChange(address: Address) {
    // console.log(address);
    this.guestUserObj.address = address.formatted_address;
  }

}
