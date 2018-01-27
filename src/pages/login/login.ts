import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, 
         AlertController, LoadingController, 
         ToastController, Events, Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Socket } from 'ng-socket-io';

// MODALS
import { CreateAccountModal } from '../../modals/create-account/create-account';
import { CodeConductModal } from '../../modals/code-conduct/code-conduct';

// PROVIDERS
import { DeceptaconService } from '../../providers/deceptacon-service/deceptacon-service';
import { AssetsService } from '../../providers/assets-service/assets-service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  anim: boolean = false;
  showLogin: boolean = false;
  villager: any = {
    pin: [],
    username: ''
  };
  @ViewChild(Slides) slides: Slides;

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private deceptaconService: DeceptaconService,
    private assets: AssetsService,
    private storage: Storage,
    private socket: Socket,
    private events: Events
  ) { }
  
  ionViewDidLoad() {
    this.slides.lockSwipes(true);   
  }
  
  ionViewDidEnter() {
    this.storage.get('user').then(data => {
      if (data) {
        this.villager = data;
        this.showLogin = true;
      }
    });
    this.anim = true;
  }
  
  ionViewWillLeave() {
    this.anim = false;
  }
  
  next() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }
  
  prev() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }
  
  createAccount() {
    const createAccountModal = this.modalCtrl.create(CreateAccountModal);
    createAccountModal.onDidDismiss(data => {
      if (data) {
        this.villager = data;
        this.login();
      }
    });
    createAccountModal.present();
  }
  
  retrievePIN(pin: any) {
    this.villager.pin = pin;
    this.login();
  }
  
  login() {
    if (this.validateLogin()) {
      let loading = this.loadingCtrl.create({
        content: 'Logging in...'
      });
      loading.present();
      this.deceptaconService.login(this.villager)
        .subscribe(data => {
          loading.dismiss();
          this.authenticate(data);
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
  }
  
  validateLogin() {
    let error = false;
    let errorText = '';
    if (this.villager.username && this.villager.pin) {
      return true;
    } else if (!this.villager.username) {
      errorText = "Please input a username before adding your PIN";
      error = true;
    }
    
    if (error) {
      let alert = this.alertCtrl.create({
        title: errorText,
        buttons: ['Okay']
      });
      alert.present();
      return false;
    }
  }
  
  authenticate(villager: any) {
    this.storage.set('user', villager);
    this.events.publish('user:authenticated', villager);
    this.socket.emit('com.deceptacon.event', {
      event: `logged-in-${this.villager._id}`,
      data: this.villager
    });
  }
  
  openCodeConduct() {
    const codeConductModal = this.modalCtrl.create(CodeConductModal);
    codeConductModal.present();
  }
}
