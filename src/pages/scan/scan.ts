import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import {Http, Headers, RequestOptions} from '@angular/http';
import { EnvoiPage } from '../envoi/envoi';
 

@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html'
})
export class ScanPage {
  qrData = null;
  createdCode = null;
  scannedCode: string;
  data1: any = {};
  data2: any = {};
  data3: any = {};
  data4: any = {};
  data5: any = {};
  data6: any = {};
  data7: any = {};
  data8: any = {};
  data9: any = {};
  data10: any = {};
  data11: any = {};
  data12: any = {};
  data13: any = {};
  data14: any = {};
  data15: any = {};
  data16: any = {};
  data17: any = {};
  constructor(public navCtrl: NavController, private barcodeScanner: BarcodeScanner, public navParams: NavParams, 
    public http: Http) {

      this.data1.Mac_Address = '';
      this.data2.Mac_Address = '';
      this.data3.Mac_Address = '';
      this.data4.Mac_Address = '';
      this.data5.Mac_Address = '';
      this.data6.Mac_Address = '';
      this.data7.Mac_Address = '';
      this.data8.Mac_Address = '';
      this.data9.Mac_Address = '';
      this.data10.Mac_Address = '';
      this.data11.Mac_Address = '';
      this.data12.Mac_Address = '';
      this.data13.Mac_Address = '';
      this.data14.Mac_Address = '';
      this.data15.Mac_Address = '';
      this.data16.Sim_Card = '';
      this.data17.Num_user = '';
      
      this.http= http;

  }
  createCode() {
    this.createdCode = this.qrData;
  }
 
  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;
    }, (err) => {
        console.log('Error: ', err);
    });
  }
  
Submit() {

  var link = 'http://selfeden.fr/api2.php';
  
  var myData = JSON.stringify({Mac_Address: this.data1.Mac_Address, Mac_Address2:  this.data2.Mac_Address, Mac_Address3:  this.data3.Mac_Address, Mac_Address4:  this.data4.Mac_Address, Mac_Address5:  this.data5.Mac_Address, Mac_Address6:  this.data6.Mac_Address, Mac_Address7:  this.data7.Mac_Address, Mac_Address8:  this.data8.Mac_Address, Mac_Address9:  this.data9.Mac_Address, Mac_Address10:  this.data10.Mac_Address, Mac_Address11:  this.data11.Mac_Address, Mac_Address12:  this.data12.Mac_Address, Mac_Address13:  this.data13.Mac_Address, Mac_Address14:  this.data14.Mac_Address, Mac_Address15:  this.data15.Mac_Address, Sim_Card: this.data16.Sim_Card, Num_user: this.data17.Num_user});
  
  
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
  
  

  nextpage(){
    this.navCtrl.push(EnvoiPage)
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanPage');
  }

}
