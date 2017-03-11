import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, IonicApp, MenuController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { AngularFire } from 'angularfire2';

import { LoginPage } from '../pages/login/login';
import { AnasayfaPage } from '../pages/anasayfa/anasayfa';
import { HesabimPage } from '../pages/hesabim/hesabim';
import { AyarlarPage } from '../pages/ayarlar/ayarlar';
import { IlanlarimPage } from '../pages/ilanlarim/ilanlarim';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string, component: any }>;

  aktifKullanici: any;

  constructor(public platform: Platform, public angularFire: AngularFire, private menuCtrl: MenuController, public ionicApp: IonicApp) {
    angularFire.auth.subscribe((auth: any) => {
      if (auth) {
        this.rootPage = AnasayfaPage;
        this.angularFire.database.object("users/" + auth.uid).subscribe(authData => {
          this.aktifKullanici = authData;
        })
      } else {
        this.rootPage = LoginPage;
      }
    })

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Bilgilerim', component: HesabimPage },
      { title: 'Ayarlar', component: AyarlarPage },
      { title: 'İlanlarım', component: IlanlarimPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      // ### DEVİCE BACK BUTTON #### Cihazın Geri Tuşuna basınca sayfa kapama vardı bu şekilde modal içinde oldu
      // https://github.com/driftyco/ionic/issues/6982#issuecomment-254740855
      this.platform.registerBackButtonAction(() => {
        let activePortal = this.ionicApp._loadingPortal.getActive() ||
          this.ionicApp._modalPortal.getActive() /*modaliçin*/ ||
          this.ionicApp._toastPortal.getActive() /*toastiçin*/ ||
          this.ionicApp._overlayPortal.getActive();
        if (activePortal) {
          activePortal.dismiss(); //modal kapat
          return;
        }
        if (this.menuCtrl.isOpen()) {
          this.menuCtrl.close(); //menü açıksa kapat
          return;
        }
        let view = this.nav.getActive();
        let page = view ? this.nav.getActive().instance : null;
        if (page.isRootPage) {
          //  this.platform.exitApp(); bu kısma hiç girmedi -anasayfa kısmı olmalı
        }
        else if (this.nav.canGoBack() || view && view.isOverlay) {
          this.nav.pop(); //sayfa ise geriye
        }
        else {
          console.log("Geri düğmesi ile işleme HATASI ile uygulama kapanır");
          this.platform.exitApp();
        }
      }, 1);
      // ##################### DEVİCE BACK BUTTON ####

    });
  }

  openPage(page) {
    //this.nav.setRoot(page.component);
    this.nav.push(page.component)
  }

  hesabimaGit() {
    this.nav.push(HesabimPage);
  }
}
