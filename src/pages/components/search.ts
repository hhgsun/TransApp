import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { IlandetayPage } from '../ilandetay/ilandetay'

@Component({
    selector: 'search',
    templateUrl: 'search.html'
})
export class SearchComponent {
    public ilanlar = [];
    constructor(public angularFire: AngularFire, public navController: NavController) {
    }

    items() {
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

    searchGet(event) {
        // Reset items back to all of the items
        this.items();

        // set val to the value of the ev target
        var val = event.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.ilanlar = this.ilanlar.filter((item) => {
                return (item.baslik.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        } else {
            this.ilanlar = [];
        }
    }

    ilanDetay(ilan) {
        this.navController.push(IlandetayPage, {
            item: ilan
        });
    }

    geriDon(){
        this.navController.pop();
    }

}