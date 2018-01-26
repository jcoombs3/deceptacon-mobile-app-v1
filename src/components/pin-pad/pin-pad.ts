import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pin-pad',
  templateUrl: 'pin-pad.html'
})
export class PinPad {
  pin: any = [];
  @Output() validated:EventEmitter<string> = new EventEmitter();
  
  constructor() { }
  
  validatePIN() {
    if (this.pin.length === 4) {
      setTimeout(() => {
        this.validated.emit(this.pin);
        this.pin = [];
      }, 200); 
    }
  }
  
  insertPIN(num: number) {
    if (this.pin.length < 4) {
      this.pin.push(num);
      this.validatePIN();
    }
  }
}