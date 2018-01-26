import { Component, Input } from '@angular/core';
import { Events, ModalController, ToastController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Storage } from '@ionic/storage';

// PAGES
import { ProfilePage } from '../../pages/profile/profile';
import { GamePage } from '../../pages/game/game';

// PAGES
import { GameSurveyModal } from '../../modals/game-survey/game-survey';

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
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
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
      this.checkForSurvey(false);
      this.unsubscribeEvents(this.user);
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
    this.events.subscribe('user:published', (user) => {
      console.log('event: user:published', 'DeceptaconFooter');
      this.getUser();
    });
    this.events.subscribe('user:loggedout', (user) => {
      console.log('event: user:loggedout', 'DeceptaconFooter');
      this.socket.removeAllListeners();
      this.user = user;
    });
  }
  
  unsubscribeEvents(user: any) {
    this.socket.removeListener(`villager-removed-${user._id}`);
    if (this.user.currentGame) {
      this.socket.removeListener(`game-begin-${this.user.currentGame._id}`);
      this.socket.removeListener(`game-ended-${this.user.currentGame._id}`);
    }
  }
  
  addDynamicListeners() {
    this.socket.on(`villager-removed-${this.user._id}`, (data) => {
      console.log('event: villager:removed', 'DeceptaconFooter');
      this.showToast(`You have been removed from ${this.user.currentGame.name}`, 'error');
      let active = this.nav.last().instance instanceof GamePage;
      if (active) {
        this.nav.popToRoot();
      } 
      this.getUser();
    });
    if (this.user.currentGame) {
      let game = this.user.currentGame.game;
      this.socket.on(`game-begin-${game._id}`, (data) => {
        console.log('event: game:begin', 'DeceptaconFooter');
        this.showToast(`${this.user.currentGame.name}'s game has started`, '');
        let active = this.nav.last().instance instanceof GamePage;
        if (!active) {
          this.goToCurrentGame();
        } 
      });
      this.socket.on(`game-ended-${game._id}`, (data) => {
        console.log('event: game:ended', 'DeceptaconFooter');
        this.showToast(`${this.user.currentGame.name}'s game has ended`, 'error');
        let active = this.nav.last().instance instanceof GamePage;
        if (active) {
          this.goToHome();
        } 
        this.checkForSurvey(true);
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
      this.unsubscribeEvents(this.user);
      this.addDynamicListeners();
    }, error => {
      console.log('++ error');
    });
  }
  
  showToast(txt: string, type: string) {
    let toast = this.toastCtrl.create({
      message: txt,
      duration: 3000,
      position: 'top',
      showCloseButton: true,
      cssClass: type
    });
    toast.present();
  }
  
  checkForSurvey(isActive: boolean) {
    if (isActive && this.user.currentGame) {
      if (this.user._id !== this.user.currentGame.moderator) {
        this.goToSurvey();
      } else {
        this.getUser();
      }
    } else if (!isActive && this.user.currentGame) {
      let status = this.user.currentGame.game.status;
      if (this.user.currentGame && (status.ended || status.cancelled)) {
        if (this.user._id !== this.user.currentGame.moderator) {
          this.goToSurvey();
        }
      } 
    }
    
  }
  
  goToSurvey() {
    const gameSurveyModal = this.modalCtrl.create(GameSurveyModal, this.user);
    gameSurveyModal.onWillDismiss(data => {
      if (data) {
        console.log('++ gameSurveyModal.onWillDismiss');
      }
    });
    gameSurveyModal.present();
  }
}