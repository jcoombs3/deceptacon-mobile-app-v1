import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Storage } from '@ionic/storage';

// PAGES
import { ProfilePage } from '../../pages/profile/profile';
import { GamePage } from '../../pages/game/game';

// PROVIDERS
import { DeceptaconService } from '../../providers/deceptacon-service/deceptacon-service';
import { AssetsService } from '../../providers/assets-service/assets-service';

@Component({
  selector: 'deceptacon-footer',
  providers: [ DeceptaconService, AssetsService ],
  templateUrl: 'deceptacon-footer.html'
})
export class DeceptaconFooter {
  @Input() nav: any;
  user: any = null;
  
  constructor(
    private assets: AssetsService, 
    private deceptaconService: DeceptaconService, 
    private events: Events,
    private socket: Socket,
    private storage: Storage
  ) {
    this.addEventListeners();
  }
  
  addEventListeners() {
    this.events.subscribe('user:authenticated', (user) => {
      console.log('event: user:authenticated', 'DeceptaconFooter');
      this.user = user;
      this.addDynamicListeners();
    });
    this.events.subscribe('user:creategame', () => {
      console.log('event: user:creategame', 'DeceptaconFooter');
      this.getUser();
    });
    this.events.subscribe('user:joinedgame', (gameId) => {
      console.log('event: user:joinedgame', 'DeceptaconFooter');
      this.getUser();
    });
    this.events.subscribe('user:loggedout', (user) => {
      console.log('event: user:loggedout', 'DeceptaconFooter');
      this.user = user;
    });
  }
  
  addDynamicListeners() {
    console.log('addDynamicListeners');
    if (this.user.currentGame) {
      this.socket.on(`villager-removed-${this.user._id}`, (data) => {
        console.log('event: villager:removed', 'DeceptaconFooter');
        this.getUser();
      });
    }
  }
  
  goToHome() {
    this.nav.popToRoot();
  }
  
  goToProfile() {
    let active = this.nav.last().instance instanceof ProfilePage;
    if (!active) {
      this.nav.push(ProfilePage, this.user);
    } 
  }
  
  goToCurrentGame() {
    let active = this.nav.last().instance instanceof GamePage;
    if (!active) {
      this.nav.push(GamePage, this.user.currentGame);
    } 
  }
  
  getUser() {
    this.deceptaconService.getVillager(this.user._id)
    .subscribe(data => {
      this.storage.set('user', data);
      this.user = data;
      this.addDynamicListeners();
    }, error => {
      console.log('++ error');
    });
  }
}