import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'role-stat',
  templateUrl: 'role-stat.html'
})
export class RoleStat {
  @Input() role: any = {amount: 1};
  @Input() max: number = 1;
  winPercent: any = 0;
  parseIntWin: any = 0;
  lossPercent: any = 100;
  parseIntLoss: any = 100;
  
  constructor() {
    this.calculateWinPercent();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.calculateWinPercent();
  }
  
  calculateWinPercent() {
    if (this.role.amount && this.role.wins > 0) {
      this.winPercent = (this.role.wins / this.role.amount)*100;
      console.log(this.winPercent);
      this.lossPercent = 100 - ((this.role.wins / this.role.amount)*100);
    }
    this.parseIntWin = parseInt(this.winPercent);
    this.parseIntLoss = parseInt(this.lossPercent);
  }
}