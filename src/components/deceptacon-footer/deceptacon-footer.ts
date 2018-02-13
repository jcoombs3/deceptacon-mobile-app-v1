import { Component, Input } from '@angular/core';
import { Events, ModalController, ToastController, 
         LoadingController, Platform } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';

// PAGES
import { HomePage } from '../../pages/home/home';
import { ProfilePage } from '../../pages/profile/profile';
import { GamePage } from '../../pages/game/game';
import { AdminPage } from '../../pages/admin/admin';

// PAGES
import { GameSurveyModal } from '../../modals/game-survey/game-survey';
import { ModSurveyModal } from '../../modals/mod-survey/mod-survey';

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
  private onResumeSubscription: Subscription;
  
  constructor(
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    private assets: AssetsService, 
    private deceptaconService: DeceptaconService, 
    private events: Events,
    private socket: Socket,
    private storage: Storage
  ) {
    this.addEventListeners();
    this.onResumeSubscription = platform.resume.subscribe(() => {
      this.onResume();
    }); 
  }
  
  onResume() {
    if (this.user) {
      let loading = this.loadingCtrl.create({
        content: `Welcome back, ${this.user.firstname}`
      });
      loading.present();
      this.deceptaconService.getVillager(this.user._id)
        .subscribe(data => {
          this.storage.set('user', data);
          this.user = data;
          this.unsubscribeEvents(this.user);
          this.addDynamicListeners();
          this.checkForSurvey(false);
          loading.dismiss();
        }, error => {
          console.log('++ error');
        });
    }
  }
  
  addEventListeners() {
    this.events.subscribe('user:authenticated', (user) => {
      console.log('event: user:authenticated', 'DeceptaconFooter');
      this.user = user;
      this.nav.setRoot(HomePage);
      this.checkForSurvey(false);
      this.unsubscribeEvents(this.user);
      this.addDynamicListeners();
    });
    this.events.subscribe('user:creategame', () => {
      console.log('event: user:creategame', 'DeceptaconFooter');
      this.getUser();
    });
    this.events.subscribe('user:endedgame', (gameId) => {
      console.log('event: user:endedgame', 'DeceptaconFooter');
      this.goToHome();
      this.goToModSurvey();
    });
    this.events.subscribe('user:joinedgame', (gameId) => {
      console.log('event: user:joinedgame', 'DeceptaconFooter');
      this.getUser();
    });
    this.events.subscribe('user:published', (user) => {
      console.log('event: user:published', 'DeceptaconFooter');
      this.goToHome();
      this.getUser();
    });
    this.events.subscribe('user:loggedout', (user) => {
      console.log('event: user:loggedout', 'DeceptaconFooter');
      this.socket.removeAllListeners();
      this.unsubscribeEvents(this.user);
      this.user = user;
    });
  }
  
  unsubscribeEvents(user: any) {
    this.events.unsubscribe(`villager-removed-${user._id}`);
    this.socket.removeListener(`villager-removed-${user._id}`);
    this.events.unsubscribe(`villager-rights-${user._id}`);
    this.socket.removeListener(`villager-rights-${user._id}`);
    if (user.currentGame) {
      this.socket.removeListener(`game-begin-${user.currentGame._id}`);
      this.socket.removeListener(`game-ended-${user.currentGame._id}`);
    }
  }
  
  addDynamicListeners() {
    this.events.subscribe(`villager-removed-${this.user._id}`, (data) => {
      this.removeVillagerLogic(data);
    });
    this.socket.on(`villager-removed-${this.user._id}`, (data) => {
      console.log('event: villager:removed', 'DeceptaconFooter');
      this.removeVillagerLogic(data);
    });
    this.events.subscribe(`villager-rights-${this.user._id}`, (data) => {
      this.user.isAdmin = data.isAdmin;
      this.user.isMod = data.isMod;
      this.storage.set('user', this.user);
      this.showToast(`Your rights have updated`, '');
      let active = this.nav.last().instance instanceof AdminPage;
      if (active) {
        this.goToHome();
      } 
    });
    this.socket.on(`villager-rights-${this.user._id}`, (data) => {
      console.log('event: villager:rights', 'DeceptaconFooter');
      this.user.isAdmin = data.isAdmin;
      this.user.isMod = data.isMod;
      this.storage.set('user', this.user);
      this.showToast(`Your rights have updated`, '');
      let active = this.nav.last().instance instanceof AdminPage;
      if (active) {
        this.goToHome();
      } 
    });
    if (this.user.currentGame) {
      let game = this.user.currentGame.game;
      this.socket.removeListener(`game-begin-${game._id}`);
      this.socket.removeListener(`game-ended-${game._id}`);
      this.socket.on(`game-begin-${game._id}`, (data) => {
        console.log('event: game:begin', 'DeceptaconFooter');
        this.showToast(`${this.user.currentGame.name}'s game has started`, '');
        let active = this.nav.last().instance instanceof GamePage;
        if (!active) {
          this.goToCurrentGame();
        } 
      });
      this.socket.on(`game-ended-${game._id}`, (data) => {
        this.showToast(`${this.user.currentGame.name}'s game has ended`, 'error');
        let active = this.nav.last().instance instanceof GamePage;
        if (active) {
          this.goToHome();
        } 
        this.checkForSurvey(true);
      });
    }
  }
  
  removeVillagerLogic(data: any) {
    if (!data.game.status.active) {
      this.showToast(`You have been removed from ${this.user.currentGame.name}`, 'error');
    } else {
      this.checkForSurvey(true);
    }
    let active = this.nav.last().instance instanceof GamePage;
    if (active) {
      this.nav.popToRoot();
    } 
    this.getUser();
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
      let game = this.user.currentGame.game;
      if (this.user._id !== this.user.currentGame.moderator) {
        this.socket.removeListener(`game-ended-${game._id}`);
        this.goToSurvey();
      } else {
        this.socket.removeListener(`game-ended-${game._id}`);
        this.goToModSurvey();
      }
    } else if (!isActive && this.user.currentGame) {
      let status = this.user.currentGame.game.status;
      let game = this.user.currentGame.game;
      if (status.ended || status.cancelled) {
        if (this.user._id !== this.user.currentGame.moderator) {
          this.socket.removeListener(`game-ended-${game._id}`);
          this.goToSurvey();
        } else {
          this.socket.removeListener(`game-ended-${game._id}`);
          this.goToModSurvey();
        }
      } else if (status.active) {
        this.goToCurrentGame();
      }
    }
  }
  
  goToModSurvey() {
    const modSurveyModal = this.modalCtrl.create(ModSurveyModal, this.user);
    modSurveyModal.onWillDismiss(data => {
      if (data) {
        console.log('++ modSurveyModal.onWillDismiss');
      }
    });
    modSurveyModal.present();
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