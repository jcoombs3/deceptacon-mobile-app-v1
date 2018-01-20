import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { CreateAccountModal } from '../../modals/create-account/create-account';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController
  ) {
    
  }
  
  displayLogin() {
    console.log('++ displayLogin');
  }
  
  createAccount() {
    console.log('++ createAccount');
    const createAccountModal = this.modalCtrl.create(CreateAccountModal);
    createAccountModal.onDidDismiss(data => {
      if (data) {
//        this.villager = data;
//        this.login();
      }
    });
    createAccountModal.present();
  }
  
  openCodeConduct() {
    console.log('++ openCodeConduct');
  }
}
