import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// PAGES
import { CirclesPage } from '../circles/circles';
import { LoginPage } from '../login/login';
import { VillagersPage } from '../villagers/villagers';
import { AdminPage } from '../admin/admin';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  villager: any = {};

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private events: Events
  ) {}
  
  ionViewWillEnter() {
    this.storage.get('user').then(data => {
      if (data) {
        console.log(data);
        this.villager = data;
      }
    }); 
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
  
  logout() {
    this.storage.set('user', null);
    this.storage.set('security', null);
    this.events.publish('user:loggedout', null);
    this.navCtrl.setRoot(LoginPage);
  }

}
