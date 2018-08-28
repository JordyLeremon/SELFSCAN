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
  //Déclaration des variables
  data:any = {};
  lat: any;
  lng: any;
  device: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,public geo: Geolocation) {
    //Assignation des variables
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
  //Méthode qui permet d'envoyer les informations dans la base de données
  Submit() {
    //variable contenant le lien de notre page php(page dans laquelle nous effectuer chacune des requêtes)
    var link = 'http://selfeden.fr/apiInstall.php';
    //variable contenant les données que nous allons poster
    var myData = JSON.stringify({userId: this.data.userId,Mac_Address: this.data.Mac_Address,date: this.data.date,SerialNumber: this.data.SerialNumber, sensorName: this.data.sensorName,Lat: this.data.Lat, Lng: this.data.Lng});
   
    let headers = new Headers(
      {
        'Content-Type' : 'application/json'
      });
    let options = new RequestOptions({ headers: headers });
    
  
    //Méthode nous permettant d'effectuer nos post
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

    //Méthode nous permettant d'aller sur une autre page 
    test() {
      this.navCtrl.push(AboutPage);
    }
    
  // Méthode permettant de charger la page 
  ionViewDidLoad() {
    console.log('ionViewDidLoad SendPage');
    this.geo.getCurrentPosition().then( pos => {
      this.lat = pos.coords.latitude;
      this.lng = pos.coords.longitude;
    }).catch( err => console.log(err));
    
  }
  

}
