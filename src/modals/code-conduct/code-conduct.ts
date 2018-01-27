import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

// PROVIDERS
import { AssetsService } from '../../providers/assets-service/assets-service';

@Component({
  selector: 'modal-code-conduct',
  templateUrl: 'code-conduct.html',
  providers: [ AssetsService ]
})
export class CodeConductModal {
  
  constructor(
    public viewCtrl: ViewController,
    private assets: AssetsService
  ) { }

  closeModal() {
    this.viewCtrl.dismiss();
  } 
}
