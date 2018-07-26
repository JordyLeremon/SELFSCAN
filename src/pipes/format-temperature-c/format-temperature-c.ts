import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FormatTemperatureCPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatTemperatureC',
})
export class FormatTemperatureCPipe implements PipeTransform {
  transform(celsius: number, ...args) {
    if (celsius === undefined) {
      return '???';
    }

    return celsius.toFixed(1) + '°C';
  }
}
