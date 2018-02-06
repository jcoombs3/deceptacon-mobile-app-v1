import { ViewChild, Component } from '@angular/core';
import { NavController, NavParams, 
         ModalController, ToastController } from 'ionic-angular';
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
  showRoles: boolean = true;
  loaded: boolean = false;
  
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
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
  
  getVillagerData() {
    this.deceptaconService.getVillager(this.villager._id)
      .subscribe(data => {
        this.villager = data;
        this.gameHistory = data.gameHistory ? data.gameHistory : [];
        console.log(this.gameHistory);
        this.loaded = true;
      }, error => {
      
      });
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
    console.log(this.villager);
    this.deceptaconService.saveVillager(this.villager)
      .subscribe(data => {
        console.log('success');
        this.storage.set('user', data);
        this.user = data;
        this.villager = data;
      }, error => {
      
      });
  }
  
  goToRoles() {
    this.showRoles = true;
  }
  
  goToGames() {
    this.showRoles = false;
  }
}
