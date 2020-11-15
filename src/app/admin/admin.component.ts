import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  attemptedPass: string;

  request : any = {
    name : '',
    sDate : '',
    eDate : '',
    sTime : '',
    eTime : '',
    aPass : ''
  }

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

        if(this.request.aPass.toLowerCase() == adminPassword.toLowerCase()){
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

      let venuesToPopulate = [];

      console.log(this.request);
      console.log(venues);
      
      venues.forEach(venue => {

        if(venue['name'].toLowerCase() == this.request['name'].toLowerCase()){
          let allGuestsCollection = this.fireStore.collection('Venues/' + venue['url'] + '/guests').valueChanges().subscribe(
          guests =>{
            console.log(guests);
            
            guests.forEach(guest => {
              let d = new Date(guest['date']);
              let formattedVenueDates = d.getUTCFullYear() + '/' + d.getUTCMonth() + '/' + d.getUTCDay();

              var dateFrom = this.request['sDate'];
              var dateTo = this.request['eDate'];
              var dateCheck = formattedVenueDates;
  
              var d1 = dateFrom.split("/");
              var d2 = dateTo.split("/");
              var c = dateCheck.split("/");
  
              var from = new Date(d1[2], parseInt(d1[1])-1, d1[0]);
              var to = new Date(d2[2], parseInt(d2[1])-1, d2[0]);
              var check = new Date(Number(c)[2], parseInt(c[1])-1, Number(c[0]));
  
              if(check > from && check < to){
                const start = this.request['sTime'];
                const end =  this.request['eTime'];
                const now = d.getHours() * 60 + d.getMinutes();
  
                if(start <= now && now <= end){
                  venuesToPopulate.push(guest)
                  console.log(venuesToPopulate)
                }
              }
  
              allGuestsCollection.unsubscribe();  
            });
            
          });
          
        }
      });

      if(venuesToPopulate.length !== 0){
        this.rowData = venuesToPopulate;
        console.log(this.rowData);
  
        this.isAdmin = true;
      }else{
        alert('No Data Found!')
      }

      allVenueCollection.unsubscribe();  
    });
  }

  // onRowClicked(params){
  //   this.showGuestGrid  = true;

  //   let allGuestsCollection = this.fireStore.collection('Venues/' + params.data.url + '/guests').valueChanges().subscribe(
  //   guests =>{
  //     this.guestData = guests;
  //     this.guestGridApi.setRowData(this.guestData);
  //     allGuestsCollection.unsubscribe();  
  //   });
  // }


}
