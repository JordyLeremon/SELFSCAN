import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController,ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import {Buffer} from 'buffer';
import {debug} from 'debug';
import { Geolocation } from '@ionic-native/geolocation';
import { Http, Headers, RequestOptions } from '@angular/http';
import * as moment from 'moment';
import {DeviceData} from 'node-mi-flora/lib/device-data';


// Bluetooth UUIDs

const READ_SERVICE_UUID= '1204';
const READ_CHARACTERISTIC_UUID= '1a01';
const WRITE_SERVICE_UUID= '1204';
const WRITE_CHARACTERISTIC_UUID= '1a00';
const REALTIME_META_VALUE = new Uint8Array([0xA0,0x1F]).buffer;



@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  //définitions des variables

  peripheral: any = {};
  temperature: number;
  moisture: number;
  locate: string;
  light: number;
  conductivity: number;
  data1:any = {};
  lat: any;
  lng: any;
  userId: any;
  date: any;
  SerialNumber: any;
  

  statusMessage: string;
    constructor(public navCtrl: NavController, 
      public navParams: NavParams, 
      private ble: BLE,
      private toastCtrl: ToastController,
      private alertCtrl: AlertController,
      public http: Http,
      public geo: Geolocation,
      private ngZone: NgZone) {
        this.data1.Mac_Address= '';
        this.data1.date= moment().format();
        this.data1.sensorName= '';
        this.data1.Lat= '';
        this.data1.Lng= '';
        this.data1.response = '';
        this.userId = navParams.get('userId');
        this.SerialNumber= navParams.get('SerialNumber');
        
      
        this.http = http;
        let device = navParams.get('device');
        
            this.setStatus('Connecting to ' + device.name || device.id);
        
            // This is not a promise, the device can call disconnect after it connects, so it's an observable
            this.ble.connect(device.id).subscribe(
              
              peripheral => this.onConnected(peripheral),
              peripheral => setTimeout(this.setStatus.bind(this), 600, 'The peripheral unexpectedly disconnected'),
              
              
            );
           
  
           
          }
          
        
          // the connection to the peripheral was successful
          onConnected(peripheral) {
        
            this.peripheral = peripheral;
            this.setStatus('Connected to ' + (peripheral.name || peripheral.id));
            
            /*let subscription = this.ble.startNotification(peripheral.id, WRITE_CHARACTERISTIC_UUID, READ_CHARACTERISTIC_UUID);
            
                    subscription.subscribe(buffer => {
                        let data = new Uint32Array(buffer);
                        console.log(data[0]); 
                    })*/

            this.ble.write(this.peripheral.id, WRITE_SERVICE_UUID, WRITE_CHARACTERISTIC_UUID, REALTIME_META_VALUE).then(
              data => this.onTemperatureChange(REALTIME_META_VALUE),
              () => this.showAlert('Unexpected Error', 'nothing')
            )
           
            // Read the current value of the temperature characteristic
            this.ble.read(this.peripheral.id, READ_SERVICE_UUID, READ_CHARACTERISTIC_UUID).then(
              data => this.onTemperatureChange(data),
              () => this.showAlert('Unexpected Error', 'Failed to get temperature')
            )
            // Subscribe for notifications when the temperature changes
            
            //this.ble.startNotification(this.peripheral.id, '1a00', '1a01').subscribe(buffer => { 
             // console.log(String.fromCharCode.apply(null, new Uint8Array(buffer))); });
           
          }
        
          onTemperatureChange(buffer:ArrayBuffer) {
            
                // Temperature is a 4 byte floating point value
                var data = new Uint8Array(buffer);
                console.log(data[0]);
            
                this.ngZone.run(() => {
                  this.temperature = (data[1] * 256 + data[0]) / 10;
                  this.moisture = data[7];
                  this.light =  data[4] * 256 + data[3] ;
                  this.conductivity = data[9] * 256 + data[8];
                  
                });
                
            
              }
          

        
              Submit() {
                var link = 'http://selfeden.fr/api1.php';
                var myData = JSON.stringify({userId: this.userId,Mac_Address: this.data1.Mac_Address,date: this.data1.date,SerialNumber: this.SerialNumber, sensorName: this.data1.sensorName,Lat: this.data1.Lat, Lng: this.data1.Lng});
                
                let headers = new Headers(
                  {
                    'Content-Type' : 'application/json'
                  });
                let options = new RequestOptions({ headers: headers });
                
              
                
                return new Promise((resolve, reject) => {
                  this.http.post(link, myData, options)
                  .toPromise()
                  .then((response) =>
                  {
                    console.log('API Response : ', response.json());
                    resolve(response.json());
                  })
                  .catch((error) =>
                  {
                    console.error('API Error : ', error.status);
                    console.error('API Error : ', JSON.stringify(error));
                    reject(error.json());
                  });
                });
                
                }
          
          // Disconnect peripheral when leaving the page
         
          ionViewDidLoad() {
           
            console.log("ionViewDidLoad AboutPage");
            this.geo.getCurrentPosition().then( pos => {
              this.lat = pos.coords.latitude;
              this.lng = pos.coords.longitude;
            }).catch( err => console.log(err));
          }
          
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
