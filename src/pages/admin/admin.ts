import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';

// PROVIDERS
import { DeceptaconService } from '../../providers/deceptacon-service/deceptacon-service';
import { AssetsService } from '../../providers/assets-service/assets-service';

@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html'
})
export class AdminPage {
  villagers: any = [];
  
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private deceptaconService: DeceptaconService,
    private assets: AssetsService
  ) {}
  
  ionViewWillEnter() {
    this.getVillagers();
  }
  
  getVillagers() {
    this.deceptaconService.getVillagers()
      .subscribe(data => {
        this.villagers = data;
      }, error => {
      
      });
  }
  
  toggleAdminRights(villager: any) {
    let txt = `Make ${villager.fullname} an admin?`;
    if (villager.isAdmin) {
      txt = `Revoke ${villager.fullname}'s admin rights?`;
    }
    this.showAlert(txt, () => {
      let loading = this.loadingCtrl.create({
        content: 'Updating...'
      });
      loading.present();
      let arr = {
        _id: villager._id,
        isAdmin: !villager.isAdmin,
        isMod: villager.isMod
      };
      this.deceptaconService.updateVillagerRights(arr)
        .subscribe(data => {
          this.updateVillagerList(data);
          loading.dismiss();
        }, error => {
          loading.dismiss();
        });
    });
  } 
  
  toggleModRights(villager: any) {
    let txt = `Make ${villager.fullname} a moderator?`;
    if (villager.isMod) {
      txt = `Revoke ${villager.fullname}'s mod rights?`;
    }
    this.showAlert(txt, () => {
      let loading = this.loadingCtrl.create({
        content: 'Updating...'
      });
      loading.present();
      let arr = {
        _id: villager._id,
        isAdmin: villager.isAdmin,
        isMod: !villager.isMod
      };
      this.deceptaconService.updateVillagerRights(arr)
        .subscribe(data => {
          this.updateVillagerList(data);
          loading.dismiss();
        }, error => {
          loading.dismiss();
        });
    });
  } 
  
  updateVillagerList(villager: any) {
    for (let i = 0; i < this.villagers.length; i++) {
      if (this.villagers[i]._id === villager._id) {
        this.villagers[i] = villager;
        break;
      }
    }
  }
  
  showAlert(txt: string, callback: Function) {
    let alert = this.alertCtrl.create({
      title: txt,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: () => {
            callback();
          }
        }
      ]
    });
    alert.present();
  }
}
