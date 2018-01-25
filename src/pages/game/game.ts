import { Component } from '@angular/core';
import { NavController, NavParams, Events, AlertController } from 'ionic-angular';
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
  otherVillagers: any = [];
  isMod: boolean = false;
  inGame: boolean = false;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
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
        
        this.checkIfInGame();
      }, error => {
        console.log('++ error');
      });
    }
  }
  
  checkIfMod() {
    if (this.villager._id === this.circle.moderator._id || 
        this.villager._id === this.circle.moderator) {
      this.isMod = true;
    }
  }
  
  checkIfInGame() {
    let villagers = this.circle.game.villagers;
    for (let i = 0; i < villagers.length; i++) {
      if (this.villager._id === villagers[i]._id) {
        this.inGame = true;
      } else {
        this.otherVillagers.push(villagers[i]);
      }
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
  
  leaveGame(villager: any) {
    this.showKickAlert(`Leaving ${this.circle.name}`, villager);
  }
  
  kickVillager(villager: any) {
    this.showKickAlert(`Kick ${villager.fullname}`, villager);
  }
  
  showKickAlert(title: String, villager: any) {
    let alert = this.alertCtrl.create({
      title: title,
      message: `Are you sure?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: () => {
            this.removeVillager(villager);
          }
        }
      ]
    });
    alert.present();
  }
  
  removeVillager(villager: any) {
    let arr = {
      villagerId: villager._id,
      gameId: this.circle.game._id
    };
    
    this.deceptaconService.removeVillager(arr)
      .subscribe(data => {
        this.circle = data;
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
