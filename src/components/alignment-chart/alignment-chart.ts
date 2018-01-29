import { Component, Output, EventEmitter } from '@angular/core';
import { AlertController } from 'ionic-angular';

// PROVIDERS
import { DeceptaconService } from '../../providers/deceptacon-service/deceptacon-service';

@Component({
  selector: 'alignment-chart',
  providers: [ DeceptaconService ],
  templateUrl: 'alignment-chart.html'
})
export class AlignmentChart {
  alignments: any;
  alignment: any;
  @Output() selected:EventEmitter<string> = new EventEmitter();
  
  constructor(
    public alertCtrl: AlertController,
    private deceptaconService: DeceptaconService
  ) {
    this.deceptaconService.getAlignments()
      .subscribe(data => {
      this.alignments = data;
    }, error => {});
  }
  
  chooseAlignment(alignment: any) {
    this.alignment = alignment;
    this.showAlert();
  }
  
  showAlert() {
    let alert = this.alertCtrl.create({
      title: `Confirm ${this.alignment.name}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: () => {
            this.selected.emit(this.alignment);
          }
        }
      ]
    });
    alert.present();
  }
}