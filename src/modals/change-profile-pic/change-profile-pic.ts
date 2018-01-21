import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

// COMPONENTS
import { ProfilePic } from '../../components/profile-pic/profile-pic';

// PROVIDERS
import { AssetsService } from '../../providers/assets-service/assets-service';

@Component({
  selector: 'modal-change-profile-pic',
  templateUrl: 'change-profile-pic.html',
  providers: [ AssetsService ]
})
export class ChangeProfilePicModal {
  color: any;
  picture: any;
  anim: boolean = false;
  
  constructor(public viewCtrl: ViewController, private navParams: NavParams, private assets: AssetsService) {
    this.color = navParams.get('color');
    this.picture = navParams.get('picture');
  }
  
  ionViewDidEnter() {
    this.anim = true;
  }
  
  updatePicture(pic: string) {
    this.picture = pic;
  }
  
  updateColor(color: string) {
    this.color = color;
  }
  
  closeModal() {
    this.cancel();
  }
  
  cancel() {
    this.viewCtrl.dismiss();
  }
  
  save() {
    this.viewCtrl.dismiss(this);
  } 
}
