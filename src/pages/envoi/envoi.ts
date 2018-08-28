import { Component } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EnvoiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-envoi',
  templateUrl: 'envoi.html',
})
export class EnvoiPage {
    //Déclaration des variables
    data1: any = {};
    data2: any = {};
    data3: any = {};
    data4: any = {};
    data5: any = {};
    data6: any = {};
    data7: any = {};
    data8: any = {};
    data9: any = {};
   
  
    constructor(public navCtrl: NavController, public navParams: NavParams,  public http: Http) {
      //Assignation des variables
      this.data1.VTemp = '';
      this.data2.MTemp = '';
      this.data3.VLux = '';
      this.data4.MLux = '';
      this.data5.VEc = '';
      this.data6.MEc = '';
      this.data7.VHR = '';
      this.data8.MHR = '';
      this.data9.nb_capteur = '';
  
      this.http = http;
    }


    //Méthode qui permet d'envoyer les informations dans la base de données
    Submit() {
      //variable contenant le lien de notre page php(page dans laquelle nous effectuer chacune des requêtes)
      var link = 'http://selfeden.fr/apiConfig.php';
      //variable contenant les données que nous allons poster
      var myData = JSON.stringify({VTemp: this.data1.VTemp, VLux:  this.data3.VLux, VEc:  this.data5.VEc,  VHR:  this.data7.VHR, MTemp: this.data2.MTemp, MLux:  this.data4.MLux, MEc:  this.data6.MEc, MHR:  this.data8.MHR, nb_capteur: this.data9.nb_capteur});
      
      console.log(myData);
      
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

    // Méthode permettant de charger la page 
    ionViewDidLoad() {
      console.log('ionViewDidLoad EnvoiPage');
    }
  
  }
  