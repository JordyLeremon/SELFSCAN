import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import {Buffer} from 'buffer';
import {debug} from 'debug';
import {DeviceData} from 'node-mi-flora/lib/device-data';

// Bluetooth UUIDs
const DATA_SERVICE_UUID = '0000120400001000800000805f9b34fb';
const DATA_CHARACTERISTIC_UUID = '00001a0100001000800000805f9b34fb';
const FIRMWARE_CHARACTERISTIC_UUID = '00001a0200001000800000805f9b34fb';
const REALTIME_CHARACTERISTIC_UUID = '00001a0000001000800000805f9b34fb';
const REALTIME_META_VALUE = Buffer.from([0xA0, 0x1F]);

const SERVICE_UUIDS = [DATA_SERVICE_UUID];
const CHARACTERISTIC_UUIDS = [DATA_CHARACTERISTIC_UUID, FIRMWARE_CHARACTERISTIC_UUID, REALTIME_CHARACTERISTIC_UUID];


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  peripheral: any = {};
  temperature: number;
  statusMessage: string;
    constructor(public navCtrl: NavController, 
      public navParams: NavParams, 
      private ble: BLE,
      private alertCtrl: AlertController,
      private ngZone: NgZone) {
        let device = navParams.get('device');
        
            this.setStatus('Connecting to ' + device.name || device.id);
        
            // This is not a promise, the device can call disconnect after it connects, so it's an observable
            this.ble.connect(device.id).subscribe(
              peripheral => this.onConnected(peripheral),
              peripheral => this.showAlert('Disconnected', 'The peripheral unexpectedly disconnected')
            );
        
          }
          
        
          // the connection to the peripheral was successful
          onConnected(peripheral) {
        
            this.peripheral = peripheral;
            if (peripheral.state === 'disconnected') {
              this.peripheral = peripheral;
              peripheral.connect();
              peripheral.once('connect', function () {
                this.listenDevice(peripheral, this);
              }.bind(this));
              console.log(JSON.stringify(peripheral, null, 2));
              }
            else{
            this.setStatus('Connected to ' + (peripheral.name || peripheral.id));
            }
            // Subscribe for notifications when the temperature changes
            //this.ble.startNotification(this.peripheral.id, DATA_SERVICE_UUID, DATA_CHARACTERISTIC_UUID).subscribe(
              //data => this.listenDevice(peripheral, this),
              //() => this.showAlert('Unexpected Error', 'Failed to subscribe for temperature changes')
            //)
        
            // Read the current value of the temperature characteristic
            //this.ble.read(this.peripheral.id, DATA_SERVICE_UUID, DATA_CHARACTERISTIC_UUID).then(
              //data => this.onTemperatureChange(data),
              //() => this.showAlert('Unexpected Error', 'Failed to get temperature')
            //)
            
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
          /*onTemperatureChange(REALTIME_META_VALUE) {
        
            // Temperature is a 4 byte floating point value
            let data = REALTIME_META_VALUE.readUInt16LE(0) / 10;
            console.log(data[0]);
        
            this.ngZone.run(() => {
              this.temperature = data[0];
            });
        
          }*/
      
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
