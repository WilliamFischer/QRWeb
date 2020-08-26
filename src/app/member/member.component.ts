import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {

  currentUser: any;
  autoCompleteData : any;

  searchBy = 'name';

  constructor(
    private fireStore : AngularFirestore,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('guestUser'));
    console.log(this.currentUser)
    if(this.currentUser){
      this.loadAutoCompleteData();
    }
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

      console.log(cleanVenues);

      this.autoCompleteData = cleanVenues;
      venueCollection.unsubscribe();
    });
  }

  openVenue(item){
    console.log(item);
    this.router.navigate(['/' + item.url]);
  }

}
