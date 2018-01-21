import { Component } from '@angular/core';
import { ViewController, NavParams, ToastController } from 'ionic-angular';

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
  
  constructor(
    public viewCtrl: ViewController, 
    private navParams: NavParams, 
    private assets: AssetsService,
    private toastCtrl: ToastController
  ) {
    this.color = navParams.get('color');
    this.picture = navParams.get('picture');
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
    let toast = this.toastCtrl.create({
      message: 'Profile Updated',
      duration: 2000,
      position: 'top',
      showCloseButton: true
    });
    toast.present();
    this.viewCtrl.dismiss(this);
  } 
}
