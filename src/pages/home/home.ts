import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// PAGES
import { CirclesPage } from '../circles/circles';
import { LoginPage } from '../login/login';

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
  ) {
    this.storage.get('user').then(data => {
      if (data) {
        this.villager = data;
      }
    });  
  }
  
  goToCircles() {
    this.navCtrl.push(CirclesPage);
  }
  
  logout() {
    this.storage.set('user', null);
    this.events.publish('user:loggedout', null);
    this.navCtrl.setRoot(LoginPage);
  }

}
