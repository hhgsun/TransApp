import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';

import { IlanverPage } from '../ilanver/ilanver'
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'page-ilanlar',
  templateUrl: 'ilanlar.html'
})
export class IlanlarPage {
  @ViewChild('mySlider') slider: Slides;

  ilanlar:FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, public angularFire:AngularFire) { }

  ionViewDidLoad() {
    console.log('Hello IlanlarPage Page');
    this.ilanlar = this.angularFire.database.list("ilanlar");
  }

  ilanVer() {
    this.navCtrl.push(IlanverPage);
  }

  onSlideChanged() {
    let currentIndex = this.slider.getActiveIndex();
    console.log("Current index is", currentIndex);
  }

}
