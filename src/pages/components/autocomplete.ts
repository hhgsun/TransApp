import { Component, NgZone, ViewChild } from '@angular/core';
import { ViewController, Searchbar, Platform, NavController } from 'ionic-angular';

declare var google: any;

@Component({
  templateUrl: 'autocomplete.html'
})
export class AutocompletePage {
  @ViewChild('searchbar') searchbar: Searchbar;
  autocompleteItems;
  autocomplete;
  service = new google.maps.places.AutocompleteService();

  constructor(public viewCtrl: ViewController, private zone: NgZone, public platform: Platform, public navCtrl:NavController) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  ionViewDidEnter() {
    this.searchbar.setFocus();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    this.viewCtrl.dismiss(item);
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({
      input: this.autocomplete.query,
      /*componentRestrictions: {
        country: 'TR'
      }*/
    }, (predictions, status) => {
      me.autocompleteItems = [];
      me.zone.run(() => {
        predictions.forEach((prediction) => {
          me.autocompleteItems.push(prediction.description);
        });
      });
    });
  }
}