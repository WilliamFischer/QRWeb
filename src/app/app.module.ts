import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Our Pages
import { LandingComponent } from './landing/landing.component';
import { VenueComponent } from './venue/venue.component';
import { CheckinSuccessComponent } from './checkin-success/checkin-success.component';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { VenuePanelComponent } from './venue-panel/venue-panel.component';

// AG Grid
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';

// Autocomplete Module
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

// GOOGLE MAPS AUTOCOMPLETE
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

// QR Code
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
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

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDox4vAMJNnJUqVx2GCvnhu75QcTTrVG_8",
    authDomain: "tempsafe-701d4.firebaseapp.com",
    databaseURL: "https://tempsafe-701d4.firebaseio.com",
    projectId: "tempsafe-701d4",
    storageBucket: "tempsafe-701d4.appspot.com",
    messagingSenderId: "446981905424",
    appId: "1:446981905424:web:94383288350928bb883e95"
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    VenueComponent,
    VenuePanelComponent,
    CheckinSuccessComponent,
    GeneratedQRComponent,
    AboutComponent,
    FaqComponent,
    ResourcesComponent,
    ContactComponent,
    DataComponent,
    PpComponent,
    TermsComponent,
    ForgotPassComponent,
    GuestLoginComponent,
    VenueLoginComponent,
    MoreinfoComponent,
    UploadComponent,
    MemberComponent,
    VenueRegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AgGridModule.withComponents([]),
    NgxQRCodeModule,
    AutocompleteLibModule,
    GooglePlaceModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
