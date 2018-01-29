import { Component, ViewChild } from '@angular/core';
import { ViewController, NavParams, LoadingController, 
         Events, AlertController, Slides } from 'ionic-angular';

// PROVIDERS
import { DeceptaconService } from '../../providers/deceptacon-service/deceptacon-service';

@Component({
  selector: 'modal-game-survey',
  templateUrl: 'game-survey.html',
  providers: [ DeceptaconService ]
})
export class GameSurveyModal {
  villager: any;
  alignment: any;
  role: any;
  roles: any[] = [];
  goodRoles: any[] = ["villager", "seer", "bodyguard", "witch", "thing", "hunter", "apprentice seer", "aura seer", "beholder", "diseased", "the count", "cupid", "ghost", "insomniac", "lycan", "matyr", "mason", "mayor", "old hag", "old man", "Private Investigator", "pacifist", "priest", "leprechaun", "prince", "spellcaster", "tough guy", "troublemaker", "cursed"].sort();
  evilRoles: any[] = ["werewolf", "wolf cub", "dire wolf", "big bad wolf", "sorcerer", "minion"].sort();
  @ViewChild(Slides) slides: Slides;
  
  constructor(
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private navParams: NavParams,
    private events: Events,
    private deceptaconService: DeceptaconService
  ) { 
    this.villager = this.navParams.data;  
  }
  
  ionViewDidLoad() {
    this.slides.lockSwipes(true); 
  }
  
  chooseAlignment(alignment: string) {
    this.alignment = alignment;
    switch (alignment) {
      case 'good': 
        this.roles = this.goodRoles;
        break;
      case 'evil': 
        this.roles = this.evilRoles;
        break;
      default:
    }
    let iAlignment = alignment.charAt(0).toUpperCase() + alignment.slice(1);
    this.showAlert(`Confirm you were ${iAlignment}?`, () => {
      this.slideToRole();
    });
  }
  
  chooseRole(role: string) {
    this.role = role;
    let iRole = role.charAt(0).toUpperCase() + role.slice(1);
    this.showAlert(`You were the ${iRole}?`, () => {
      this.publishUserData();
    });
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
  
  slideToAlignment() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }
  
  slideToRole() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }
  
  publishUserData() {
    let arr = {
      villagerId: this.villager._id,
      gameId: this.villager.currentGame.game._id,
      alignment: this.alignment,
      role: this.role
    };
    let loading = this.loadingCtrl.create({
      content: 'Saving...'
    });
    loading.present();
    this.deceptaconService.publishGameDetails(arr)
      .subscribe(data => {
        loading.dismiss();
        this.events.publish('user:published');
        this.closeModal();
    }, error => {
      loading.dismiss();
    });
  }
  
  closeModal() {
    this.viewCtrl.dismiss();
  }
}
