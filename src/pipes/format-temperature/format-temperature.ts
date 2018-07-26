import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FormatTemperaturePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatTemperature',
})
export class FormatTemperaturePipe implements PipeTransform {
  transform(celsius: number, ...args) {
    
       if (celsius === undefined) {
         return '???';
       }
       let fahrenheit = this.toFahrenheit(celsius);
   
       return celsius.toFixed(1) + '°C ' + fahrenheit.toFixed(1) + '°F';
     }
   
     toFahrenheit(celsius: number): number {
       var fahrenheit = (celsius * 1.8 + 32.0);
       return fahrenheit;
     }
}
