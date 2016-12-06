import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { AngularFire } from 'angularfire2';

import { SearchComponent } from '../components/search'
import { IlanverPage } from '../ilanver/ilanver'

@Component({
  selector: 'page-anasayfa',
  templateUrl: 'anasayfa.html'
})
export class AnasayfaPage {
  @ViewChild('homeSlider') slider: Slides;
  public topTabs = "ilanlar";

  constructor(public navCtrl: NavController, public angularFire: AngularFire) {
  }

  ionViewDidLoad() {
    console.log("Anasayfa");
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

  searchComponenteGit() {
    this.navCtrl.push(SearchComponent);
  }
}
