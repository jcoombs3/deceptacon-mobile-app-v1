import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

// MODALS
import { CreateAccountModal } from '../../modals/create-account/create-account';

// PROVIDERS
//import { DeceptaconService } from '../../providers/deceptacon-service/deceptacon-service';
import { AssetsService } from '../../providers/assets-service/assets-service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    private assets: AssetsService
  ) {
    
  }
  
  displayLogin() {
    console.log('++ displayLogin');
  }
  
  createAccount() {
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
