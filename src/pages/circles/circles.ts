import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Socket } from 'ng-socket-io';

// PAGES
import { GamePage } from '../game/game';

// PROVIDERS
import { DeceptaconService } from '../../providers/deceptacon-service/deceptacon-service';

@Component({
  selector: 'page-circles',
  templateUrl: 'circles.html'
})
export class CirclesPage {
  circles: any = [];
  villager: any = {};
  isMod: boolean = false;
  inGame: boolean = false;
  
  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private deceptaconService: DeceptaconService,
    private storage: Storage,
    private socket: Socket,
    private events: Events,
  ) { 
    this.storage.get('user').then(data => {
      if (data) {
        this.villager = data;
        this.getCircles(); 
      }
    });
  }
  
  getCircles() {
    this.deceptaconService.getCircles().subscribe(data => {
      this.circles = data;
      this.setEventListeners();
      this.checkIfMod();
      this.checkIfInGame();
    }, error => {
      console.log('++ error');
    });
  }
  
  setEventListeners() {
    const iThis = this;
    for (let i = 0; i < this.circles.length; i++) {
      this.socket.on(`circle-updated-${this.circles[i]._id}`, function(circle){
        iThis.updateCircle(circle);
      });
    } 
  }
  
  checkIfMod() {
    for (let i = 0; i < this.circles.length; i++) {
      if (this.villager._id === this.circles[i].moderator ||
        (this.circles[i].moderator && this.villager._id === this.circles[i].moderator._id)) {
        this.isMod = true;
      }
    }
  }
  
  checkIfInGame() {
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
    let arr = {
      villagerId: this.villager._id,
      circleId: circle._id
    };
    let loading = this.loadingCtrl.create({
      content: 'Reserving circle...'
    });
    loading.present();
    this.deceptaconService.reserveCircle(arr)
      .subscribe(data => {
        loading.dismiss();
        let toast = this.toastCtrl.create({
          message: `${data.name} reserved`,
          duration: 2000,
          position: 'top'
        });
        toast.present();
        this.updateCircle(data);
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
  }
  
  joinGame(circle: any) {
    let arr = {
      villagerId: this.villager._id,
      gameId: circle.game._id
    };
    let loading = this.loadingCtrl.create({
      content: 'Joining circle...'
    });
    this.deceptaconService.joinGame(arr)
      .subscribe(data => {
        loading.dismiss();
        let toast = this.toastCtrl.create({
          message: `${data.name} joined`,
          duration: 2000,
          position: 'top'
        });
        toast.present();
        this.updateCircle(data);
        this.events.publish('user:joinedgame');
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
  }
  
  updateCircle(iCircle: any) {
    for (let i = 0; i < this.circles.length; i++) {
      if (this.circles[i]._id === iCircle._id) {
        this.circles[i] = iCircle;
      }
    }
  }
  
  goToCircle(circle: any) {
    this.navCtrl.push(GamePage, circle);
  }
}
