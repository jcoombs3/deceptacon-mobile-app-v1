import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import 'rxjs/Rx';

@Injectable()
export class DeceptaconService {
  deceptaconUrl: String = 'https://deceptacon-server.herokuapp.com'
  
  constructor(public http: Http, private storage: Storage) {}
  
  // ---------------------- //
  
  getUser(callback: Function) {
    this.storage.get('user').then(data => {
      if (data) {
        callback(data.token);
      }
    });
  }
  
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
  
  saveVillager(villager: any, token: String) {
    let arr = villager;
    arr.token = token;
    return this.http.post(this.deceptaconUrl + '/save/villager', arr)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  registerVillager(villager: any) {
    return this.http.post(this.deceptaconUrl + '/register/villager', villager)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  updateVillagerRights(obj: any, token: String) {
    let arr = obj;
    arr.token = token;
    return this.http.post(this.deceptaconUrl + '/rights/villager', arr)
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
  
  reserveCircle(obj: any, token: String) {
    let arr = obj;
    arr.token = token;
    return this.http.post(this.deceptaconUrl + '/circle/reserve', arr)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  // ---------------------- //
  
  // GAMES
  
  createGame(obj: any, token: String) {
    let arr = obj;
    arr.token = token;
    return this.http.post(this.deceptaconUrl + '/register/game', arr)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  joinGame(obj: any, token: String) {
    let arr = obj;
    arr.token = token;
    return this.http.post(this.deceptaconUrl + '/game/join', arr)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  removeVillager(obj: any, token: String) {
    let arr = obj;
    arr.token = token;
    return this.http.post(this.deceptaconUrl + '/game/remove/villager', arr)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  getGame(id: String) {
    return this.http.get(this.deceptaconUrl + '/game/' + id)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  addPlaceholder(obj: any, token: String) {
    let arr = obj;
    arr.token = token;
    return this.http.post(this.deceptaconUrl + '/game/placeholder/', arr)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  removePlaceholder(obj: any, token: String) {
    let arr = obj;
    arr.token = token;
    return this.http.post(this.deceptaconUrl + '/game/remove/placeholder', arr)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  updateGameDetails(obj: any, token: String) {
    let arr = obj;
    arr.token = token;
    return this.http.post(this.deceptaconUrl + '/game/update', arr)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  beginGame(obj: any, token: String) {
    let arr = obj;
    arr.token = token;
    return this.http.post(this.deceptaconUrl + '/game/begin', arr)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  endGame(obj: any, token: String) {
    let arr = obj;
    arr.token = token;
    return this.http.post(this.deceptaconUrl + '/game/end', arr)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  cancelGame(arr: any) {
    return this.http.post(this.deceptaconUrl + '/game/cancel', arr)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  publishGameDetails(obj: any, token: String) {
    let arr = obj;
    arr.token = token;
    return this.http.post(this.deceptaconUrl + '/game/publish', arr)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  publishWinnerDetails(obj: any, token: String) {
    let arr = obj;
    arr.token = token;
    return this.http.post(this.deceptaconUrl + '/game/winner', arr)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  // ---------------------- //
  
  // ALIGNMENTS / ROLES

  getAlignments() {
    return this.http.get(this.deceptaconUrl + '/alignment')
      .map(res => res.json())
      .catch(this.handleError);
  }

  getRoles(id: String) {
    return this.http.get(this.deceptaconUrl + '/roles/' + id)
      .map(res => res.json())
      .catch(this.handleError);
  }
  
  // ---------------------- //

  handleError(error) {
    //console.error(error);
    return Observable.throw(JSON.parse(error._body)["Error"] || 'Server error');
  }
}