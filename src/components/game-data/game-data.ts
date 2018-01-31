import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PlayedGames } from '../../pipes/played-games';
import { ModeratedGames } from '../../pipes/moderated-games';
import { UniqueRoles } from '../../pipes/unique-roles';

@Component({
  selector: 'game-data',
  providers: [ 
    PlayedGames, 
    ModeratedGames,
    UniqueRoles
  ],
  templateUrl: 'game-data.html'
})
export class GameData {
  @Input() games: any;
  @Input() villager: any;
  playedGames: any[] = [];
  moderatedGames: any[] = [];
  uniqueRoles: any[] = [];
  max: Number;

  ngOnChanges(changes: SimpleChanges) {
    this.sortGames();
  }
  
  constructor(
    private playedGamesPipe: PlayedGames,
    private moderatedGamesPipe: ModeratedGames,
    private uniqueRolesPipe: UniqueRoles
  ) {
    if (this.games && this.villager) {
      this.sortGames();
    }
  }
  
  sortGames() {
    this.getPlayedGames();
    this.getModeratedGames();
  }
  
  getPlayedGames() {
    this.playedGames = this.playedGamesPipe.transform(this.games, this.villager);
    this.getUniqueRoles();
  }
  
  getModeratedGames() {
    this.moderatedGames = this.moderatedGamesPipe.transform(this.games, this.villager);
  }
  
  getUniqueRoles() {
    let rolesObj = this.uniqueRolesPipe.transform(this.playedGames, this.villager);
    this.uniqueRoles = rolesObj.roles;
    this.max = rolesObj.max;
  }
}