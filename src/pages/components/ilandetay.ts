import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
    selector: 'ilandetay',
    templateUrl: 'ilandetay.html'
})
export class IlanDetayComponent {
    public ilan = null; //secilenIlan
    constructor(public navParams:NavParams) {
        this.ilan = this.navParams.get("item");
        console.log(this.ilan);
    }
}

