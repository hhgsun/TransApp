import { Component } from '@angular/core';
import { NavParams, AlertController, Platform } from 'ionic-angular';

import { AngularFire } from 'angularfire2';

import {
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapsLatLng,
    GoogleMapsMarkerOptions,
    GoogleMapsMarker,
    GoogleMapsLatLngBounds
} from 'ionic-native';

import { BaseService } from '../services/service'

@Component({
    selector: 'page-ilandetay',
    templateUrl: 'ilandetay.html'
})
export class IlandetayPage {
    public ilan = null; //secilenIlan
    public aktifKullaniciId = null;
    public map: GoogleMap;

    constructor(public navParams: NavParams, public alertCtrl: AlertController, public angularFire: AngularFire, public platform: Platform, public baseService: BaseService) {
        this.ilan = this.navParams.get("item");
        this.angularFire.auth.subscribe(aktifKullanici => {
            this.aktifKullaniciId = aktifKullanici.uid;
        })
        this.platform.ready().then(() => {
            this.installMap();
        })
    }

    teklifVerAlert() {
        let prompt = this.alertCtrl.create({
            title: 'Fiyat Teklifi Ver',
            // message: "",
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
        prompt.present();
    }

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
            });
        // -------

        // bounds: sınırlar, kamera genişliği
        var latLngBounds = new GoogleMapsLatLngBounds([neredenLatLng, nereyeLatLng]);

        //this.map.moveCamera({target: latLngBounds....}); veya animateCamera({..})
        this.map.animateCamera({
            target: latLngBounds,
            tilt: 30,
            duration: 1000,
            bearing: 15,
        });
    }

}