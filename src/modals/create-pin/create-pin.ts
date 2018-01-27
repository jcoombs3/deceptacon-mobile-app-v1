import { Component } from '@angular/core';
import { ViewController, ToastController } from 'ionic-angular';

@Component({
  selector: 'modal-create-pin',
  templateUrl: 'create-pin.html'
})
export class CreatePinModal {
  counter: number = 0;
  pin: any = [];
  confirmPIN: boolean = false;
  
  constructor(
    public viewCtrl: ViewController,
    private toastCtrl: ToastController
  ) {
    
  }
  
  completePIN(pin: any) {
    if (this.counter === 0) {
      this.counter++;
      this.pin = pin;
      this.confirmPIN = true;
    } else {
      if (this.validatePIN(pin)) {
        let toast = this.toastCtrl.create({
          message: 'Account PIN created',
          duration: 2000,
          position: 'top',
          showCloseButton: true
        });
        toast.present();
        this.viewCtrl.dismiss(pin);
      } else {
        let toast = this.toastCtrl.create({
          message: 'Your PIN was not the same. Try again',
          duration: 2000,
          position: 'top',
          showCloseButton: true,
          cssClass: 'error'
        });
        toast.present();
        this.counter = 0;
        this.pin = [];
        this.confirmPIN = false;
      }   
    }
  }
  
  validatePIN(pin: any) {
    for (let i = 0; i < pin.length; i++) {
      if (pin[i] !== this.pin[i]) {
        return false;
      }
    }
    return true;
  }
}
