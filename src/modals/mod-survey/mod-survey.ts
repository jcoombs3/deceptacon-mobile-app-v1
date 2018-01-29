import { Component } from '@angular/core';
import { ViewController, NavParams, LoadingController, Events, AlertController } from 'ionic-angular';

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
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public statusBar: StatusBar,
    private navParams: NavParams,
    private events: Events,
    private deceptaconService: DeceptaconService
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
  
  chooseAlignment(alignment: string, extraTxt: string) {
    this.alignment = alignment;
    this.showAlert(extraTxt);
    console.log('++ chooseAlignment', alignment); 
  }
  
  showAlert(extraTxt: string) {
    let alignmentTxt = new String(this.alignment);
    alignmentTxt = alignmentTxt.charAt(0).toUpperCase() + alignmentTxt.slice(1);
    if (extraTxt) {
      alignmentTxt = `${extraTxt} ${alignmentTxt}`;
    }
    let alert = this.alertCtrl.create({
      title: `Confirm ${alignmentTxt} won?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: () => {
            this.publish();
          }
        }
      ]
    });
    alert.present();
  }
  
  publish() {
    let arr = {
      villagerId: this.villager._id,
      gameId: this.villager.currentGame.game._id,
      winner: this.alignment
    };
    let loading = this.loadingCtrl.create({
      content: 'Saving...'
    });
    loading.present();
    this.deceptaconService.publishWinnerDetails(arr)
      .subscribe(data => {
        loading.dismiss();
        this.events.publish('user:published');
        this.closeModal();
    }, error => {
      loading.dismiss();
    });
  }
  
  closeModal() {
    this.viewCtrl.dismiss();
  }
}
