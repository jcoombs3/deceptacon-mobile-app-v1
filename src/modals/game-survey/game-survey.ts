import { Component, ViewChild } from '@angular/core';
import { Platform, ViewController, NavParams, LoadingController, 
         Events, AlertController, Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';

// PROVIDERS
import { DeceptaconService } from '../../providers/deceptacon-service/deceptacon-service';

@Component({
  selector: 'modal-game-survey',
  templateUrl: 'game-survey.html',
  providers: [ DeceptaconService ]
})
export class GameSurveyModal {
  villager: any;
  alignments: any = null;
  roles: any = null;
  alignment: any;
  role: any;
  @ViewChild(Slides) slides: Slides;
  
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private navParams: NavParams,
    private events: Events,
    private deceptaconService: DeceptaconService,
    private storage: Storage
  ) { 
    this.villager = this.navParams.data; 
    this.deceptaconService.getAlignments()
      .subscribe(data => {
      this.alignments = data;
    }, error => {});
  }
  
  ionViewWillEnter() {
    if (this.platform.is('cordova')) {
      this.statusBar.styleDefault(); 
    }
  }
  
  ionViewWillLeave() {
    if (this.platform.is('cordova')) {
      this.statusBar.styleLightContent(); 
    }
  }
  
  ionViewDidLoad() {
    this.slides.lockSwipes(true); 
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
  
  chooseAlignment(alignment: any) {
    this.alignment = alignment;
    let loading = this.loadingCtrl.create({
      content: `Retrieving ${alignment.name} Roles...`
    });
    loading.present();
    this.deceptaconService.getRoles(this.alignment._id)
      .subscribe(data => {
        loading.dismiss();
        this.roles = data;
        this.slideToRole();
    }, error => {
      loading.dismiss();
    });
  }
  
  chooseRole(role: any) {
    this.role = role;
    let loading = this.loadingCtrl.create({
      content: `Saving...`
    });
    loading.present();
    let arr = {
      villagerId: this.villager._id,
      gameId: this.villager.currentGame.game._id,
      alignment: this.alignment._id,
      role: this.role._id
    };
    this.storage.get('token').then(token => {
      if (token) {
        this.deceptaconService.publishGameDetails(arr, token)
          .subscribe(data => {
            loading.dismiss();
            this.events.publish('user:published');
            this.closeModal();
        }, error => {
          loading.dismiss();
        });
      }
    }); 
  }
  
  closeModal() {
    this.viewCtrl.dismiss();
  }
}
