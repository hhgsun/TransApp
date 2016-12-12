import { Component } from '@angular/core';
import { NavParams, AlertController } from 'ionic-angular';

import { AngularFire } from 'angularfire2';

@Component({
    selector: 'page-ilandetay',
    templateUrl: 'ilandetay.html'
})
export class IlandetayPage {
    public ilan = null; //secilenIlan
    public aktifKullaniciId = null;
    constructor(public navParams: NavParams, public alertCtrl:AlertController, public angularFire:AngularFire) {
        this.ilan = this.navParams.get("item");
        this.angularFire.auth.subscribe(aktifKullanici =>{
            this.aktifKullaniciId = aktifKullanici.uid;
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
}