import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import {Buffer} from 'buffer';
import {debug} from 'debug';
import {DeviceData} from 'node-mi-flora/lib/device-data';


// Bluetooth UUIDs
const DEFAULT_DEVICE_NAME = 'Flower care';
const DATA_SERVICE_UUID = '0000120400001000800000805f9b34fb';
const DATA_CHARACTERISTIC_UUID = '00001a0100001000800000805f9b34fb';
const FIRMWARE_CHARACTERISTIC_UUID = '00001a0200001000800000805f9b34fb';
const REALTIME_CHARACTERISTIC_UUID = '00001a0000001000800000805f9b34fb';
const REALTIME_META_VALUE = Buffer.from([0xA0, 0x1F]);

const SERVICE_UUIDS = [DATA_SERVICE_UUID];
const CHARACTERISTIC_UUIDS = [DATA_CHARACTERISTIC_UUID, FIRMWARE_CHARACTERISTIC_UUID, REALTIME_CHARACTERISTIC_UUID];


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  peripheral: any = {};
  statusMessage: string;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private ble: BLE,
    //private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private ngZone: NgZone) {
      

let device = navParams.get('device');


this.ble.connect(device.id).subscribe(
peripheral => this.onPeripheralDiscovered(peripheral),
peripheral => this.onConnected(peripheral),
//peripheral => this.showAlert('Disconnected', 'The peripheral unexpectedly disconnected')
);

}

onPeripheralDiscovered(device) {
  console.log('Discovered ' + JSON.stringify(device, null, 2));
  this.ngZone.run(() => {
    this.peripheral.push(device);
  });
}

onConnected(peripheral) {
  if (peripheral.state === 'disconnected') {
  this.peripheral = peripheral;
  peripheral.connect();
  peripheral.once('connect', function () {
    this.listenDevice(peripheral, this);
  }.bind(this));
  console.log(JSON.stringify(peripheral, null, 2));
  }
  //this.setStatus('Connected to ' + (peripheral.name || peripheral.id));

}
listenDevice(peripheral, context) {
  peripheral.discoverSomeServicesAndCharacteristics(SERVICE_UUIDS, CHARACTERISTIC_UUIDS, function (error, services, characteristics) {
    characteristics.forEach(function (characteristic) {
      switch (characteristic.uuid) {
        case DATA_CHARACTERISTIC_UUID:
          characteristic.read(function (error, data) {
            context.parseData(peripheral, data);
          });
          break;
        case FIRMWARE_CHARACTERISTIC_UUID:
          characteristic.read(function (error, data) {
            context.parseFirmwareData(peripheral, data);
          });
          break;
        case REALTIME_CHARACTERISTIC_UUID:
          debug('enabling realtime');
          characteristic.write(REALTIME_META_VALUE, false);
          break;
        default:
          debug('found characteristic uuid %s but not matched the criteria', characteristic.uuid);
      }
    });
  });
}
parseData(peripheral, data) {
  debug('data:', data);
  
  let temperature = data.readUInt16LE(0) / 10;
  let lux = data.readUInt32LE(3);
  let moisture = data.readUInt16BE(6);
  let fertility = data.readUInt16LE(8);
  let deviceData = new DeviceData(peripheral.id,
                                  temperature,
                                  lux,
                                  moisture,
                                  fertility);

  debug('temperature: %s °C', temperature);
  debug('Light: %s lux', lux);
  debug('moisture: %s %', moisture);
  debug('fertility: %s µS/cm', fertility);

  debug.emit('data', deviceData);
}
parseFirmwareData(peripheral, data) {
  debug('firmware data:', data);
  let firmware = {
    deviceId: peripheral.id,
    batteryLevel: parseInt(data.toString('hex', 0, 1), 16),
    firmwareVersion: data.toString('ascii', 2, data.length)
  };
  debug.emit('firmware', firmware);
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
deviceSelected(peripheral) {
  console.log(JSON.stringify(peripheral) + ' selected');
  this.navCtrl.push(ContactPage, {
    peripheral: peripheral
  });
}
}