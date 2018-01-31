import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'playedGames'
})
export class PlayedGames implements PipeTransform {
  transform(games: any[], villager: any) {
    return games.filter(game => game.moderator._id !== villager._id);
  }
}