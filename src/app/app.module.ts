import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// Pages
import { LoginPage } from '../pages/login/login';
import { AnasayfaPage } from '../pages/anasayfa/anasayfa';
import { IlandetayPage } from '../pages/ilandetay/ilandetay';
import { IlanverPage } from '../pages/ilanver/ilanver';
import { HesabimPage } from '../pages/hesabim/hesabim';
import { AyarlarPage } from '../pages/ayarlar/ayarlar';
import { IlanlarimPage } from '../pages/ilanlarim/ilanlarim';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';

// Components
import { TumilanlarComponent } from '../pages/components/tumilanlar';
import { SearchComponent } from '../pages/components/search';
import { AutocompletePage } from '../pages/components/autocomplete';

// Service
import { BaseService } from '../pages/services/service';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';

// Initialize Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyAaUZfeKE3Swi8bOfHjrYWDFomx0rzhLf4",
  authDomain: "transapp-40bd7.firebaseapp.com",
  databaseURL: "https://transapp-40bd7.firebaseio.com",
  storageBucket: "transapp-40bd7.appspot.com",
  messagingSenderId: "575673152969"
};

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    AnasayfaPage,
    IlandetayPage,
    IlanverPage,
    HesabimPage,
    AyarlarPage,
    IlanlarimPage,
    Page1,
    Page2,
    TumilanlarComponent,
    SearchComponent,
    AutocompletePage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      // app ayarları
      backButtonText: '', // "Geri" yazılabilir
      //iconMode: 'ios',
      tabbarPlacement: 'bottom',
      //pageTransition: 'ios',
    }),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    AnasayfaPage,
    IlandetayPage,
    IlanverPage,
    HesabimPage,
    AyarlarPage,
    IlanlarimPage,
    Page1,
    Page2,
    TumilanlarComponent,
    SearchComponent,
    AutocompletePage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, BaseService]
})
export class AppModule { }
