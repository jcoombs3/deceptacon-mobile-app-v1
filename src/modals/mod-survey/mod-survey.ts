import { Component } from '@angular/core';
import { Platform, ViewController, NavParams, 
         LoadingController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';

// PROVIDERS
import { DeceptaconService } from '../../providers/deceptacon-service/deceptacon-service';

@Component({
  selector: 'modal-mod-survey',
  templateUrl: 'mod-survey.html',
  providers: [ DeceptaconService ]
})
export class ModSurveyModal {
  alignment: any;
  villager: any;
  
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    private navParams: NavParams,
    private events: Events,
    private deceptaconService: DeceptaconService,
    private storage: Storage
  ) { 
    this.villager = this.navParams.data;  
  }
  
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
  
  publishWinner(alignment: any) {
    let arr = {
      villagerId: this.villager._id,
      gameId: this.villager.currentGame.game._id,
      winner: alignment._id
    };
    let loading = this.loadingCtrl.create({
      content: 'Saving...'
    });
    loading.present();
    this.storage.get('token').then(token => {
      if (token) {
        this.deceptaconService.publishWinnerDetails(arr, token)
          .subscribe(data => {
            loading.dismiss();
            this.events.publish('user:published');
            this.closeModal();
        }, error => {
          loading.dismiss();
        });
      }
    }); 
  }
  
  closeModal() {
    this.viewCtrl.dismiss();
  }
}
