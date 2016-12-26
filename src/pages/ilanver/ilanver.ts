import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

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
  public staticMapSrc;
  public minDate = new Date().toISOString(); //1996-12-19 gibi formatda
  public maxDate = new Date().getFullYear() + 1; //2018 gibi formatda

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public angularFire: AngularFire, public baseService: BaseService) {
  }

  ionViewDidLoad() {
    this.ilanlar = this.angularFire.database.list("ilanlar");
    this.staticMapSrc = this.baseService.staticMapAddMarkers(this.ilanData);
  }

  gonder() {
    if (
      //hem null hemde "" boş olursa uyarı
      this.ilanData.aciklama == null || this.ilanData.aciklama == "" ||
      this.ilanData.ilaninSonaErmeTarihi == null || this.ilanData.ilaninSonaErmeTarihi == "" ||
      this.ilanData.yukCinsi == null || this.ilanData.yukCinsi == "" ||
      this.ilanData.tonaj == null || this.ilanData.tonaj == "" ||
      this.ilanData.tonajTuru == null || this.ilanData.tonajTuru == ""
    ) {
      this.baseService.presentAlert("Lütfen Bilgileri Eksiksiz Giriniz");
    } else {
      this.ilanData.ilaniVerenKullaniciId = this.angularFire.auth.getAuth().uid;
      this.ilanlar.push(this.ilanData).then((data: any) => {
        //console.log(data);
        this.baseService.presentToast("Kaydınız Başarıyla Alınmıştır...");
        this.navCtrl.setRoot(AnasayfaPage);
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  showAddressModal(neresiIcin: string) {
    let modal = this.modalCtrl.create(AutocompletePage);
    modal.onDidDismiss((locationData: any) => {
      if (locationData) {
        if (neresiIcin == "nereden") {
          this.ilanData.baslangic = locationData;
        } else {//neresiIcin == "nereye" olur
          this.ilanData.bitis = locationData;
        }
      }
      this.addStaticMapMarker();
    });
    modal.present();
  }

  ikinciAsamayaGec() {
    //this.ilanData.baslangic = true;
    //this.ilanData.bitis = true;
    if (this.ilanData.baslangic && this.ilanData.bitis) {
      this.aktifAsamaIndex = 2;
    } else {
      this.baseService.presentAlert("lütfen Başlangıç ve Bitiş noktası seçiniz");
    }
  }

  geriAsamayaGit() {
    this.aktifAsamaIndex = 1;
  }

  ilanIptal() {
    this.navCtrl.pop();
  }

  addStaticMapMarker(markerType?: string) {
    this.staticMapSrc = this.baseService.staticMapAddMarkers(this.ilanData);
    console.log(this.staticMapSrc);
  }

  /*
  // Haritayı yalnızca görünüm başlatıldıktan sonra yükle ngAfterViewInit()
  initMap() {
    let element: HTMLElement = document.getElementById('map');
    this.map = new GoogleMap(element, {
      center: { lat: 41.008238, lng: 28.978359 },
      //zoom: 10
    });
    // listen to MAP_READY event
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.baseService.presentToast("MAPS HAZIR", 3000);
    });

    this.map.clear();
    this.map.setClickable(false);
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

    this.map.moveCamera({
      target: latLngBounds,
    });
    this.map.animateCamera({
      duration: 1000
    })
    this.map.setClickable(false); // tıklamayı engeller
  }
  */
}
