import { Component } from '@angular/core';
import { ViewController, ToastController } from 'ionic-angular';

@Component({
  selector: 'modal-create-pin',
  templateUrl: 'create-pin.html'
})
export class CreatePinModal {
  
  constructor(
    public viewCtrl: ViewController,
    private toastCtrl: ToastController
  ) {
    
  }
  
  completePIN(pin: any) {
    let toast = this.toastCtrl.create({
      message: 'Account PIN created',
      duration: 2000,
      position: 'top',
      showCloseButton: true
    });
    toast.present();
    this.viewCtrl.dismiss(pin);
  }
}
