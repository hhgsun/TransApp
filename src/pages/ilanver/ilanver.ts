import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Platform } from 'ionic-angular';

import {
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapsLatLng,
  GoogleMapsMarkerOptions,
  GoogleMapsMarker,
  GoogleMapsLatLngBounds
} from 'ionic-native';

import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { BaseService } from '../services/service'

import { AutocompletePage } from '../components/autocomplete'
import { AnasayfaPage } from '../anasayfa/anasayfa'

@Component({
  selector: 'page-ilanver',
  templateUrl: 'ilanver.html'
})
export class IlanverPage {
  ilanlar: FirebaseListObservable<any>;
  public ilanData: any = {};
  public aktifAsamaIndex = 1; //ilan verme 2 aşamadan oluyor 1.aşamada nereden nereye 2. aşama diğer detaylar belki 3,4..aşamalar olur
  public map: GoogleMap;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public angularFire: AngularFire, public navParams: NavParams, public baseService: BaseService, public platform: Platform) {
    var gelenAsama = this.navParams.get("asama");
    if (gelenAsama) {
      this.aktifAsamaIndex = gelenAsama;
      this.ilanData = this.navParams.get("ilanData"); //sıfır veri olan ilanData ya gelen ilanDatayı eşitliyoruz
      this.baseService.presentToast(this.aktifAsamaIndex + ".Aşama");
    }
    this.platform.ready().then(() => {
      this.initMap();
    })
  }

  ionViewDidLoad() {
    this.ilanlar = this.angularFire.database.list("ilanlar");
  }

  gonder() {
    this.ilanData.ilaniVerenKullaniciId = this.angularFire.auth.getAuth().uid;
    this.ilanlar.push(this.ilanData).then((data: any) => {
      //console.log(data);
      this.baseService.presentToast("Kaydınız Başarıyla Alınmıştır...");
      this.navCtrl.setRoot(AnasayfaPage);
    }).catch((err) => {
      console.log(err);
    });
  }

  showAddressModal(neresiIcin: string) {
    let modal = this.modalCtrl.create(AutocompletePage);
    this.map.setVisible(false); // burda haritayı gizliyoruz çünkü modal açılınca modalda yapılan işlem haritayada uygulanıyor.
    modal.onDidDismiss((locationData: any) => {
      this.map.setVisible(true); // modal kapanınca harita yeniden görünür oluyor
      if (locationData) {
        if (neresiIcin == "nereden") {
          this.ilanData.baslangic = locationData;
        } else {//neresiIcin == "nereye" olur
          this.ilanData.bitis = locationData;
        }
      }
      if (this.ilanData.baslangic && this.ilanData.bitis) {
        this.addMapCustom();
      }
    });
    modal.present();
  }

  ikinciAsamayaGec() {
    if (this.ilanData.baslangic && this.ilanData.bitis) {
      this.navCtrl.push(IlanverPage, {
        asama: 2,
        ilanData: this.ilanData
        //sayfa nav.push edilince ilanData sıfırlanıyor, bizde parametre olarak yolluyoruz sonra ilanData ya eşitlemek için 
      });
    } else {
      this.baseService.presentAlert("lütfen Başlangıç ve Bitiş noktası seçiniz");
    }
  }

  geriAsamayaGit() {
    this.navCtrl.pop();
  }

  ilanIptal() {
    this.navCtrl.setRoot(AnasayfaPage);
  }

  // Haritayı yalnızca görünüm başlatıldıktan sonra yükle ngAfterViewInit()
  initMap() {
    let element: HTMLElement = document.getElementById('map');
    this.map = new GoogleMap(element, {
      center: { lat: 41.008238, lng: 28.978359 },
      zoom: 10
    });
    // listen to MAP_READY event
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.baseService.presentToast("MAPS HAZIR", 3000);
    });
    this.map.clear();
  }

  addMapCustom() {
    this.map.clear();
    let neredenLatLng = new GoogleMapsLatLng(this.ilanData.baslangic.location.lat, this.ilanData.baslangic.location.lng);
    let nereyeLatLng = new GoogleMapsLatLng(this.ilanData.bitis.location.lat, this.ilanData.bitis.location.lng);

    // Polyline
    this.map.addPolyline({
      points: [
        neredenLatLng,
        nereyeLatLng
      ],
      color: '#387ef5',
      width: 5,
      googledesic: true
    })

    // marker 1
    let marker1Options: GoogleMapsMarkerOptions = {
      position: neredenLatLng,
      title: this.ilanData.baslangic.adres
    };
    this.map.addMarker(marker1Options)
      .then((marker: GoogleMapsMarker) => {
        marker.showInfoWindow();
      });

    // marker 2
    let marker2Options: GoogleMapsMarkerOptions = {
      position: nereyeLatLng,
      title: this.ilanData.bitis.adres
    };
    this.map.addMarker(marker2Options)
      .then((marker: GoogleMapsMarker) => {
        marker.showInfoWindow();
      });

    // bounds: sınırlar, kamera genişliği
    var latLngBounds = new GoogleMapsLatLngBounds([neredenLatLng, nereyeLatLng]);
    //this.map.moveCamera({target: latLngBounds....});
    this.map.animateCamera({
      target: latLngBounds,
      tilt: 30,
      duration: 1000,
      bearing: 15
    });
  }

}
