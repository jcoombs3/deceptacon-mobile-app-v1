import { Component } from '@angular/core';
import { NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Socket } from 'ng-socket-io';
import { NgForm } from '@angular/forms';

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
  seats: any;
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
  }
  
  ionViewWillEnter() {
    this.storage.get('user').then(data => {
      if (data) {
        this.villager = data;
        this.checkIfMod();
      }
    });
    this.unsubscribeToEvents();
    this.getGame();
    this.setEventListeners();
  }
  
  ionViewWillLeave() {
    this.unsubscribeToEvents();
  }
  
  doRefresh(refresher) {
    if (this.circle.game) {
      this.deceptaconService.getGame(this.circle.game._id).subscribe(data => {
        this.circle.game = data;
        this.checkIfInGame();
        refresher.complete();
      }, error => {
        console.log('++ error');
      });
    } else {
      refresher.complete();
    }
  }
  
  setEventListeners() {
    const iThis = this;
    this.events.subscribe(`circle-updated-${this.circle._id}`, function(circle) {
      iThis.circle = circle;
      if (iThis.circle.game) {
        iThis.checkIfInGame();
      }
    });
    this.socket.on(`circle-updated-${this.circle._id}`, function(circle) {
      iThis.circle = circle;
      if (iThis.circle.game) {
        iThis.checkIfInGame();
      }
    });
    this.socket.on(`villager-joined-${this.circle._id}`, function(villager) {
      iThis.circle.game.villagers.push(villager);
      iThis.events.publish(`circle-updated-${iThis.circle._id}`, iThis.circle);
    });
  }
  
  unsubscribeToEvents() {
    this.events.unsubscribe(`circle-updated-${this.circle._id}`);
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
    let villagerArray = [];
    let villagers = this.circle.game.villagers;
    for (let i = 0; i < villagers.length; i++) {
      if (this.villager._id === villagers[i]._id) {
        this.inGame = true;
      } else {
        villagerArray.push(villagers[i]);
      }
    }
    this.otherVillagers = villagerArray;
  }
  
  onSubmit(f: NgForm) {
    if (f.valid) {
      this.seats = f.value.seats;
      this.createGame();
    }
  }
  
  createGame() {
    if (!this.seats) {
      this.seats = 20;
    }
    this.showAlert(`Create game with ${this.seats}?`, () => {
      let arr = {
        villagerId: this.villager._id,
        circleId: this.circle._id,
        game: {
          seats: this.seats
        }
      };
      this.storage.get('token').then(token => {
        if (token) {
          this.deceptaconService.createGame(arr, token)
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
      });
    }); 
  }
  
  addPlaceholder() {
    let arr = {
      modId: this.villager._id,
      gameId: this.circle.game._id
    };
    this.storage.get('token').then(token => {
      if (token) {
        this.deceptaconService.addPlaceholder(arr, token)
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
    });
  }
  
  changeSeats() {
    let alert = this.alertCtrl.create({
      title: 'New Seat #',
      inputs: [{
        name: 'seats',
        placeholder: this.seats,
        type: 'number'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: data => {}
      }, {
        text: 'Update',
        handler: data => {
          const game = this.circle.game;
          if (parseInt(data.seats) < parseInt(game.villagers.length) + parseInt(game.placeholders.length) || parseInt(data.seats) === 0) {
          } else {
            this.updateGameDetails(game, data.seats);
          }
        }
      }]
    });
    alert.present();
  }
  
  updateGameDetails(game: any, seats: Number) {
    let arr = {
      modId: this.villager._id,
      gameId: game._id,
      seats: seats
    };
    this.storage.get('token').then(token => {
      if (token) {
        this.deceptaconService.updateGameDetails(arr, token)
          .subscribe(data => {
            this.circle.game = data;
            this.checkIfInGame();
            this.socket.emit('com.deceptacon.event', {
              event: `circle-updated-${this.circle._id}`,
              data: this.circle
            });
          }, error => {
            console.log('++ error');
          });
      }
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
      gameId: this.circle.game._id,
      userId: this.villager._id
    };
    this.storage.get('token').then(token => {
      if (token) {
        this.deceptaconService.removeVillager(arr, token)
          .subscribe(data => {
            this.circle = data;
            this.checkIfInGame();
            this.socket.emit('com.deceptacon.event', {
              event: `circle-updated-${data._id}`,
              data: data
            });
            this.socket.emit('com.deceptacon.event', {
              event: `villager-removed-${villager._id}`,
              data: data
            });
            this.events.publish(`villager-removed-${villager._id}`, data);
          }, error => {
            console.log('++ error');
          });
      }
    });  
  }
  
  removePlaceholder() {
    let arr = {
      modId: this.villager._id,
      gameId: this.circle.game._id
    };
    this.storage.get('token').then(token => {
      if (token) {
        this.deceptaconService.removePlaceholder(arr, token)
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
    });  
  }
  
  beginGame() {
    this.showAlert('Start game?', () => {
      let arr = {
        gameId: this.circle.game._id,
        modId: this.villager._id
      };
      this.storage.get('token').then(token => {
        if (token) {
          this.deceptaconService.beginGame(arr, token)
            .subscribe(data => {
            this.circle.game = data;
            this.socket.emit('com.deceptacon.event', {
              event: `game-begin-${data._id}`,
              data: this.circle
            });
            this.socket.emit('com.deceptacon.event', {
              event: `circle-updated-${this.circle._id}`,
              data: this.circle
            });
          }, error => {
            console.log('++ error');
          });
        }
      });
    }); 
  }
  
  endGame() {
    this.showAlert('End game?', () => {
      let arr = {
        gameId: this.circle.game._id,
        modId: this.villager._id
      };
      this.storage.get('token').then(token => {
        if (token) {
          this.deceptaconService.endGame(arr, token)
            .subscribe(data => {
            this.events.publish('user:endedgame', data._id)
            this.socket.emit('com.deceptacon.event', {
              event: `game-ended-${data._id}`,
              data: this.circle
            });
            this.circle.moderator = null;
            this.circle.game = null;
            this.socket.emit('com.deceptacon.event', {
              event: `circle-updated-${this.circle._id}`,
              data: this.circle
            });
          }, error => {
            console.log('++ error');
          });
        }
      }); 
    });  
  }
  
  cancelGame() {
    this.showAlert('Cancel game?', () => {
      let arr = {
        gameId: this.circle.game._id,
        modId: this.villager._id
      };
      this.storage.get('token').then(token => {
        if (token) {
          this.deceptaconService.cancelGame(arr, token)
            .subscribe(data => {
            this.events.publish('user:cancelledgame', data._id)
            this.socket.emit('com.deceptacon.event', {
              event: `game-cancelled-${data._id}`,
              data: this.circle
            });
            this.circle.moderator = null;
            this.circle.game = null;
            this.socket.emit('com.deceptacon.event', {
              event: `circle-updated-${this.circle._id}`,
              data: this.circle
            });
          }, error => {
            console.log('++ error');
          });
        }
      }); 
    }); 
  }
  
  goToProfile(villager: any) {
    this.navCtrl.push(ProfilePage, villager);
  }
}
