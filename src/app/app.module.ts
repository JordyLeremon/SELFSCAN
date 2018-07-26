import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import {AboutPage} from '../pages/about/about';
import {ContactPage} from '../pages/contact/contact';
import { EnvoiPage } from '../pages/envoi/envoi';
import { AccueilPage } from '../pages/accueil/accueil';
import { ScanPage } from '../pages/scan/scan';

import { FormatTemperaturePipe } from '../pipes/format-temperature/format-temperature';
import { FormatTemperatureCPipe } from '../pipes/format-temperature-c/format-temperature-c';
import { FormatTemperatureFPipe } from '../pipes/format-temperature-f/format-temperature-f';
import { Geolocation } from '@ionic-native/geolocation';
import { BLE } from '@ionic-native/ble';
import { HttpModule} from '@angular/http';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AboutPage,
    ContactPage,
    EnvoiPage,
    AccueilPage,
    ScanPage,
    FormatTemperaturePipe,
    FormatTemperatureCPipe,
    FormatTemperatureFPipe

  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    NgxQRCodeModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AboutPage,
    ContactPage,
    EnvoiPage,
    AccueilPage,
    ScanPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    BLE,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner
    
  ]
})
export class AppModule {}