import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstWord'
})
export class FirstWordPipe implements PipeTransform {

  transform(value: string): unknown {
    return (value) ?  value.split(' ')[0] : '';
  }

}
