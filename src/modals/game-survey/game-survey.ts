import { Component } from '@angular/core';
import { ViewController, NavParams, LoadingController, Events } from 'ionic-angular';
import { NgForm } from '@angular/forms';

// PROVIDERS
import { DeceptaconService } from '../../providers/deceptacon-service/deceptacon-service';

@Component({
  selector: 'modal-game-survey',
  templateUrl: 'game-survey.html',
  providers: [ DeceptaconService ]
})
export class GameSurveyModal {
  villager: any;
  alignment: any;
  role: any;
  
  constructor(
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    private navParams: NavParams,
    private events: Events,
    private deceptaconService: DeceptaconService
  ) { 
    this.villager = this.navParams.data;  
  }
  
  closeModal() {
    this.viewCtrl.dismiss();
  }
  
  publishRole() {
    if (this.verify()) {
      let arr = {
        villagerId: this.villager._id,
        gameId: this.villager.currentGame.game._id,
        alignment: this.alignment,
        role: this.role
      };
      let loading = this.loadingCtrl.create({
        content: 'Saving...'
      });
      loading.present();
      this.deceptaconService.publishGameDetails(arr)
        .subscribe(data => {
          console.log('++ success');
          loading.dismiss();
          this.events.publish('user:published');
          this.closeModal();
      }, error => {
        console.log('++ error');
        loading.dismiss();
      });
    }
  }
  
  verify() {
    if (!this.alignment) {
      console.log('++ no alignment');
      return false;
    } else if (!this.role) {
      console.log('++ no role');
      return false;
    }
    return true;
  }
}
