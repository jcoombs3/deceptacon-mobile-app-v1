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
  isConstructed: boolean = false;
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
    this.storage.get('user').then(data => {
      if (data) {
        this.villager = data;
        this.checkIfMod();
      }
    });
    this.circle = this.navParams.data;
    this.getGame();
    this.setEventListeners();
    this.isConstructed = true;
  }
  
  ionViewWillEnter() {
    if (this.isConstructed) {
      this.getGame();
      this.setEventListeners();
    }
  }
  
  ionViewWillLeave() {
    this.unsubscribeToEvents();
  }
  
  setEventListeners() {
    const iThis = this;
    this.socket.on(`circle-updated-${this.circle._id}`, function(circle){
      iThis.circle = circle;
    });
    this.socket.on(`villager-joined-${this.circle._id}`, function(villager) {
      //iThis.circle.game.villagers.push(villager);
      iThis.getGame();
      //iThis.events.publish(`circle-updated-${iThis.circle._id}`, iThis.circle);
    });
  }
  
  unsubscribeToEvents() {
    this.socket.removeListener(`circle-updated-${this.circle._id}`);
    this.socket.removeListener(`villager-joined-${this.circle._id}`);
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
    if (this.circle.moderator && this.circle.moderator._id) {
      if (this.villager._id === this.circle.moderator._id) {
        this.isMod = true;
      }
    } else if (this.circle.moderator) {
      if (this.villager._id === this.circle.moderator) {
        this.isMod = true;
      }
    }
  }
  
  checkIfInGame() {
    let villagerArray = this.otherVillagers;
    let villagers = this.circle.game.villagers;
    if (villagerArray.length !== villagers.length) {
      villagerArray = [];
      for (let i = 0; i < villagers.length; i++) {
        if (this.villager._id === villagers[i]._id) {
          this.inGame = true;
        } else {
          villagerArray.push(villagers[i]);
          
        }
      }
    }
    this.otherVillagers = villagerArray;
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
      this.circle.moderator = this.villager;
      this.circle.game.moderator = this.villager;
      this.events.publish('user:creategame');
      this.socket.emit('com.deceptacon.event', {
        event: `circle-updated-${data._id}`,
        data: data
      });
    }, error => {
      console.log('++ error');
    });
  }
  
  addPlaceholder() {
    let arr = {
      modId: this.villager._id,
      gameId: this.circle.game._id
    };
    this.deceptaconService.addPlaceholder(arr)
      .subscribe(data => {
      this.circle = data;
      this.circle.moderator = this.villager;
      this.circle.game.moderator = this.villager;
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
  
  showKickAlert(txt: string, villager: any) {
    let alert = this.alertCtrl.create({
      title: txt,
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
        this.circle.moderator = this.villager;
        this.circle.game.moderator = this.villager;
        this.checkIfInGame();
        this.socket.emit('com.deceptacon.event', {
          event: `circle-updated-${data._id}`,
          data: data
        });
        this.socket.emit('com.deceptacon.event', {
          event: `villager-removed-${villager._id}`,
          data: data
        });
      }, error => {
        console.log('++ error');
      });
  }
  
  removePlaceholder() {
    let arr = {
      modId: this.villager._id,
      gameId: this.circle.game._id
    };
    this.deceptaconService.removePlaceholder(arr)
      .subscribe(data => {
        this.circle = data;
        this.circle.moderator = this.villager;
        this.circle.game.moderator = this.villager;
        this.socket.emit('com.deceptacon.event', {
          event: `circle-updated-${data._id}`,
          data: data
        });
      }, error => {
        console.log('++ error');
      });
  }
  
  beginGame() {
    this.showAlert('Start game?', () => {
      let arr = {
        gameId: this.circle.game._id
      };
      this.deceptaconService.beginGame(arr)
        .subscribe(data => {
        this.circle.game = data;
        this.socket.emit('com.deceptacon.event', {
          event: `game-begin-${data._id}`,
          data: this.circle
        });
        this.socket.emit('com.deceptacon.event', {
          event: `circle-updated-${data._id}`,
          data: this.circle
        });
      }, error => {
        console.log('++ error');
      });
    }); 
  }
  
  endGame() {
    this.showAlert('End game?', () => {
      let arr = {
        gameId: this.circle.game._id
      };
      this.deceptaconService.endGame(arr)
        .subscribe(data => {
        this.socket.emit('com.deceptacon.event', {
          event: `game-ended-${data._id}`,
          data: this.circle
        });
      }, error => {
        console.log('++ error');
      });
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
