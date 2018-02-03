import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// PAGES
import { ProfilePage } from '../profile/profile';

// PROVIDERS
import { DeceptaconService } from '../../providers/deceptacon-service/deceptacon-service';

@Component({
  selector: 'page-villagers',
  templateUrl: 'villagers.html'
})
export class VillagersPage {
  user: any = {};
  villagers: any = [];
  
  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private deceptaconService: DeceptaconService
  ) {
    this.storage.get('user').then(data => {
      if (data) {
        this.user = data;
      }
    });
  }
  
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
  
  goToProfile(villager: any) {
    this.navCtrl.push(ProfilePage, villager);
  }
}
