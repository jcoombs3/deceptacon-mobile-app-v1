import { Component } from '@angular/core';
import { NavController, Events, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// PAGES
import { CirclesPage } from '../circles/circles';
import { LoginPage } from '../login/login';
import { VillagersPage } from '../villagers/villagers';
import { AdminPage } from '../admin/admin';
import { GamePage } from '../game/game';

// PROVIDERS
import { AssetsService } from '../../providers/assets-service/assets-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  villager: any = {};
  pictures: any = ["BodyGuard.png", "CultLeader.png", "Cupid.png", "CultLeader.png", "Drunk.png", "FrankensteinMonster.png", "Huntress.png", "Lycan.png", "Seer.png", "Sorcerer.png", "ToughGuy.png", "Vampire.png", "VillagerF.png", "VillagerM.png", "Werewolf.png", "Witch.png", "WolfCub.png"]
  selectedPictures: any = [];
  forceKick: boolean = false;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private storage: Storage,
    private events: Events,
    private assets: AssetsService,
  ) {}
  
  ionViewWillEnter() {
    this.storage.get('user').then(data => {
      if (data) {
        this.villager = data;
        this.addEventListeners();
      }
    }); 
    this.getVillagerPictures();
  }
  
  ionViewDidLeave() {
    this.forceKick = false;
  }
  
  addEventListeners() {
    this.events.subscribe(`villager-removed-${this.villager._id}`, (data) => {
      this.forceKick = true;
    });
  }
  
  doRefresh(refresher) {
    this.forceKick = false;
    this.storage.get('user').then(data => {
      if (data) {
        this.villager = data;
      }
      refresher.complete();
    }); 
  }
  
  getVillagerPictures() {
    let randoms = [];
    for (let i = 0; i < 4; i++) {
      let pic = this.pictures[
        Math.floor((Math.random() * this.pictures.length - 1) + 1)
      ];
      let newPic = true;
      for (let j = 0; j < this.selectedPictures.length; j++) {
        if (pic === this.selectedPictures[j]) {
          newPic = false;
        }
      }
      if (!newPic) {
        i--;
      } else {
        this.selectedPictures[i] = pic;
      }
    }
  }
  
  goToCircles() {
    this.navCtrl.push(CirclesPage);
  }
  
  goToVillagers() {
    this.navCtrl.push(VillagersPage);
  }
  
  goToAdmin() {
    this.navCtrl.push(AdminPage);
  }
  
  goToCurrentGame() {
    this.navCtrl.push(GamePage, this.villager.currentGame);
  }
  
  logout() {
    let alert = this.alertCtrl.create({
      title: 'Log Out. Are you sure?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: () => {
            this.storage.set('user', null);
            this.storage.set('token', null);
            this.storage.set('security', null);
            this.events.publish('user:loggedout', null);
            this.navCtrl.setRoot(LoginPage);
          }
        }
      ]
    });
    alert.present(); 
  }
}
