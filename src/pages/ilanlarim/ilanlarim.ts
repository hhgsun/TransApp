import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';

import { IlandetayPage } from '../ilandetay/ilandetay'

@Component({
    selector: 'page-ilanlarim',
    templateUrl: 'ilanlarim.html'
})
export class IlanlarimPage {
    public aktifKullaniciID: string;
    public ilanlarim: any = [];
    public ilanSayisi = 10;
    public infiniteDahaFazla2 = true;
    public gelenIlanlarLength2 = 0;

    constructor(public angularFire: AngularFire, public navController: NavController) {
        this.angularFire.auth.subscribe(data => {
            this.aktifKullaniciID = data.uid;
        })
        this.loadIlanlar();
    }

    loadIlanlar() {
        this.angularFire.database.list("ilanlar", {
            query: {
                limitToLast: this.ilanSayisi,
                orderByChild: "ilaniVerenKullaniciId",
                startAt: this.aktifKullaniciID,
                endAt: this.aktifKullaniciID
            }
        }).subscribe((gelenIlanlar) => {
            // her loadIlanlardan gelen ilanların length ini tutarız önceki ile eşit ise btnDahaFazla false olur
            if (this.gelenIlanlarLength2 == gelenIlanlar.length) {
                this.infiniteDahaFazla2 = false;
            } else {
                this.gelenIlanlarLength2 = gelenIlanlar.length;
            }
            gelenIlanlar.reverse(); // gelen ilanları ters çeviriyoruz
            this.ilanlarim = []; // herdefasında veriyi sıfırlarız ki üzerine ekleme yapmasın
            gelenIlanlar.forEach(ilan => {
                this.angularFire.database.object("users/" + ilan["ilaniVerenKullaniciId"]).subscribe(user => {
                    ilan["ilaniVerenKullanici"] = user;
                    this.ilanlarim.push(ilan);
                });
            });
        })
        this.ilanSayisi = this.ilanSayisi + 10;
    }

    ilanDetay(ilan) {
        this.navController.push(IlandetayPage, {
            item: ilan
        })
    }

    doRefresh(refresher) {
        this.ilanSayisi = 10;
        this.infiniteDahaFazla2 = true;
        setTimeout(() => {
            this.loadIlanlar();
            refresher.complete();
        }, 2000);
    }

    doInfinite(infiniteScroll) {
        setTimeout(() => {
            this.loadIlanlar();
            infiniteScroll.complete();
        }, 500);
    }
}

