import { Component } from '@angular/core';
import { ViewController, NavParams, LoadingController, Events } from 'ionic-angular';

// PROVIDERS
import { DeceptaconService } from '../../providers/deceptacon-service/deceptacon-service';

@Component({
  selector: 'modal-mod-survey',
  templateUrl: 'mod-survey.html',
  providers: [ DeceptaconService ]
})
export class ModSurveyModal {
  villager: any;
  winner: any;
  
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
        winner: this.winner
      };
      let loading = this.loadingCtrl.create({
        content: 'Saving...'
      });
      loading.present();
      this.deceptaconService.publishWinnerDetails(arr)
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
    if (!this.winner) {
      console.log('++ no winner');
      return false;
    }
    return true;
  }
}
