import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortVillagers'
})
export class SortVillagers implements PipeTransform {
  transform(villagers: any) {
    return villagers.sort((a: any, b: any) => {
      if (a.fullname < b.fullname) {
        return -1;
      } else if (a.fullname > b.fullname) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}