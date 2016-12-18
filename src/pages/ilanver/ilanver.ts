import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, GoogleMapsMarkerOptions, GoogleMapsMarker } from 'ionic-native';

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
    modal.onDidDismiss((locationData: any) => {
      if (locationData) {
        if (neresiIcin == "nereden") {
          this.ilanData.baslangic = locationData;
        } else {//neresiIcin == "nereye" olur
          this.ilanData.bitis = locationData;
        }
      }
      if(this.ilanData.baslangic && this.ilanData.bitis) {
        //this.ngAfterViewInit();
        console.log("map guncellenmeli bu aşamada lat lng degerleri gönderilmeli");
      }
    });
    modal.present();
  }

  ikinciAsamayaGec() {
    if (this.ilanData.baslangic && this.ilanData.bitis) {
      this.aktifAsamaIndex = 2;
    } else {
      this.baseService.presentAlert("lütfen Başlangıç ve Bitiş noktası seçiniz");
    }
  }

  geriAsamayaGit() {
    this.aktifAsamaIndex = this.aktifAsamaIndex - 1;
    console.log(this.aktifAsamaIndex);
  }

  ilanIptal() {
    this.navCtrl.pop();
  }

  // Haritayı yalnızca görünüm başlatıldıktan sonra yükle ngAfterViewInit
  ngAfterViewInit() {
    let element: HTMLElement = document.getElementById('map');

    let map = new GoogleMap(element,{});

    // listen to MAP_READY event
    map.one(GoogleMapsEvent.MAP_READY).then(() => this.baseService.presentToast("MAPS HAZIR",3000));

    /*
    var lat = this.ilanData.baslangic.location.lat ? this.ilanData.baslangic.location.lat : 41.015137;
    var lng = this.ilanData.baslangic.location.lng ? this.ilanData.baslangic.location.lng : 28.979530;
    */

    // create LatLng object
    let latlng: GoogleMapsLatLng = new GoogleMapsLatLng(41.008238, 28.978359);
    /*
    latlng.lat = this.ilanData.baslangic.location.lat;
    latlng.lng = this.ilanData.baslangic.location.lng;
    */

    // create CameraPosition
    /*
    let position: CameraPosition = {
      target: latlng,
      zoom: 9,
      tilt: 30
    };

    // move the map's camera to position
    map.moveCamera(position);
    */

    // create new marker
    let markerOptions: GoogleMapsMarkerOptions = {
      position: latlng,
      title: "Seçilen Adres"
    };

    map.addMarker(markerOptions)
      .then((marker: GoogleMapsMarker) => {
        marker.showInfoWindow();
      });
  }
}
