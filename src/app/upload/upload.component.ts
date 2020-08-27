import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';

import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  loadingImageUpload: boolean;
  user: any;
  venue: any;

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

        let venue = localStorage.getItem('venue');
        if(venue){
          this.venue = JSON.parse(venue);
          // console.log(venue)
        }
      }
    });
  }

  uploadVenueImg(event) {
    // console.log('UPLOAD AN IMAGE');
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
               // console.log(url);
               this.venue['image'] = url;

                this.fireStore.doc('Venues/' + this.venue['url'])
                .set({
                  image: url
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
