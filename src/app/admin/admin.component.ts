import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  attemptedPass: string;

  isAdmin: boolean;
  showGuestGrid: boolean;

  rowData : any;
  gridApi : any;

  guestData : any;
  guestGridApi: any;

  gridOptions = {
    columnDefs: [
      { headerName: 'Venue Name', field: 'name'},
      { headerName: 'Venue Key', field: 'key'},
      { headerName: 'Venue Location', field: 'location'},
      { headerName: 'Venue Sign Up Date', field: 'date'},
      { headerName: 'Venue User', field: 'createdBy'},
    ],
    defaultColDef: {
      flex: 1,
      filter: true,
      resizable: true
    },
    rowSelection: 'multiple',
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

  guestGridOptions = {
    columnDefs: [
      { headerName: 'Name', field: 'name'},
      { headerName: 'Email', field: 'email'},
      { headerName: 'Phone', field: 'phone'},
      { headerName: 'Address', field: 'address'},
      { headerName: 'Sign In Date', field: 'date'},
    ],
    defaultColDef: {
      flex: 1,
      filter: true,
      resizable: true
    },
    rowSelection: 'multiple',
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
  
  constructor(private fireStore : AngularFirestore) { }

  ngOnInit(): void {

  }

  submitPassword(){
    let adminCollection = this.fireStore.doc('Settings/Admin').valueChanges().subscribe(
      info =>{
        let adminPassword = info['adminPass'];

        if(this.attemptedPass.toLowerCase() == adminPassword.toLowerCase()){
          this.isAdmin = true;
          this.generateAllVenues();
        }else{
          alert('Incorrect password. Please try again.')
        }

        adminCollection.unsubscribe();
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  onGuestGridReady(params) {
    this.guestGridApi = params.api;
  }

  generateAllVenues(){
    let allVenueCollection = this.fireStore.collection('Venues').valueChanges().subscribe(
    venues =>{
      this.rowData = venues;
      allVenueCollection.unsubscribe();  
    });
  }

  onRowClicked(params){
    this.showGuestGrid  = true;

    let allGuestsCollection = this.fireStore.collection('Venues/' + params.data.url + '/guests').valueChanges().subscribe(
    guests =>{
      this.guestData = guests;
      this.guestGridApi.setRowData(this.guestData);
      allGuestsCollection.unsubscribe();  
    });
  }


}
