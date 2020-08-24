import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Firebase
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'QRWeb';
  user: any;

  constructor(private router: Router, private afAuth : AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      if (user){
        this.user = user;
      }
    });
  }

  goToPage(page){
    this.router.navigateByUrl(page)
  }

}
