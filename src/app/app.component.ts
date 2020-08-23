import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'QRWeb';

  constructor(private router: Router) {
  }

  goToPage(page){
    this.router.navigateByUrl(page)
  }

}
