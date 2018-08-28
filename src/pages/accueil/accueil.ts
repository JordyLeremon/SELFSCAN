import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContactPage } from '../contact/contact';
import { ScanPage } from '../scan/scan';

/**
 * Generated class for the AccueilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-accueil',
  templateUrl: 'accueil.html',
})
export class AccueilPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  // Méthode permettant de charger la page
  ionViewDidLoad() {
    console.log('ionViewDidLoad AccueilPage');
  }
  
  //Méthode nous permettant d'aller sur une autre page
  Submit() {
    this.navCtrl.push(ContactPage)
  }

  //Méthode nous permettant d'aller sur une autre page
  Send() {
    this.navCtrl.push(ScanPage)
  }
}
