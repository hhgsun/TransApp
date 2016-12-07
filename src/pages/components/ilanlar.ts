import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';

import { IlanDetayComponent } from '../components/ilandetay'

@Component({
    selector: 'ilanlar',
    templateUrl: 'ilanlar.html'
})
export class IlanlarComponent {
    public ilanlar: any = [];
    public ilanSayisi = 10;
    public infiniteDahaFazla = true;
    public gelenIlanlarLength = 0;

    constructor(public angularFire: AngularFire, public navController: NavController) {
        this.loadIlanlar();
    }

    loadIlanlar() {
        this.angularFire.database.list("ilanlar", {
            query: { limitToLast: this.ilanSayisi }
        }).subscribe((gelenIlanlar) => {
            // her loadIlanlardan gelen ilanların length ini tutarız önceki ile eşit ise btnDahaFazla false olur
            if (this.gelenIlanlarLength == gelenIlanlar.length) {
                this.infiniteDahaFazla = false;
            } else {
                this.gelenIlanlarLength = gelenIlanlar.length;
            }
            gelenIlanlar.reverse(); // gelen ilanları ters çeviriyoruz
            this.ilanlar = []; // herdefasında veriyi sıfırlarız ki üzerine ekleme yapmasın
            var i = 0;
            gelenIlanlar.forEach(ilan => {
                this.angularFire.database.object("users/" + ilan["ilaniVerenKullaniciId"]).subscribe(user => {
                    ilan["ilaniVerenKullanici"] = user;
                    ilan["random"] = "https://avatars.io/facebook/random" + i;
                    this.ilanlar.push(ilan);
                    i++;
                });
            });
        })
        this.ilanSayisi = this.ilanSayisi + 10;
    }

    ilanDetay(ilan) {
        this.navController.push(IlanDetayComponent, {
            item: ilan
        })
    }

    doRefresh(refresher) {
        this.ilanSayisi = 10;
        this.infiniteDahaFazla = true;
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

