import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, 
         Events, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Socket } from 'ng-socket-io';

// PAGES
import { GamePage } from '../game/game';

// PROVIDERS
import { DeceptaconService } from '../../providers/deceptacon-service/deceptacon-service';

// PIPES 
import { SortCircles } from '../../pipes/sort-circles';

@Component({
  selector: 'page-circles',
  providers: [
    SortCircles
  ],
  templateUrl: 'circles.html'
})
export class CirclesPage {
  circles: any = [];
  customs: any = [];
  villager: any = {};
  placeholderCircle: any = {
    _id: ''
  };
  selectedCircle: any = {
    _id: ''
  };
  isMod: boolean = false;
  inGame: boolean = false;
  
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private deceptaconService: DeceptaconService,
    private storage: Storage,
    private socket: Socket,
    private events: Events,
    private sortCirclesPipe: SortCircles
  ) { }
  
  ionViewWillEnter() {
    this.selectedCircle = this.placeholderCircle;
    this.storage.get('user').then(data => {
      if (data) {
        this.villager = data;
        this.getCircles(); 
      }
    });
  }
  
  ionViewWillLeave() {
    this.unsubscribeToEvents();
  }
  
  doRefresh(refresher) {
    this.unsubscribeToEvents();
    this.deceptaconService.getCircles().subscribe(data => {
      let circleGroups = this.sortCirclesPipe.transform(data);
      this.circles = circleGroups[0];
      this.customs = circleGroups[1];
      this.setEventListeners();
      this.checkIfMod();
      this.checkIfInGame();
      refresher.complete();
    }, error => {
      console.log('++ error');
      refresher.complete();
    });
  }
  
  getCircles() {
    this.unsubscribeToEvents();
    this.deceptaconService.getCircles().subscribe(data => {
      let circleGroups = this.sortCirclesPipe.transform(data);
      this.circles = circleGroups[0];
      this.customs = circleGroups[1];
      this.setEventListeners();
      this.checkIfMod();
      this.checkIfInGame();
    }, error => {
      console.log('++ error');
    });
  }
  
  selectCircle(circle: any) {
    this.selectedCircle = this.placeholderCircle;
    if (circle.moderator && circle.moderator._id === this.villager._id) {
      this.goToCircle(circle);
    } else if (circle.game || (this.villager.isMod && !this.isMod)) {
      this.selectedCircle = circle;
    }
  }
  
  setEventListeners() {
    const iThis = this;
    for (let i = 0; i < this.circles.length; i++) {
      this.socket.on(`circle-updated-${this.circles[i]._id}`, function(circle){
        console.log(circle);
        iThis.updateCircle(circle);
      });
    } 
    for (let j = 0; j < this.customs.length; j++) {
      this.socket.on(`circle-updated-${this.customs[j]._id}`, function(circle){
        iThis.updateCircle(circle);
      });
    } 
  }
  
  unsubscribeToEvents() {
    for (let i = 0; i < this.circles.length; i++) {
      this.socket.removeListener(`circle-updated-${this.circles[i]._id}`);
      this.socket.removeListener(`game-begin-${this.circles[i]._id}`);
      this.socket.removeListener(`game-ended-${this.circles[i]._id}`);
    } 
    for (let j = 0; j < this.customs.length; j++) {
      this.socket.removeListener(`circle-updated-${this.customs[j]._id}`);
      this.socket.removeListener(`game-begin-${this.customs[j]._id}`);
      this.socket.removeListener(`game-ended-${this.customs[j]._id}`);
    }
  }
  
  checkIfMod() {
    this.isMod = false;
    for (let i = 0; i < this.circles.length; i++) {
      if (this.villager._id === this.circles[i].moderator ||
        (this.circles[i].moderator && this.villager._id === this.circles[i].moderator._id)) {
        this.isMod = true;
      }
    }
  }
  
  checkIfInGame() {
    this.inGame = false;
    for (let i = 0; i < this.circles.length; i++) {
      if (this.circles[i].game) {
        let villagers = this.circles[i].game.villagers;
        for (let j = 0; j < villagers.length; j++) {
          if (this.villager._id === villagers[j]) {
            this.inGame = true;
          }
        }
      }
    }
  }
  
  moderate(circle: any) {
    let alert = this.alertCtrl.create({
      title: `Reserving ${circle.name}`,
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
            this.reserveCircle(circle);
          }
        }
      ]
    });
    alert.present();
  }
  
  reserveCircle(circle: any) {
    let arr = {
      villagerId: this.villager._id,
      circleId: circle._id
    };
    let loading = this.loadingCtrl.create({
      content: 'Reserving circle...'
    });
    loading.present();
    this.storage.get('token').then(token => {
      if (token) {
        this.deceptaconService.reserveCircle(arr, token)
          .subscribe(data => {
            loading.dismiss();
            let toast = this.toastCtrl.create({
              message: `${data.name} reserved`,
              duration: 2000,
              position: 'top'
            });
            toast.present();
            data.moderator = this.villager;
            this.socket.emit('com.deceptacon.event', {
              event: `circle-updated-${data._id}`,
              data: data
            });
            this.goToCircle(data);
        }, error => {
          let toast = this.toastCtrl.create({
            message: error,
            duration: 3000,
            position: 'top',
            showCloseButton: true,
            cssClass: 'error'
          });
          toast.present();
          loading.dismiss();
        });
      } else {
        let toast = this.toastCtrl.create({
          message: "There was an error reserving the circle. Please try again.",
          duration: 3000,
          position: 'top',
          showCloseButton: true,
          cssClass: 'error'
        });
        toast.present();
        loading.dismiss();
      }
    });
  }
  
  joinGame(circle: any) {
    let alert = this.alertCtrl.create({
      title: `Joining ${circle.name}`,
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
            this.doJoinGame(circle);
          }
        }
      ]
    });
    alert.present();
  }
  
  doJoinGame(circle: any) {
    let arr = {
      villagerId: this.villager._id,
      gameId: circle.game._id
    };
    let loading = this.loadingCtrl.create({
      content: 'Joining circle...'
    });
    this.storage.get('token').then(token => {
      if (token) {
        this.deceptaconService.joinGame(arr, token)
          .subscribe(data => {
            loading.dismiss();
            let toast = this.toastCtrl.create({
              message: `${data.name} joined`,
              duration: 2000,
              position: 'top'
            });
            toast.present();
            this.events.publish('user:joinedgame', arr.gameId);
            this.socket.emit('com.deceptacon.event', {
              event: `villager-joined-${data._id}`,
              data: this.villager
            });
            this.goToCircle(data);
        }, error => {
          let toast = this.toastCtrl.create({
            message: error,
            duration: 3000,
            position: 'top',
            showCloseButton: true,
            cssClass: 'error'
          });
          toast.present();
          loading.dismiss();
        });  
      } else {
        let toast = this.toastCtrl.create({
          message: "There was an issue joining the game. Please try again",
          duration: 3000,
          position: 'top',
          showCloseButton: true,
          cssClass: 'error'
        });
        toast.present();
        loading.dismiss();
      }
    });
  }
  
  updateCircle(iCircle: any) {
    for (let i = 0; i < this.circles.length; i++) {
      if (this.circles[i]._id === iCircle._id) {
        this.circles[i] = iCircle;
      }
    }
    for (let j = 0; j < this.customs.length; j++) {
      if (this.customs[j]._id === iCircle._id) {
        this.customs[j] = iCircle;
      }
    }
  }
  
  goToCircle(circle: any) {
    this.navCtrl.push(GamePage, circle);
  }
}
