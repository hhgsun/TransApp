import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { BaseService } from '../services/service'

@Component({
  selector: 'page-ilanver',
  templateUrl: 'ilanver.html'
})
export class IlanverPage {
  ilanlar:FirebaseListObservable<any>;
  public ilanData:any = {};
  constructor(public navCtrl: NavController, public angularFire:AngularFire, public baseService:BaseService) {}

  ionViewDidLoad() {
    console.log('Hello IlanverPage Page');
    this.ilanlar = this.angularFire.database.list("ilanlar"); 
  }

  ekle(){
    this.ilanData.ilaniVerenKullaniciId = this.angularFire.auth.getAuth().uid;
    this.ilanlar.push(this.ilanData).then((data:any)=>{
      //console.log(data);
      this.baseService.presentToast("Kaydınız Başarıyla Alınmıştır...");
      this.navCtrl.pop();
    }).catch((err)=>{
      console.log(err);
    });
  }

}
