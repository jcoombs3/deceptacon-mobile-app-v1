import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortCircles'
})
export class SortCircles implements PipeTransform {
  transform(circles: any) {
    let arr = [];
    arr[0] = circles.filter(circle => circle.type === 0);
    arr[1] = circles.filter(circle => circle.type === 1);
    return arr;
  }
}