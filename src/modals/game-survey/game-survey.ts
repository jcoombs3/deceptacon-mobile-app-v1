import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

// PROVIDERS
import { DeceptaconService } from '../../providers/deceptacon-service/deceptacon-service';

@Component({
  selector: 'modal-game-survey',
  templateUrl: 'game-survey.html',
  providers: [ DeceptaconService ]
})
export class GameSurveyModal {
  alignment: any;
  role: any;
  
  constructor(
    public viewCtrl: ViewController,
    private deceptaconService: DeceptaconService
  ) { }
  
  closeModal() {
    this.viewCtrl.dismiss();
  }
  
  publishRole() {
    console.log(this.alignment);
    console.log(this.role);
  }
}
