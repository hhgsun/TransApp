import { Component } from '@angular/core';
import { NavParams, AlertController } from 'ionic-angular';
import { LaunchNavigator } from 'ionic-native';

import { AngularFire } from 'angularfire2';

import { BaseService } from '../services/service'

@Component({
    selector: 'page-ilandetay',
    templateUrl: 'ilandetay.html'
})
export class IlandetayPage {
    public ilan = null; //secilenIlan
    public aktifKullaniciId = null;
    public ilanSuresiBitmis = false;
    public staticMapSrc;

    constructor(public navParams: NavParams, public alertCtrl: AlertController, public angularFire: AngularFire, public baseService: BaseService) {
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
        console.log("Map Aç");

        LaunchNavigator.navigate(
            [this.ilan.baslangic.location.lat, this.ilan.baslangic.location.lng],
            [this.ilan.bitis.location.lat, this.ilan.bitis.location.lng]
        ).then(
            success => console.log('Launched navigator'),
            error => console.log('Error launching navigator', error)
            );
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