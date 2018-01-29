import { Component, Output, EventEmitter, Input } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'role-list',
  templateUrl: 'role-list.html'
})
export class RoleList {
  @Input() roles: any;
  @Input() alignment: any;
  role: any;
  @Output() selected:EventEmitter<string> = new EventEmitter();
  
  constructor(
    public alertCtrl: AlertController
  ) { }
  
  chooseRole(role: any) {
    this.role = role;
    this.showAlert();
  }
  
  showAlert() {
    let alert = this.alertCtrl.create({
      title: `Confirm ${this.role.name}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: () => {
            this.selected.emit(this.role);
          }
        }
      ]
    });
    alert.present();
  }
}