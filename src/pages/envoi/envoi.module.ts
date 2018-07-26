import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnvoiPage } from './envoi';

@NgModule({
  declarations: [
    EnvoiPage,
  ],
  imports: [
    IonicPageModule.forChild(EnvoiPage),
  ],
})
export class EnvoiPageModule {}
