import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';


// Bluetooth UUIDs
const service_uuid = '00001204-0000-1000-8000-00805f9b34fb';
const characteristic_uuid = '00001a01-0000-1000-8000-00805f9b34fb';
const power_service_uuid = '00001204-0000-1000-8000-00805f9b34fb';
const power_characteristic_uuid = '00001a02-0000-1000-8000-00805f9b34fb';



@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  peripheral: any = {};
  statusMessage: string;
  power: boolean;
  brightness: number;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private ble: BLE,
    //private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private ngZone: NgZone) {

let device = navParams.get('device');

this.setStatus('Connecting to ' + device.name || device.id);

this.ble.connect(device.id).subscribe(
peripheral => this.onConnected(peripheral),
peripheral => this.showAlert('Disconnected', 'The peripheral unexpectedly disconnected')
);

}

onConnected(peripheral) {
  this.peripheral = peripheral;
  this.setStatus('Connected to ' + (peripheral.name || peripheral.id));

  // Update the UI with the current state of the switch characteristic
  this.ble.read(this.peripheral.id, service_uuid, characteristic_uuid).then(
    buffer => {
      let data = new Uint8Array(buffer);
      console.log('switch characteristic ' + data[0]);
      this.ngZone.run(() => {
          this.brightness = data[0] ;
      });
    }
  )
  // Update the UI with the current state of the dimmer characteristic
  this.ble.read(this.peripheral.id, power_service_uuid, power_characteristic_uuid).then(
    buffer => {
      let data = new Uint8Array(buffer);
      console.log('power characteristic ' + data[0]);
      this.ngZone.run(() => {
        this.power = data[0]!== 0;
      });
    }
  )

}

onPowerSwitchChange(event) {
  console.log('onPowerSwitchChange');
  let value = this.power ? 1 : 0;
  let buffer = new Uint8Array([value]).buffer;
  console.log('Power Switch Property ' + this.power);
  this.ble.write(this.peripheral.id, power_service_uuid, power_characteristic_uuid, buffer).then(
    () => this.setStatus('Light is ' + (this.power ? 'on' : 'off')),
    e => this.showAlert('Unexpected Error', 'Error updating power switch')
  );
}

setBrightness(event) {
  let buffer = new Uint8Array([this.brightness]).buffer;
  this.ble.write(this.peripheral.id, service_uuid, characteristic_uuid, buffer).then(
    () => this.setStatus('Set brightness to ' + this.brightness),
    e => this.showAlert('Unexpected Error', 'Error updating dimmer characteristic ' + e)
  );
}

// Disconnect peripheral when leaving the page
ionViewWillLeave() {
  console.log('ionViewWillLeave disconnecting Bluetooth');
  this.ble.disconnect(this.peripheral.id).then(
    () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
    () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
  )
}

showAlert(title, message) {
  let alert = this.alertCtrl.create({
    title: title,
    subTitle: message,
    buttons: ['OK']
  });
  alert.present();
}

setStatus(message) {
  console.log(message);
  this.ngZone.run(() => {
    this.statusMessage = message;
  });
}

}
