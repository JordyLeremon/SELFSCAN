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
    data01: any = {};
    data02: any = {};
    data03: any = {};
    data04: any = {};
    data05: any = {};
    data06: any = {};
    data07: any = {};
    data08: any = {};
    data09: any = {};
   
  
    constructor(public navCtrl: NavController, public navParams: NavParams,  public http: Http) {
      //Assignation des variables
      this.data01.VTemp = '';
      this.data02.MTemp = '';
      this.data03.VLux = '';
      this.data04.MLux = '';
      this.data05.VEc = '';
      this.data06.MEc = '';
      this.data07.VHR = '';
      this.data08.MHR = '';
      this.data09.nb_capteur = '';
  
      this.http = http;
    }


    //Méthode qui permet d'envoyer les informations dans la base de données
    Submit() {
      //variable contenant le lien de notre page php(page dans laquelle nous effectuer chacune des requêtes)
      var link = 'http://selfeden.fr/apiConfig.php';
      //variable contenant les données que nous allons poster
      var myData = JSON.stringify({VTemp: this.data01.VTemp, VLux:  this.data03.VLux, VEc:  this.data05.VEc,  VHR:  this.data07.VHR, MTemp: this.data02.MTemp, MLux:  this.data04.MLux, MEc:  this.data06.MEc, MHR:  this.data08.MHR, nb_capteur: this.data09.nb_capteur});
      
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
  