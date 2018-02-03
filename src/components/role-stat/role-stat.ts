import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'role-stat',
  templateUrl: 'role-stat.html'
})
export class RoleStat {
  @Input() role: any = {amount: 1};
  @Input() max: number = 1;
  percent: string = '0%';
  winPercent: Number = 0;
  parseIntWin: Number = 0;
  lossPercent: Number = 100;
  parseIntLoss: Number = 100;
  
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
        this.winPercent = parseInt((parseInt(this.role.wins) / parseInt(this.role.amount)*100));
        this.lossPercent = parseInt(100 - parseInt(this.winPercent));
      }
    }
    this.parseIntWin = parseInt(this.winPercent);
    this.parseIntLoss = parseInt(this.lossPercent);
  }
}