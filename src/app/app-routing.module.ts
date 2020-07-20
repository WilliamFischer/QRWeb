import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Added Modules
import { LandingComponent } from './landing/landing.component';
import { VenueComponent } from './venue/venue.component';
import { CheckinSuccessComponent } from './checkin-success/checkin-success.component';
import { VenuePanelComponent } from './venue-panel/venue-panel.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'venuepanel', component: VenuePanelComponent },
  { path: 'success', component: CheckinSuccessComponent },
  { path: ':id', component: VenueComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
