import { Component } from '@angular/core';

import { } from 'ionic-angular';
import { AngularFire } from 'angularfire2';

@Component({
  selector: 'page-hesabim',
  templateUrl: 'hesabim.html'
})
export class HesabimPage {
  public profile = null;
  constructor(public angularFire: AngularFire) {
    this.angularFire.auth.subscribe(authData => {
      this.angularFire.database.object("users/" + authData.uid).subscribe((userData) => {
        this.profile = userData;
        console.log(this.profile);
      })
    })
  }
}
