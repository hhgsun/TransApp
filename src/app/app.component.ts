import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { AngularFire } from 'angularfire2';

import { LoginPage } from '../pages/login/login';
import { AnasayfaPage } from '../pages/anasayfa/anasayfa';
import { HesabimPage } from '../pages/hesabim/hesabim';
import { AyarlarPage } from '../pages/ayarlar/ayarlar';
import { IlanlarimPage } from '../pages/ilanlarim/ilanlarim';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string, component: any }>;

  aktifKullanici: any;

  constructor(public platform: Platform, public angularFire: AngularFire) {
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
      { title: 'İlanlarım', component: IlanlarimPage },
      { title: 'Page One', component: Page1 },
      { title: 'Page Two', component: Page2 }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
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
