import { NgModule } from '@angular/core';
import { FormatTemperatureCPipe } from './format-temperature-c/format-temperature-c';
import { FormatTemperatureFPipe } from './format-temperature-f/format-temperature-f';
import { FormatTemperaturePipe } from './format-temperature/format-temperature';
@NgModule({
	declarations: [FormatTemperatureCPipe,
    FormatTemperatureFPipe,
    FormatTemperaturePipe],
	imports: [],
	exports: [FormatTemperatureCPipe,
    FormatTemperatureFPipe,
    FormatTemperaturePipe]
})
export class PipesModule {}
