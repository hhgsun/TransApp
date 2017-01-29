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
    public teklifler = [];
    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public angularFire: AngularFire, public baseService: BaseService) {
        this.ilan = this.navParams.get("item");
        this.angularFire.auth.subscribe(aktifKullanici => {
            this.aktifKullaniciId = aktifKullanici.uid;
        })
        var datenow = new Date().toISOString(); //2017-12-31 formatında olmalı
        if (this.ilan.ilaninSonaErmeTarihi < datenow) this.ilanSuresiBitmis = true; else this.ilanSuresiBitmis = false;
        this.staticMapSrc = this.baseService.staticMapShowMarkers(this.ilan.baslangic, this.ilan.bitis);
        this.teklifleriYukle();
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
                        this.angularFire.database.list("ilanlar/" + this.ilan.$key + "/teklifler")
                            .push(data).then(() => {
                                this.baseService.presentToast("Teklifiniz ilan sahibine gönderildi");
                            }).catch(err => {
                                console.log(err.message)
                            })
                    }
                }
            ]
        });
        prompt.onDidDismiss(() => {
            //this.map.setVisible(true);
        })
        prompt.present();
    }

    teklifleriYukle() {
        this.angularFire.database.list("ilanlar/" + this.ilan.$key + "/teklifler").subscribe(teklifler => {
            this.teklifler = teklifler;
        })
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
        });
        _alert.present();
    }

}