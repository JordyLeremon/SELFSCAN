import { Component} from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {HomePage} from '../home/home';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  peripheral: any = {};
  userId: any[] = [];
  SerialNumber: any[] = [];
  statusMessage: string;
  data2:any = {};
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
   ) {
    
}

ionViewDidLoad() {
  console.log("ionViewDidLoad HomePage");
}
nextPage() {
  this.navCtrl.push(HomePage,{
  userId: this.userId,
  SerialNumber: this.SerialNumber
  });
}
}