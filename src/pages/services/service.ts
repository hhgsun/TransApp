import { Injectable } from '@angular/core';
import 'rxjs/Rx';

import { Http, Headers } from '@angular/http';
import { ToastController, AlertController } from 'ionic-angular';

import { AngularFire } from 'angularfire2';
//import * as firebase from "firebase";

//declare var window: any;

@Injectable()
export class BaseService {

    private _staticMapSrc = "http://maps.googleapis.com/maps/api/staticmap?"
    + "autoscale=2&size=500x250&maptype=roadmap&"
    + "key=AIzaSyDUrR9i2CKoJ4Ln-qmBMCPyd6NnCx_lTzU"
    + "&format=png&visual_refresh=true";
    private _staticMapSrcBaslangicIcon = "";
    private _staticMapSrcBitisIcon = "";

    constructor(
        private http: Http,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController,
        private af: AngularFire
    ) {

    }

    staticMapShowMarkers(baslangic: any, bitis: any) {
        var _detayStaticMap = this._staticMapSrc
            + "&markers=icon:" + this._staticMapSrcBaslangicIcon + "%7Cshadow:true%7Csize:mid%7Ccolor:0x387ef5"
            + "%7Clabel:1%7C" + baslangic.location.lat + "," + baslangic.location.lng
            + "&markers=icon:" + this._staticMapSrcBitisIcon + "%7Cshadow:true%7Csize:mid%7Ccolor:0x387ef5"
            + "%7Clabel:2%7C" + bitis.location.lat + "," + bitis.location.lng
            + "&path=" + baslangic.location.lat + "," + baslangic.location.lng + "|" + bitis.location.lat + "," + bitis.location.lng;
        return _detayStaticMap;
    }

    staticMapAddMarkers(ilanData: any) {
        var _ekleStaticMap = this._staticMapSrc;
        if (ilanData.baslangic && ilanData.bitis) {
            _ekleStaticMap = _ekleStaticMap
                + "&markers=icon:" + this._staticMapSrcBaslangicIcon + "%7Cshadow:true%7Csize:mid%7Ccolor:0xff0000"
                + "%7Clabel:1%7C" + ilanData.baslangic.location.lat + "," + ilanData.baslangic.location.lng
                + "&markers=icon:" + this._staticMapSrcBitisIcon + "%7Cshadow:true%7Csize:mid%7Ccolor:0xff0000"
                + "%7Clabel:2%7C" + ilanData.bitis.location.lat + "," + ilanData.bitis.location.lng
                + "&path=" + ilanData.baslangic.location.lat + "," + ilanData.baslangic.location.lng + "|" + ilanData.bitis.location.lat + "," + ilanData.bitis.location.lng;
        } else if (ilanData.baslangic) {
            _ekleStaticMap = _ekleStaticMap
                + "&markers=icon:" + this._staticMapSrcBaslangicIcon + "%7Cshadow:true%7Csize:mid%7Ccolor:0xff0000"
                + "%7Clabel:1%7C" + ilanData.baslangic.location.lat + "," + ilanData.baslangic.location.lng;
        } else if (ilanData.bitis) {
            _ekleStaticMap = _ekleStaticMap
                + "&markers=icon:" + this._staticMapSrcBitisIcon + "%7Cshadow:true%7Csize:mid%7Ccolor:0xff0000"
                + "%7Clabel:2%7C" + ilanData.bitis.location.lat + "," + ilanData.bitis.location.lng;
        }
        return _ekleStaticMap;
    }

    presentToast(message: string, duration?: number, showCloseButton?: boolean) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration ? duration : 2000,
            showCloseButton: showCloseButton ? true : false,
            closeButtonText: "Tamam"
        });
        toast.present();
    }

    presentAlert(title: string, subTitle?: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: subTitle,
            buttons: ['Tamam']
        });
        alert.present();
    }

    postNotification(konu: string, baslik: string, mesaj: string, token?: boolean, ses?: boolean, params?: any) {
        return new Promise((resolve, reject) => {
            var sesDegeri = null;
            if (ses) {
                sesDegeri = "default"
            }
            var pushData = {
                "notification": {
                    "title": baslik,
                    "body": mesaj,
                    "sound": sesDegeri,
                    "icon": "fcm_push_icon"
                },
                "data": params,
                "to": "/topics/" + konu.toString(),
                "priority": "high"
            };
            if (token) {
                pushData.to = konu.toString(); //"/topics" silindi
            }
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'key=AAAAsUm1yRM:APA91bGp6oO75q48qvu7Sy5vA7x7aFQTeSEhUL9MNWkHn_fTofb5tl6MLj9c6HpqTQvqaz44CipJ5We_zX4tYuTMAPaal5AH1opFwMAmGNTpn5IySf3wGcr2NCXEjSidFOzSpTrePe55-FOLaxSE91ugAHhLwvdHig');
            return this.http.post('https://gcm-http.googleapis.com/gcm/send',
                pushData, {
                    headers: headers
                })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data); //callback
                    //console.log(data.message_id);
                },
                error => reject(error),
                () => {
                    console.log("post notification bitti");
                    if (token) {
                        console.log(token);
                    } else { //token değil de konu bildirimi ise kayıt eder

                    }
                }
                );
        });
    }

    dateFormatCeviri(tarih: any) { //ekleme tarihi vs...
        var date = new Date(tarih);
        var aylar = [];
        aylar[0] = "Ocak";
        aylar[1] = "Şubat";
        aylar[2] = "Mart";
        aylar[3] = "Nisan";
        aylar[4] = "Mayıs";
        aylar[5] = "Haziran";
        aylar[6] = "Temmuz";
        aylar[7] = "Ağustos";
        aylar[8] = "Eylül";
        aylar[9] = "Ekim";
        aylar[10] = "Kasım";
        aylar[11] = "Aralık";
        return (date.getDate() + " " + aylar[date.getUTCMonth()] + " " + date.getUTCFullYear()).toString() /* + " " + date.getHours().toString() + ":"+ date.getUTCMinutes().toString() =saat*/; /* date.getUTCMonth() + 1 */
    }

    // [(<HTMLInputElement>document.getElementById('file')).files[0]] html yansıması olan ts de kullanılır
    imageUploadSTR(_imageFiles, _imageFolder, _imagePrefix?: string) {
        return new Promise((resolve, reject) => {
            var uploadList = [];
            if (_imageFiles.length == 0) {
                resolve(uploadList)
            } else {
                let storageRef = firebase.storage().ref(_imageFolder);
                let _date = new Date().toISOString();
                for (let file of _imageFiles) {
                    var fileName = _imagePrefix + "@" + file.name + "@" + _date;
                    var ref = storageRef.child(fileName);
                    ref.put(file).then((snapshot) => {
                        var obj = {
                            name: snapshot.ref.name,
                            downloadURL: snapshot.downloadURL
                        }
                        uploadList.push(obj);
                        if (uploadList.length == _imageFiles.length) {
                            console.log("UPLOAD SUCCESS");
                            resolve(uploadList)
                        }
                    }).catch(err => {
                        reject(err.message)
                    });
                }
            }
        })
    }

    removeStorage(removeBasePath: string, storageObj: any) {
        return new Promise((resolve, reject) => {
            try {
                var storageRef = firebase.storage().ref(removeBasePath);
                var removeRef = storageRef.child(storageObj.name);
                removeRef.delete().then(() => {
                    console.log("Eski Resim Silme Basarili")
                }).catch((error) => {
                    reject(error)
                });
            } catch (error) {
                console.log(error.value.serverResponse.error.message)
            }
        });
    }
}