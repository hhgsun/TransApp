import { Component } from '@angular/core';
import { NavParams, AlertController, NavController } from 'ionic-angular';
import { LaunchNavigator } from 'ionic-native';

import { AngularFire } from 'angularfire2';

import { BaseService } from '../services/service'
import { IlanverPage } from '../ilanver/ilanver'

@Component({
    selector: 'page-ilandetay',
    templateUrl: 'ilandetay.html'
})
export class IlandetayPage {
    public ilan = null; //secilenIlan
    public aktifKullaniciId = null;
    public ilanSuresiBitmis = false;
    public staticMapSrc;

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public angularFire: AngularFire, public baseService: BaseService) {
        this.ilan = this.navParams.get("item");
        this.angularFire.auth.subscribe(aktifKullanici => {
            this.aktifKullaniciId = aktifKullanici.uid;
        })
        var datenow = new Date().toISOString(); //2017-12-31 formatında olmalı
        if (this.ilan.ilaninSonaErmeTarihi < datenow) this.ilanSuresiBitmis = true; else this.ilanSuresiBitmis = false;
        this.staticMapSrc = this.baseService.staticMapShowMarkers(this.ilan.baslangic, this.ilan.bitis);
    }

    teklifVerAlert() {
        //this.map.setVisible(false);
        let prompt = this.alertCtrl.create({
            title: 'Fiyat Teklifi Ver',
            // message: "5000",
            inputs: [
                {
                    name: 'fiyat',
                    placeholder: 'Fiyat',
                    type: 'number'
                },
                {
                    name: 'mesaj',
                    placeholder: 'Kısaca Mesajınız',
                    type: 'text'
                }
            ],
            buttons: [
                {
                    text: 'Vazgeç',
                    handler: data => {
                        console.log('Teklif vermekten vazçildi');
                    }
                },
                {
                    text: 'Gönder',
                    handler: data => {
                        data["teklifVerenKullaniciId"] = this.aktifKullaniciId;
                        console.log(data);
                    }
                }
            ]
        });
        prompt.onDidDismiss(() => {
            //this.map.setVisible(true);
        })
        prompt.present();
    }

    ilanVerenDetay() {
        this.baseService.presentAlert("İlan Verenin Profili");
    }

    mapDetay() {
        LaunchNavigator.navigate([this.ilan.bitis.location.lat, this.ilan.bitis.location.lng], {
            start: [this.ilan.baslangic.location.lat, this.ilan.baslangic.location.lng]
        }).then(
            success => console.log('Cihazdaki Uygulama Çalıştı'),
            error => console.log('Cihazınızda uygun uygulama bulunamadı', error)
            );
    }

    duzenle() {
        this.navCtrl.push(IlanverPage, {
            item: this.ilan
        })
    }

    sil() {
        var _alert = this.alertCtrl.create({
            title: 'İlanı Silmek İstediğinize Eminmisiniz ?',
            message: "Bu ilana ait tüm veriler silinecektir",
            buttons: [
                {
                    text: 'Vazgeç',
                    handler: data => {
                        console.log('Silmekten vazçildi');
                    }
                },
                {
                    text: 'Sil',
                    handler: data => {
                        var silinecekIlan = this.angularFire.database.object("ilanlar/" + this.ilan.$key);
                        silinecekIlan.remove().then(data => {
                            this.navCtrl.pop();
                            this.baseService.presentToast("İlanınız Başarıyla Silinmiştir...");
                        }).catch(err => {
                            alert("Silme İşleminde Bir Hata Oluştu: " + err);
                        })
                    }
                }
            ]
        })
    }

    /*
    installMap() {
        let element: HTMLElement = document.getElementById('map');
        this.map = new GoogleMap(element);
        this.map.clear();
        // listen to MAP_READY event
        this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
            this.initMap();
        });
    }

    initMap() {
        this.baseService.presentToast("MAP HAZIR init");
        let neredenLatLng = new GoogleMapsLatLng(this.ilan.baslangic.location.lat, this.ilan.baslangic.location.lng);
        let nereyeLatLng = new GoogleMapsLatLng(this.ilan.bitis.location.lat, this.ilan.bitis.location.lng);

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
            title: this.ilan.baslangic.adres
        };
        this.map.addMarker(marker1Options)
            .then((marker: GoogleMapsMarker) => {
                marker.showInfoWindow();
            });
        // -------

        // marker 2
        let marker2Options: GoogleMapsMarkerOptions = {
            position: nereyeLatLng,
            title: this.ilan.bitis.adres
        };
        this.map.addMarker(marker2Options)
            .then((marker: GoogleMapsMarker) => {
                marker.setIcon("../assets/img/flag.png");
                marker.showInfoWindow();
                marker.setFlat(true);
            });
        // -------

        // bounds: sınırlar, kamera genişliği
        var latLngBounds = new GoogleMapsLatLngBounds([neredenLatLng, nereyeLatLng]);
        this.map.moveCamera({
            target: latLngBounds,
        });
        this.map.animateCamera({
            duration: 1000
        })
        this.map.setClickable(false); // tıklamayı engeller
        this.map.setZoom(25);
    }
    */

}