import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'role-stat',
  templateUrl: 'role-stat.html'
})
export class RoleStat {
  @Input() role: any = {amount: 1};
  @Input() max: number = 1;
  percent: string = '0%';
  winPercent: string = '0%';
  lossPercent: string = '0%';
  
  constructor() {
    this.calculateGamePercent();
    this.calculateWinPercent();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.calculateGamePercent();
    this.calculateWinPercent();
  }
  
  calculateGamePercent() {
    if (this.role && this.max) {
      this.percent = (this.role.amount / this.max)*100 + '%';
    }
  }
  
  calculateWinPercent() {
    if (this.role.amount) {
      if (this.role.wins > 0) {
        let winPercent = (this.role.wins / this.role.amount)*100;
        let lossPercent = 100 - winPercent;
        this.winPercent = winPercent + '%';
        this.lossPercent = lossPercent + '%';
      } else {
        this.winPercent = '0%';
        this.lossPercent = '100%';
      }
    }
  }
}