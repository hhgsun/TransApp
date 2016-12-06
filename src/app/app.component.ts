import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { AngularFire } from 'angularfire2';

import { LoginPage } from '../pages/login/login';
import { AnasayfaPage } from '../pages/anasayfa/anasayfa';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public angularFire:AngularFire) {
    angularFire.auth.subscribe((auth:any)=>{
      if(auth){
        this.rootPage = AnasayfaPage;
      }else{
        this.rootPage = LoginPage;
      }
    })
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'AnasayfaPage', component: AnasayfaPage },
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
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  cikisYap() {
    this.angularFire.auth.logout();
  }
}
