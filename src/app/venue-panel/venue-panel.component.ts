import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';

import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-venue-panel',
  templateUrl: './venue-panel.component.html',
  styleUrls: ['./venue-panel.component.scss']
})
export class VenuePanelComponent implements OnInit {

  canShowPage : boolean;
  loadingImageUpload: boolean;

  user: any;
  venue : any;
  rowData : any;

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
    private storage: AngularFireStorage,
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
        console.log('Oops! We couldn\'t find any venues under your account, please login again.');
        this.logout();
      }

    });
  }

  logout(){
    this.afAuth.signOut();
    this.router.navigate(['/']);
  }

  myQR(){
    this.router.navigateByUrl('/myqr')
  }

  uploadVenueImg(event) {
    console.log('UPLOAD AN IMAGE');
    this.loadingImageUpload = true;

    const file = event.target.files[0];
    let randomID = Math.floor(Math.random() * 1000);
    const filePath = this.user['email'] + '/Tank Images/' + randomID;
    const fileRef = this.storage.ref(filePath)
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges().pipe(
        finalize(() => {
          const downloadURL = fileRef.getDownloadURL();

          downloadURL.subscribe(url=>{
             if(url){
               this.loadingImageUpload = false;
               console.log(url);
               this.venue['venueImage'] = url;

                this.fireStore.doc('Venues/' + this.venue['venueURL'])
                .set({
                  venueImage: url
                },{
                  merge: true
                });

                alert('Venue Photo Updated!')
             }
          })

        })
     )
    .subscribe()
  }

}
