import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class DeceptaconService {
  deceptaconUrl: String = 'https://deceptacon-server.herokuapp.com'
  
  constructor(public http: Http) {}
  
  // ---------------------- //
  
  // LOGIN
  login(arr: any) {
    return this.http.post(this.deceptaconUrl + '/login', arr)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  // ---------------------- //
  
  // VILLAGER
  getVillagers() {
    return this.http.get(this.deceptaconUrl + '/villager')
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  getVillager(id: String) {
    return this.http.get(this.deceptaconUrl + '/villager/' + id)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  saveVillager(villager: any) {
    return this.http.post(this.deceptaconUrl + '/save/villager', villager)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  registerVillager(villager: any) {
    return this.http.post(this.deceptaconUrl + '/register/villager', villager)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  // ---------------------- //
  
  // CIRCLES
  
  getCircles() {
    return this.http.get(this.deceptaconUrl + '/circle')
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  reserveCircle(arr: any) {
    return this.http.post(this.deceptaconUrl + '/circle/reserve', arr)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  // ---------------------- //
  
  // GAMES
  
  createGame(arr: any) {
    return this.http.post(this.deceptaconUrl + '/register/game', arr)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  joinGame(arr: any) {
    return this.http.post(this.deceptaconUrl + '/game/join', arr)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  getGame(id: String) {
    return this.http.get(this.deceptaconUrl + '/game/' + id)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  // ---------------------- //

  handleError(error) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}