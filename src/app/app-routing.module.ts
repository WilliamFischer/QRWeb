import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Added Modules
import { LandingComponent } from './landing/landing.component';
import { VenueComponent } from './venue/venue.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'venue/:id', component: VenueComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
