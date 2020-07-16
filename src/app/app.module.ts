import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Our Pages
import { LandingComponent } from './landing/landing.component';
import { VenueComponent } from './venue/venue.component';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

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
    VenueComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
