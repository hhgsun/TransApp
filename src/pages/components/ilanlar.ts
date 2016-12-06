import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';

import { IlanDetayComponent } from '../components/ilandetay'

@Component({
    selector: 'ilanlar',
    templateUrl: 'ilanlar.html'
})
export class IlanlarComponent {
    @Input()
    public filter: string;

    public ilanlar = [];
    constructor(public angularFire: AngularFire, public navController: NavController) {
        console.log("filter parametresi: " + this.filter);
        //this.ilanlar
        this.angularFire.database.list("ilanlar").subscribe((ilanlar: any) => {
            this.ilanlar = [];
            ilanlar.forEach(ilan => {
                this.angularFire.database.object("users/" + ilan["ilaniVerenKullaniciId"]).subscribe(user => {
                    ilan["ilaniVerenKullanici"] = user;
                    this.ilanlar.push(ilan);
                });
            });
        })
    }
    ilanDetay(ilan) {
        this.navController.push(IlanDetayComponent, {
            item: ilan
        })
    }
}

