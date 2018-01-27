import { Component } from '@angular/core';
import { Platform, ViewController } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';

// PROVIDERS
import { AssetsService } from '../../providers/assets-service/assets-service';

@Component({
  selector: 'modal-code-conduct',
  templateUrl: 'code-conduct.html',
  providers: [ AssetsService ]
})
export class CodeConductModal {
  
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public viewCtrl: ViewController,
    private assets: AssetsService
  ) { }
  
  ionViewWillEnter() {
    if (this.platform.is('cordova')) {
      this.statusBar.styleDefault(); 
    }
  }
  
  ionViewWillLeave() {
    if (this.platform.is('cordova')) {
      this.statusBar.styleLightContent(); 
    }
  }

  closeModal() {
    this.viewCtrl.dismiss();
  } 
}
