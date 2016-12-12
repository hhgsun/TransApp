import { Component } from '@angular/core';
import { AngularFire } from 'angularfire2';

@Component({
  selector: 'page-ayarlar',
  templateUrl: 'ayarlar.html'
})
export class AyarlarPage {
  constructor(public angularFire:AngularFire) {
      this.angularFire.auth.subscribe(user=>{
          console.log(user);
      })
  }

  ayarlariKaydet(){
      console.log("Ayarlar Kaydetme");
  }
  
  cikisYap() {
    this.angularFire.auth.logout();
  }
  
}
