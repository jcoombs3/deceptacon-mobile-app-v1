import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moderatedGames'
})
export class ModeratedGames implements PipeTransform {
  transform(games: any[], villager: any) {
    return games.filter(game => game.moderator._id === villager._id);
  }
}