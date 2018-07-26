import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AboutPage} from '../about/about';
import {HomePage}from '../home/home';
import { Geolocation } from '@ionic-native/geolocation';
import { Http, Headers, RequestOptions } from '@angular/http';

/**
 * Generated class for the SendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-send',
  templateUrl: 'send.html',
})
export class SendPage {
  data:any = {};
  lat: any;
  lng: any;
  device: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,public geo: Geolocation) {
    this.device = this.navParams.get('device');
    this.data.userId= '';
    this.data.Mac_Address= '';
    this.data.date= '';
    this.data.sensorName= '';
    this.data.SerialNumber= '';
    this.data.Lat= '';
    this.data.Lng= '';
    this.data.response = '';
    
  
    this.http = http;

  }
  Submit() {
    var link = 'http://selfeden.fr/api1.php';
    var myData = JSON.stringify({userId: this.data.userId,Mac_Address: this.data.Mac_Address,date: this.data.date,SerialNumber: this.data.SerialNumber, sensorName: this.data.sensorName,Lat: this.data.Lat, Lng: this.data.Lng});
    //var myData1 = JSON.stringify({Position_GPS: this.data.Position_GPS});
    //var myData2 = JSON.stringify({Mac_Address: this.data.Mac_Address});
    //var myData3 = JSON.stringify({date: this.data.date});
    //var myData4 = JSON.stringify({sensorName: this.data.sensorName});
    //var myData5 = JSON.stringify({N_Série: this.data.N_Série});
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
    test() {
      this.navCtrl.push(AboutPage);
    }
    

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendPage');
    this.geo.getCurrentPosition().then( pos => {
      this.lat = pos.coords.latitude;
      this.lng = pos.coords.longitude;
    }).catch( err => console.log(err));
    
  }
  

}
