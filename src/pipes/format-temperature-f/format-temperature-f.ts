import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FormatTemperatureFPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatTemperatureF',
})
export class FormatTemperatureFPipe implements PipeTransform {
  transform(celsius: number, ...args) {
    if (celsius === undefined) {
      return '???';
    }

    let fahrenheit = this.toFahrenheit(celsius);

    return fahrenheit.toFixed(1) + '°F';

  }

  toFahrenheit(celsius: number): number {
    var fahrenheit = (celsius * 1.8 + 32.0);
    return fahrenheit;
  }
}
