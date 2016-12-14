import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { BaseService } from '../services/service'

import { AutocompletePage } from '../components/autocomplete'


@Component({
  selector: 'page-ilanver',
  templateUrl: 'ilanver.html'
})
export class IlanverPage {
  ilanlar: FirebaseListObservable<any>;
  public ilanData: any = {};
  public aktifAsamaIndex = 1; //ilan verme 2 aşamadan oluyor 1.aşamada nereden nereye 2. aşama diğer detaylar belki 3,4..aşamalar olur

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public angularFire: AngularFire, public baseService: BaseService) {

  }

  ionViewDidLoad() {
    this.ilanlar = this.angularFire.database.list("ilanlar");
  }

  gonder() {
    this.ilanData.ilaniVerenKullaniciId = this.angularFire.auth.getAuth().uid;
    this.ilanlar.push(this.ilanData).then((data: any) => {
      //console.log(data);
      this.baseService.presentToast("Kaydınız Başarıyla Alınmıştır...");
      this.navCtrl.pop();
    }).catch((err) => {
      console.log(err);
    });
  }

  showAddressModal(neresiIcin: string) {
    let modal = this.modalCtrl.create(AutocompletePage);
    //let me = this;
    modal.onDidDismiss(data => {
      if (data) {
        if (neresiIcin == "nereden") {
          this.ilanData.baslangicYeri = data;
        } else {//neresiIcin == "nereye" olur
          this.ilanData.bitisYeri = data;
        }
      }
    });
    modal.present();
  }
  
  ikinciAsamayaGec() {
    console.log(this.ilanData);
    if (this.ilanData.baslangicYeri && this.ilanData.bitisYeri) {
      this.aktifAsamaIndex = 2;
    } else {
      this.baseService.presentAlert("Lütfen alanları dikkatli doldurunuz");
    }
    console.log(this.aktifAsamaIndex);
  }

  geriAsamayaGit() {
    this.aktifAsamaIndex = this.aktifAsamaIndex - 1;
    console.log(this.aktifAsamaIndex);
  }

  ilanIptal() {
    this.navCtrl.pop();
  }
}
