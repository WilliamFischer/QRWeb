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

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCR1tXABEbyc2kpc-0E95TW2Y52Iu9QtNs",
    authDomain: "dinesafe-5f15a.firebaseapp.com",
    databaseURL: "https://dinesafe-5f15a.firebaseio.com",
    projectId: "dinesafe-5f15a",
    storageBucket: "dinesafe-5f15a.appspot.com",
    messagingSenderId: "641810368179",
    appId: "1:641810368179:web:3743a91c06c62abc91d2c6",
    measurementId: "G-NZ096R000V"
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
    MoreinfoComponent
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
