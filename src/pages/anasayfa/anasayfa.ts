import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, MenuController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';

import { SearchComponent } from '../components/search'
import { IlanverPage } from '../ilanver/ilanver'
import { IlandetayPage } from '../ilandetay/ilandetay'

@Component({
  selector: 'page-anasayfa',
  templateUrl: 'anasayfa.html'
})
export class AnasayfaPage {
  /* Anasayfa Slider Aktif olduğu zaman bu kısım aktif edilmeli
  @ViewChild('homeSlider') slider: Slides;
  public topTabs = "ilanlar";
  */

  public ilanlar: any = [];
  public ilanSayisi = 10;
  public infiniteDahaFazla = true;
  public gelenIlanlarLength = 0;

  constructor(
    public navCtrl: NavController,
    public angularFire: AngularFire,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public menuCtrl: MenuController
  ) {
    menuCtrl.swipeEnable(true);
  }

  ionViewDidLoad() {
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
    this.navCtrl.push(IlandetayPage, {
      item: ilan
    })
  }

  doRefresh(refresher) {
    this.ilanSayisi = 10;
    this.infiniteDahaFazla = true;
    setTimeout(() => {
      this.ionViewDidLoad();
      refresher.complete();
    }, 2000);
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.ionViewDidLoad();
      infiniteScroll.complete();
    }, 500);
  }

  ilanVer() {
    this.navCtrl.push(IlanverPage);
  }

  searchComponenteGit() {
    //this.navCtrl.push(SearchComponent);
    let modal = this.modalCtrl.create(SearchComponent);
    modal.present();
  }

  filtreAc() {
    let alert = this.alertCtrl.create();
    alert.setTitle('İlanları Filtrele');

    alert.addInput({
      type: 'text',
      label: 'Baslangıç Yeri',
      placeholder: 'Nereden: İstanbul, Kocaeli...'
    });
    alert.addInput({
      type: 'text',
      label: 'Bitiş Yeri',
      placeholder: 'Nereye: Mersin, Van...'
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

  /*     Anasayfa Slider Aktif olduğu zaman bu kısım aktif edilmeli
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
  */
}