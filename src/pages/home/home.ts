import { BLE } from '@ionic-native/ble';
import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  //Déclaration des variables
  devices: any[] = [];
  userId: any[] = [];
  SerialNumber: any[] = [];
  statusMessage: string;

  constructor(public navCtrl: NavController, 
              private toastCtrl: ToastController,
              public navParams: NavParams, 
              private geolocation: Geolocation,
              private ble: BLE,
              private ngZone: NgZone) { 
                this.userId = navParams.get('userId');
                this.SerialNumber = navParams.get('SerialNumber');
  }

// Méthode permettant de charger la page
  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.scan();
  }

//Méthode permettant d'effectuer le scan des devices à proximités
  scan() {
    this.setStatus('Recherche de device à proximité');
    this.devices = [];  // clear list
    this.ble.scan([], 5).subscribe(
      device => this.onDeviceDiscovered(device), 
      error => this.scanError(error)
    );

    setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');// fonction permettant de définir un temps de scan des devices puis d'afficher un message une fois ce temps écoulés
  }

//Méthode permettant d'afficher les devices ayant été scanné au préalable
  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device);
    });
  }

  // If location permission is denied, you'll end up here
  scanError(error) {
    this.setStatus('Error ' + error);
    let toast = this.toastCtrl.create({
      message: 'Error scanning for Bluetooth low energy devices',
      position: 'middle',
      duration: 5000
    });
    toast.present();
  }

  //Méthode permettant de créer le message d'erreur si nous n'avons pas les permissions nécessaires
  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  //Méthode permettant d'afficher les informations relatives au devices en questions
  deviceSelected(device) {
    console.log(JSON.stringify(device) + ' selected');
    this.navCtrl.push(AboutPage, {
      device: device,
      userId: this.userId,
      SerialNumber: this.SerialNumber
    });
    
    
  }
  
  
  
    
  
//Méthode permettant d'obtenir la position actuelle du capteur
  getLocation(){
    this.geolocation.getCurrentPosition().then((res) => {
      let location='lat '+res.coords.latitude+' lang '+res.coords.longitude;
      let toast = this.toastCtrl.create({
        message: location,
        duration: 3000
      });
      toast.present();

    }).catch((error) => {
    console.log('Error getting location', error);
    });
  }

  // Méthode permettant de charger la page
  ionViewDidLoad() {
    console.log("ionViewDidLoad AboutPage");
    
    
  }
  
}