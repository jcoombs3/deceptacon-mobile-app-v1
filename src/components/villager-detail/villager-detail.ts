import { Component, Input } from '@angular/core';

@Component({
  selector: 'villager-detail',
  templateUrl: 'villager-detail.html'
})
export class VillagerDetail {
  @Input() villager: any;
  
  constructor() {}
}