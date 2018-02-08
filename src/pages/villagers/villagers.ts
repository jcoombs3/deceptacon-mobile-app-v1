import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// PAGES
import { ProfilePage } from '../profile/profile';

// PROVIDERS
import { DeceptaconService } from '../../providers/deceptacon-service/deceptacon-service';

// PIPES
import { SortVillagers } from '../../pipes/sort-villagers';

@Component({
  selector: 'page-villagers',
  providers: [ SortVillagers ],
  templateUrl: 'villagers.html'
})
export class VillagersPage {
  user: any = {};
  fullVillagers: any = null;
  villagers: any = null;
  search: string = '';
  
  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private deceptaconService: DeceptaconService,
    private sortVillagersPipe: SortVillagers
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
        this.fullVillagers = data;
        this.setVillagers(this.fullVillagers);
      }, error => {
      
      });
  }
  
  setVillagers(villagers: any) {
    this.villagers = villagers;
  }
  
  searchVillagers(value) {
    this.search = value;
    const filteredVillagers = this.sortVillagersPipe.transform(this.fullVillagers, this.search);
    this.setVillagers(filteredVillagers);
  }
  
  goToProfile(villager: any) {
    this.navCtrl.push(ProfilePage, villager);
  }
}
