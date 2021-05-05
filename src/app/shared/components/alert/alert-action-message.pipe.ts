import { Pipe, PipeTransform } from '@angular/core';

/**
 * TAKE ACTION FROM ALERT OBJECT AND TRANSFORM IT TO MESSAGE
 * E.G. '[FETCH_USER] reload' => 'reload'  
 */

@Pipe({
  name: 'alertActionMessage'
})
export class AlertActionMessagePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    const index = value.lastIndexOf(']');
    return value.substring(index+1).trim();
  }

}
