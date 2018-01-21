import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'modal-create-pin',
  templateUrl: 'create-pin.html'
})
export class CreatePinModal {
  
  constructor(public viewCtrl: ViewController) {
    
  }
  
  completePIN(pin: any) {
    this.viewCtrl.dismiss(pin);
  }
}
