import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from "rxjs/Observable";

import { Http, Headers } from '@angular/http';
import { ToastController, AlertController } from 'ionic-angular';

//import * as firebase from "firebase";
declare var window: any;

@Injectable()
export class BaseService {
    private _staticMapSrc = "http://maps.googleapis.com/maps/api/staticmap?"
    + "autoscale=2&size=500x250&maptype=roadmap&"
    + "key=AIzaSyCxMFmAa2WRZA5SfNa9W63HZqQyTwoPYG8"
    + "&format=png&visual_refresh=true";
    private _staticMapSrcBaslangicIcon = "";
    private _staticMapSrcBitisIcon = "";

    constructor(public http: Http, public toastCtrl: ToastController, public alertCtrl: AlertController) {
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

    /* BLOB a çevirme Ve Firebase e Image Upload****************************************************/
    // http://stackoverflow.com/questions/39018980/firebase-storage-v3-returning-multipart-body-does-not-contain-2-or-3-parts-on
    blobFormataCevir(data, mimeString) {
        try {
            return new Blob([data], {
                type: mimeString
            });
        } catch (err) {
            var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
            var bb = new BlobBuilder();
            bb.append(data);
            return bb.getBlob(mimeString);
        }
    };

    uploadImageAsync(localImageFileUrl, uploadPath) {
        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(localImageFileUrl, (fileEntry) => {
                fileEntry.file((file) => {
                    var reader = new FileReader();
                    reader.onloadend = (evt: any) => {
                        try {
                            var imageBlob = this.blobFormataCevir(evt.target.result, 'image/jpeg');
                            var metadata = {
                                contentType: 'image/jpeg'
                            };
                            // Create a root reference
                            var fileName = (new Date()).getTime() + file.name
                            var storageRef = firebase.storage().ref();
                            var fileRef = storageRef.child(uploadPath + "/" + fileName);
                            var uploadTask = fileRef.put(imageBlob, metadata);
                            uploadTask.on('state_changed', (snapshot) => {
                                // Observe state change events such as progress, pause, and resume
                                // See below for more detail
                                //console.log(snapshot.f);
                            }, (error) => {
                                // Handle unsuccessful uploads
                                console.log(error);
                                resolve("Upload Hata: " /*+ error.code*/ + ": " + error.message)
                            }, () => {
                                // Handle successful uploads on complete
                                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                                var downloadURL = uploadTask.snapshot.downloadURL;
                                resolve({
                                    fbPath: fileRef.toString(),
                                    name: fileName,
                                    downloadUrl: downloadURL
                                });
                            });
                        } catch (err) {
                            resolve("Upload Yükleme sonu hata: " + err);
                        }
                    };

                    try {
                        reader.readAsArrayBuffer(file);
                    } catch (err) {
                        resolve("readAsArrayBuffer hata: " + err);
                    }
                },
                    fileFailure => {
                        resolve("Dosya Nesnesi Gelemedi / Couldn't make File object");
                    });
            },
                fileEntryFailure => {
                    resolve("Görüntü için fileEntry bulamadım / Couldn't find fileEntry for image");
                });

            return resolve;
        });
    }

    removeStorage(path: string, storageObj: any) {
        return new Observable(observer => {
            var storageRef = firebase.storage().ref();
            var removeRef = storageRef.child(path + storageObj.name);
            // Create a reference to the file to delete
            // var desertRef = storageRef.child('images/desert.jpg');
            // Delete the file
            removeRef.delete().then(function () {
                // File deleted successfully
                console.log("Silme Basarili")
                observer.next(true)
            }).catch(function (error) {
                // Uh-oh, an error occurred!
                observer.error(error)
            });
        });
    }
}