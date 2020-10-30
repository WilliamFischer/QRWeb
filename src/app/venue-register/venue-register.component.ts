import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

// Paypal
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-venue-register',
  templateUrl: './venue-register.component.html',
  styleUrls: ['./venue-register.component.scss']
})
export class VenueRegisterComponent implements OnInit {

  payPalConfig ? : IPayPalConfig;

  googleResults: any;

  userObj : any = {
    email : '',
    name : '',
    accountType : 'venue',
    uid : ''
  }

  tempPasswords = {
    password : '',
    confirm_password : ''
  }

  paypalMode: boolean;
  payPalKey: string = 'sb'
  promoPass: string;

  constructor(
    private fireStore: AngularFirestore,
    private router: Router,
    private afAuth : AngularFireAuth
  ) { }

  ngOnInit(): void {
    this.initConfig();
  }

  goToPage(page){
    this.router.navigateByUrl(page)
  }

  async googleSignin(){
    let scope = this;
    const provider = new firebase.auth.GoogleAuthProvider()

    await this.afAuth.signInWithPopup(provider).then(function(results) {
      scope.googleResults = results.user;
      this.continueToPaypal();
    }).catch(function(error) {
      console.log(error);
      alert(error.message);
    });
  }

  continueToPaypal(){
   this.paypalMode = true;
  }

  async register(){
    let scope = this;

    if(this.tempPasswords.password == this.tempPasswords.confirm_password){
      this.afAuth.createUserWithEmailAndPassword(this.userObj.email, this.tempPasswords.password).then(function(fbUserObj) {
        scope.submitUserDetails(fbUserObj);
      }).catch(function(error) {
        alert(error.message);
      });
    }else{
      alert('Your passwords do not match')
    }

  }

  payPalCompleted(){
    if(!this.googleResults){
      this.register();
    }else{
      this.userAddedSuccess();
    }
  }

  enterPromoSkipPayment(){
    let adminCollection = this.fireStore.doc('Settings/Admin').valueChanges().subscribe(
      info =>{
        let promoPassword = info['freeCode'];

        if(this.promoPass.toLowerCase() == promoPassword.toLowerCase()){
          this.payPalCompleted();
        }else{
          alert('Incorrect password. Please try again.')
        }

        adminCollection.unsubscribe();
    });
  }

  submitUserDetails(fbUserObj){

    this.userObj.uid = fbUserObj.user.uid;

    if(this.userObj.uid){
      this.fireStore.doc('Users/' + this.userObj.uid).set(this.userObj,{
        merge: true
      });

      this.goToPage('venue');
    }

  }


  userAddedSuccess(){
    localStorage.setItem('accountType', 'venue');
    localStorage.setItem('guestUser', JSON.stringify(this.googleResults));
    this.router.navigateByUrl('/moreinfo');
  }

  private initConfig(): void {
    this.payPalConfig = {
        currency: 'AUD',
        clientId: this.payPalKey,
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'AUD',
                    value: '14.99',
                    breakdown: {
                        item_total: {
                            currency_code: 'AUD',
                            value: '14.99'
                        }
                    }
                },
                items: [{
                    name: 'EzyCheckin Premium Membership',
                    quantity: '1',
                    category: 'DIGITAL_GOODS',
                    unit_amount: {
                        currency_code: 'AUD',
                        value: '14.99',
                    },
                }]
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then(details => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });

            this.payPalCompleted();
        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);

        },
        onError: err => {
            console.log('OnError', err);
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
        },
    };
}

}
