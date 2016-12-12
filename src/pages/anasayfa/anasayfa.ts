import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, AlertController } from 'ionic-angular';
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
  public test: any;
  constructor(public navCtrl: NavController, public angularFire: AngularFire, public alertCtrl: AlertController) {
    this.test = {baslik: 'test'};
  }

  ionViewDidLoad() {
    // console.log("Anasayfa");
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


  filtreAc() {
    let alert = this.alertCtrl.create();
    alert.setTitle('İlanları Filtrele');

    alert.addInput({
      type: 'radio',
      label: 'İlanlar',
      value: 'ilan',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: 'Firmalar',
      value: 'firma',
      checked: false
    })
    alert.addButton('Vazgeç');
    alert.addButton({
      text: 'Uygula',
      handler: data => {
        console.log(data);
      }
    });
    alert.present();
  }

}