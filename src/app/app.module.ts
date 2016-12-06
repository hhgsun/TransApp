import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { AnasayfaPage } from '../pages/anasayfa/anasayfa';
import { IlanverPage } from '../pages/ilanver/ilanver';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';

// Components
import { IlanlarComponent } from '../pages/components/ilanlar';
import { IlanDetayComponent } from '../pages/components/ilandetay';
import { SearchComponent } from '../pages/components/search';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';

// Initialize Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyCJhUN4R_vAnsW5mGq3vSfWz76dt53jFgc",
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
    IlanverPage,
    Page1,
    Page2,
    IlanlarComponent,
    IlanDetayComponent,
    SearchComponent
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
    IlanverPage,
    Page1,
    Page2,
    IlanlarComponent,
    IlanDetayComponent,
    SearchComponent
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
