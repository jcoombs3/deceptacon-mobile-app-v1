import { Component } from '@angular/core';
import { ViewController, ModalController, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

// COMPONENTS
//import { ModalFooter } from '../../components/modal-footer/modal-footer';

// MODALS
import { ChangeProfilePicModal } from '../change-profile-pic/change-profile-pic';
//import { PinModal } from '../pin/pin';
//import { ConductModal } from '../conduct/conduct';

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
  colors: any = ["darkblue", "tan", "orange", "yellow", "green", "blue", "black", "gray"]
  villager: any = {
    firstname: '',
    lastname: '',
    username: '',
    pin: null,
    picture: "BodyGuard.png",
    color: "tan"
  }
  
  constructor(
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController
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
    console.log('++ register');
    if (this.validateCreateAccount(f)) {
      console.log('++ register: passed');
//      this.deceptaconService.registerVillager(this.villager)
//        .subscribe(data => {
//          this.viewCtrl.dismiss(data);
//        }, error => {
//
//        });
    }
  }
  
  validateCreateAccount(f: NgForm) {
    let error = false;
    let errorText = '';
    if (f.valid && this.villager.pin) {
      this.villager.username = f.value.username;
      this.villager.firstname = f.value.firstname;
      this.villager.lastname = f.value.lastname;
      return true;
    } else if (!f.valid && !f.value.username) {
      errorText = "Please input a username";
      error = true;
    } else if (!f.valid && !f.value.firstname) {
      errorText = "Please add your first name";
      error = true;
    } else if (!f.valid && !f.value.lastname) {
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
    console.log('++ createPIN');
    
//    const pinModal = this.modalCtrl.create(PinModal);
//    pinModal.onWillDismiss(data => {
//      if (data) {
//        this.villager.pin = data;
//      }
//    });
//    pinModal.present();
  }
  
  
  
  openCodeConduct() {
    console.log('++ openCodeConduct');
//    const conductModal = this.modalCtrl.create(ConductModal);
//    conductModal.present();
  }
  
}
