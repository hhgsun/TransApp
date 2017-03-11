import { Component, NgZone, ViewChild } from '@angular/core';
import { ViewController, Searchbar, Platform, NavController } from 'ionic-angular';

declare var google: any;

@Component({
    selector: 'auto-complete',
    templateUrl: 'auto-complete.html'
})
export class AutoCompleteComponent {
    // İLAN EKLERKEN GOOGLE MAP DEN OTOMATİK ŞEHİR TAMAMLAMA
    @ViewChild('searchbar') searchbar: Searchbar;
    autocompleteItems;
    autocomplete;
    service = new google.maps.places.AutocompleteService();

    constructor(public viewCtrl: ViewController, private zone: NgZone, public platform: Platform, public navCtrl: NavController) {
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

    chooseItem(prediction: any) { //seçilen adres metin data
        var terms = [];
        prediction.terms.forEach(term => {
            console.log(term.value)
            terms.push(term.value);
        });
        var callBackData = {
            adres: prediction.description,
            bolgeler: terms,
            location: null
        }
        // seçilen adresin lat lot değerleri
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': prediction.description }, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
                var location = {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                }
                callBackData.location = location;
                // seçildikten son dismiss ile datayı yolluyoruz;
                this.viewCtrl.dismiss(callBackData);
            } else {
                console.log("Adres bulunamıyor: " + status);
                alert("Adres bulunamıyor: " + status)
            }
        });
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
                    me.autocompleteItems.push(prediction);
                });
            });
        });
    }
}