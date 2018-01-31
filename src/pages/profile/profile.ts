import { ViewChild, Component } from '@angular/core';
import { NavController, NavParams, ModalController, Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// MODALS
import { ChangeProfilePicModal } from '../../modals/change-profile-pic/change-profile-pic';

// PROVIDERS
import { DeceptaconService } from '../../providers/deceptacon-service/deceptacon-service';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  user: any = {};
  villager: any = {};
  gameHistory: any = [];
  @ViewChild(Slides) slides: Slides;
  
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private navParams: NavParams,
    private storage: Storage,
    private deceptaconService: DeceptaconService
  ) {
    this.villager = this.navParams.data;
    this.getVillagerData();
    this.storage.get('user').then(data => {
      if (data) {
        this.user = data;
      }
    });
  }
  
  ionViewDidLoad() {
    this.slides.lockSwipes(true); 
  }
  
  getVillagerData() {
    this.deceptaconService.getVillager(this.villager._id)
      .subscribe(data => {
        this.villager = data;
        this.gameHistory = data.gameHistory ? data.gameHistory : [];
      }, error => {
      
      });
  }
  
  goToRoles() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }
  
  goToTimestamp() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }
  
  goToFriends() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(2);
    this.slides.lockSwipes(true);
  }
  
  editProfilePic() {
    if (this.user._id === this.villager._id) {
      const changeProfilePicModal = this.modalCtrl.create(ChangeProfilePicModal, this.villager);
      changeProfilePicModal.onWillDismiss(data => {
        if (data) {
          this.villager.color = data.color;
          this.villager.picture = data.picture;
          this.saveProfile();
        }
      });
      changeProfilePicModal.present();
    }
  }
  
  saveProfile() {
    this.deceptaconService.saveVillager(this.villager)
      .subscribe(data => {
        this.storage.set('user', data);
        this.user = data;
        this.villager = data;
      }, error => {
      
      });
  }
}
