import { Component } from '@angular/core';
import { NavController, AlertController, 
         LoadingController, Events, ToastController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Storage } from '@ionic/storage';

// PROVIDERS
import { DeceptaconService } from '../../providers/deceptacon-service/deceptacon-service';
import { AssetsService } from '../../providers/assets-service/assets-service';

@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html'
})
export class AdminPage {
  user: any = {};
  villagers: any = [];
  
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private socket: Socket,
    private storage: Storage,
    private events: Events,
    private deceptaconService: DeceptaconService,
    private assets: AssetsService
  ) {}
  
  ionViewWillEnter() {
    this.storage.get('user').then(data => {
      if (data) {
        this.user = data;
      }
    });
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
    if (this.user.isAdmin) {
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
            this.sendSocketEvent(data);
            this.updateVillagerList(data);
            loading.dismiss();
          }, error => {
            loading.dismiss();
          });
      });
    } else {
      let toast = this.toastCtrl.create({
        message: 'You cannot change Admin rights',
        duration: 2000,
        position: 'top',
        showCloseButton: true,
        cssClass: 'error'
      });
      toast.present();
    }
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
          this.sendSocketEvent(data);
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
  
  sendSocketEvent(villager: any) {
    this.events.publish(`villager-rights-${villager._id}`, villager);
    this.socket.emit('com.deceptacon.event', {
      event: `villager-rights-${villager._id}`,
      data: villager
    });
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
