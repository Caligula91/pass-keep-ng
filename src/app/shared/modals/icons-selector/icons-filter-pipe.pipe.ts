import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconsFilterPipe'
})
export class IconsFilterPipePipe implements PipeTransform {

  transform(value: string[], search: string): string[] {
    if (search && value) {
      return value.reduce((acc, curr) => {
        if (curr.startsWith(search, curr.lastIndexOf('/')+1))
          acc.push(curr);
        return acc;
      }, new Array<string>())
    }
    return value;
  }

}
