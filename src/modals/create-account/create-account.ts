import { Component } from '@angular/core';
import { ViewController, ModalController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

// MODALS
import { ChangeProfilePicModal } from '../change-profile-pic/change-profile-pic';
import { CreatePinModal } from '../create-pin/create-pin';
import { CodeConductModal } from '../code-conduct/code-conduct';

// PROVIDERS
import { DeceptaconService } from '../../providers/deceptacon-service/deceptacon-service';
import { AssetsService } from '../../providers/assets-service/assets-service';

@Component({
  selector: 'modal-create-account',
  templateUrl: 'create-account.html',
  providers: [ DeceptaconService, AssetsService ]
})
export class CreateAccountModal {
  pictures: any = ["BodyGuard.png", "CultLeader.png", "Cupid.png", "CultLeader.png", "Drunk.png", "FrankensteinMonster.png", "Huntress.png", "Lycan.png", "Seer.png", "Sorcerer.png", "ToughGuy.png", "Vampire.png", "VillagerF.png", "VillagerM.png", "Werewolf.png", "Witch.png", "WolfCub.png"]
  colors: any = ["yellow", "magenta", "cyan", "green", "white", "black"]
  villager: any = {
    firstname: '',
    lastname: '',
    username: '',
    pin: null,
    picture: "BodyGuard.png",
    color: "tan"
  };
  noLastName: boolean = false;
  
  constructor(
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private assets: AssetsService,
    private deceptaconService: DeceptaconService
  ) {
    this.randomizeProfilePic();
  }
  
  randomizeProfilePic() {
    this.villager.picture = this.pictures[
      Math.floor((Math.random() * this.pictures.length - 1) + 1)
    ];
    this.villager.color = this.colors[
      Math.floor((Math.random() * this.colors.length - 1) + 1)
    ];
  }
  
  closeModal() {
    this.viewCtrl.dismiss();
  }
  
  editProfilePic(villager: any) {
    const changeProfilePicModal = this.modalCtrl.create(ChangeProfilePicModal, this.villager);
    changeProfilePicModal.onWillDismiss(data => {
      if (data) {
        this.villager.picture = data.picture;
        this.villager.color = data.color;
      }
    });
    changeProfilePicModal.present();
  }
  
  onSubmit(f: NgForm) {
    this.register(f);
  }
  
  register(f: NgForm) {
    if (this.validateCreateAccount(f)) {
      let loading = this.loadingCtrl.create({
        content: 'Registering...'
      });
      loading.present();
      this.deceptaconService.registerVillager(this.villager)
        .subscribe(data => {
          loading.dismiss();
          this.viewCtrl.dismiss(data);
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
  
  validateCreateAccount(f: NgForm) {
    let error = false;
    let errorText = '';
    if (f.valid && this.villager.pin) {
      this.villager.username = f.value.username;
      this.villager.firstname = f.value.firstname;
      this.villager.lastname = f.value.lastname ? f.value.lastname : '';
      return true;
    } else if (!f.valid && !f.value.username) {
      errorText = "Please input a username";
      error = true;
    } else if (!f.valid && !f.value.firstname) {
      errorText = "Please add your first name";
      error = true;
    } else if (!f.valid && !f.value.lastname && !this.noLastName) {
      errorText = "Please add your last name";
      error = true;
    } else if (!this.villager.pin) {
      errorText = "Please add a security pin";
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
  
  createPIN() {
    const createPinModal = this.modalCtrl.create(CreatePinModal);
    createPinModal.onWillDismiss(data => {
      if (data) {
        this.villager.pin = data;
      }
    });
    createPinModal.present();
  }
  
  updateNoLastName() {
    this.noLastName = !this.noLastName;
  }
  
  openCodeConduct() {
    const codeConductModal = this.modalCtrl.create(CodeConductModal);
    codeConductModal.present();
  }
}
