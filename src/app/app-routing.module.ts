import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Our Pages
import { LandingComponent } from './landing/landing.component';
import { VenueComponent } from './venue/venue.component';
import { CheckinSuccessComponent } from './checkin-success/checkin-success.component';
import { VenuePanelComponent } from './venue-panel/venue-panel.component';
import { GeneratedQRComponent } from './generated-qr/generated-qr.component';
import { AboutComponent } from './about/about.component';
import { FaqComponent } from './faq/faq.component';
import { ResourcesComponent } from './resources/resources.component';
import { ContactComponent } from './contact/contact.component';
import { DataComponent } from './data/data.component';
import { PpComponent } from './pp/pp.component';
import { TermsComponent } from './terms/terms.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { GuestLoginComponent } from './guest-login/guest-login.component';
import { VenueLoginComponent } from './venue-login/venue-login.component';
import { MoreinfoComponent } from './moreinfo/moreinfo.component';
import { UploadComponent } from './upload/upload.component';
import { MemberComponent } from './member/member.component';
import { VenueRegisterComponent } from './venue-register/venue-register.component';


const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'venue', component: VenuePanelComponent },
  { path: 'success', component: CheckinSuccessComponent },
  { path: 'member', component: MemberComponent },
  { path: 'myqr', component: GeneratedQRComponent },
  { path: 'about', component: AboutComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'data', component: DataComponent },
  { path: 'pp', component: PpComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'forgot-pass', component: ForgotPassComponent },
  { path: 'guest-login', component: GuestLoginComponent },
  { path: 'venue-login', component: VenueLoginComponent },
  { path: 'venue-register', component: VenueRegisterComponent },
  { path: 'moreinfo', component: MoreinfoComponent },
  { path: 'upload', component: UploadComponent },
  { path: ':id', component: VenueComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
