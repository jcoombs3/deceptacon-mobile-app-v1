import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'role-stat',
  templateUrl: 'role-stat.html'
})
export class RoleStat {
  @Input() role: any;
  @Input() max: Number;
  percent: string = '0%';
  
  constructor() {
    this.calculatePercent();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.calculatePercent();
  }
  
  calculatePercent() {
    if (this.role && this.max) {
      this.percent = (this.role.amount / this.max)*100 + '%';
    }
  }
}