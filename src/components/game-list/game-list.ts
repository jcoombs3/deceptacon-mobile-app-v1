import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'game-list',
  providers: [ DatePipe ],
  templateUrl: 'game-list.html'
})
export class GameList {
  @Input() games: any;
  @Input() villager: any;
  
  constructor(private datePipe: DatePipe) {
    
  }
}