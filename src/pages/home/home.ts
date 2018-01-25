import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// PAGES
import { CirclesPage } from '../circles/circles';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {}
  
  goToCircles() {
    this.navCtrl.push(CirclesPage);
  }

}
