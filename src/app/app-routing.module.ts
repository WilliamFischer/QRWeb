import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Our Pages
import { LandingComponent } from './landing/landing.component';
import { VenueComponent } from './venue/venue.component';
import { CheckinSuccessComponent } from './checkin-success/checkin-success.component';
import { VenuePanelComponent } from './venue-panel/venue-panel.component';
import { GeneratedQRComponent } from './generated-qr/generated-qr.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'venuepanel', component: VenuePanelComponent },
  { path: 'success', component: CheckinSuccessComponent },
  { path: 'myqr', component: GeneratedQRComponent },
  { path: ':id', component: VenueComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
