import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, NavParams } from 'ionic-angular';

import { IlanverPage } from '../ilanver/ilanver'
import { AngularFire } from 'angularfire2';

@Component({
  selector: 'page-ilanlar',
  templateUrl: 'ilanlar.html'
})
export class IlanlarPage {
  @ViewChild('homeSlider') slider: Slides;
  public topTabs = "ilanlar";
  public secilenIlan = null;
  public ilanlar = [];

  constructor(public navCtrl: NavController, public angularFire: AngularFire, public navParams: NavParams) {
    this.secilenIlan = this.navParams.get("item");
  }

  ionViewDidLoad() {
    var ilanlarList = [];
    this.angularFire.database.list("ilanlar").subscribe((ilanlar: any) => {
      ilanlar.forEach(ilan => {
        this.angularFire.database.object("users/" + ilan.ilaniVerenKullaniciId).subscribe((user: any) => {
          ilan["ilaniVerenKullanici"] = user;
          ilanlarList.push(ilan);
        });
      });
    })
    this.ilanlar = ilanlarList;
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

  ilanDetay(ilan) {
    this.navCtrl.push(IlanlarPage, {
      item: ilan
    })
  }

}
