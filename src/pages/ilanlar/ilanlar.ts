import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';

import { IlanverPage } from '../ilanver/ilanver'
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'page-ilanlar',
  templateUrl: 'ilanlar.html'
})
export class IlanlarPage {
  @ViewChild('homeSlider') slider: Slides;
  public topTabs = "ilanlar";
  public ilanlar: FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, public angularFire: AngularFire) { }

  ionViewDidLoad() {
    console.log('Hello IlanlarPage Page');
    this.ilanlar = this.angularFire.database.list("ilanlar");
  }

  ilanVer() {
    this.navCtrl.push(IlanverPage);
  }

  onSlideChanged() {
    let currentIndex = this.slider.getActiveIndex();
    if (currentIndex == 0) {
      this.topTabs = "ilanlar";
    } else {
      this.topTabs = "bildirimler"
    }
  }

  slidereGit(topTabsParam: string) {
    if (topTabsParam == "ilanlar") {
      this.slider.slideTo(0, 100);
    } else {
      this.slider.slideTo(1, 100);
    }
  }

}
