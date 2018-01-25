import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Socket } from 'ng-socket-io';

// PAGES
import { ProfilePage } from '../profile/profile';

// PROVIDERS
import { DeceptaconService } from '../../providers/deceptacon-service/deceptacon-service';

@Component({
  selector: 'page-game',
  templateUrl: 'game.html'
})
export class GamePage {
  circle: any = {};
  villager: any = {};
  isMod: boolean = false;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private deceptaconService: DeceptaconService,
    private storage: Storage,
    private socket: Socket,
    private events: Events
  ) { 
    this.circle = this.navParams.data;
    this.getGame();
    this.storage.get('user').then(data => {
      if (data) {
        this.villager = data;
        this.checkIfMod();
      }
    });
    this.setEventListeners();
  }
  
  setEventListeners() {
    const iThis = this;
    this.socket.on(`circle-updated-${this.circle._id}`, function(circle){
      iThis.circle = circle;
    });
    this.socket.on(`villager-joined-${this.circle._id}`, function(villager) {
      iThis.circle.game.villagers.push(villager);
      iThis.events.publish(`circle-updated-${iThis.circle._id}`, iThis.circle);
    });
  }
  
  getGame() {
    if (this.circle.game) {
      this.deceptaconService.getGame(this.circle.game._id).subscribe(data => {
        this.circle.game = data;
      }, error => {
        console.log('++ error');
      });
    }
  }
  
  checkIfMod() {
    if (this.villager._id === this.circle.moderator ||
        this.villager._id === this.circle.moderator._id) {
      this.isMod = true;
    }
  }
  
  createGame() {
    let arr = {
      villagerId: this.villager._id,
      circleId: this.circle._id,
      game: {
        seats: 14
      }
    };
    this.deceptaconService.createGame(arr)
      .subscribe(data => {
      this.circle = data;
      this.events.publish('user:creategame');
      this.socket.emit('com.deceptacon.event', {
        event: `circle-updated-${data._id}`,
        data: data
      });
    }, error => {
      console.log('++ error');
    });
  }
  
  removeVillager(villager: any) {
    let arr = {
      villagerId: villager._id,
      gameId: this.circle.game._id
    }
    this.deceptaconService.removeVillager(arr)
      .subscribe(data => {
      this.circle = data;
      console.log(`circle-updated-${data._id}`);
      this.socket.emit('com.deceptacon.event', {
        event: `circle-updated-${data._id}`,
        data: data
      });
      this.socket.emit('com.deceptacon.event', {
        event: `villager-removed-${arr.villagerId}`,
        data: null
      });
    }, error => {
      console.log('++ error');
    });
  }
  
  addPlaceholder() {
    console.log('++ addPlaceholder');
  }
  
  beginGame() {
    let arr = {
      gameId: this.circle.game._id
    };
    this.deceptaconService.beginGame(arr)
      .subscribe(data => {
      this.circle.game = data;
      this.socket.emit('com.deceptacon.event', {
        event: `circle-updated-${data._id}`,
        data: this.circle
      });
    }, error => {
      console.log('++ error');
    });
  }
  
  endGame() {
    let arr = {
      gameId: this.circle.game._id
    };
    console.log('++ endGame');
    this.deceptaconService.endGame(arr)
      .subscribe(data => {
      console.log('++ game has ended');
    }, error => {
      console.log('++ error');
    });
  }
  
  cancelGame() {
    let arr = {
      gameId: this.circle.game._id
    };
    console.log('++ cancelGame');
    this.deceptaconService.cancelGame(arr)
      .subscribe(data => {
      console.log('++ game has been cancelled');
    }, error => {
      console.log('++ error');
    });
  }
  
  goToProfile(villager: any) {
    this.navCtrl.push(ProfilePage, villager);
  }
}
