import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortGames'
})
export class SortGames implements PipeTransform {
  transform(games: any) {
    return games.sort((a: any, b: any) => {
      if (a.timestamp > b.timestamp) {
        return -1;
      } else if (a.timestamp < b.timestamp) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}