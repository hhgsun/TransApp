import { Component } from '@angular/core';

import { NavController, MenuController, NavParams } from 'ionic-angular';

import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    loginData: any = {};
    registerData: any = {};
    passResetData: any = {};
    kayitOlPage = null;
    sifreYenilePage = null;

    constructor(public navCtrl: NavController, public navParams: NavParams, public angularFire: AngularFire, menuCtrl: MenuController) {
        menuCtrl.swipeEnable(false);
        var gelen = this.navParams.get("item");
        if (gelen == "kayitOlPage") {
            this.kayitOlPage = "Kayıt Olun";
        } else if (gelen == "sifreYenilePage") {
            this.sifreYenilePage = "Şifre Değiştir";
        }
    }

    digerSayfa(sayfaIsmi: string) {
        // kayitOlPage veya sifreYenilePage
        this.navCtrl.push(LoginPage, {
            item: sayfaIsmi
        })
    }

    login() {
        var credentials: any = { email: this.loginData.email, password: this.loginData.password }
        this.angularFire.auth.login(credentials, { provider: AuthProviders.Password, method: AuthMethods.Password }).then((data: any) => {
            console.log(data.uid);
            //this.navCtrl.setRoot(IlanlarPage);
        }).catch((err) => {
            alert("Hata: " + err.message);
            console.log("Error message: " + err.message);
        });
    }

    register() {
        if (this.registerData.passwordRep == this.registerData.password) {
            var credentials: any = { email: this.registerData.email, password: this.registerData.password, displayName: this.registerData.displayName }
            this.angularFire.auth.createUser(credentials).then((data: any) => {
                this.angularFire.database.object("users/" + data.uid).set({
                    userId: data.uid,
                    email: this.registerData.email,
                    ad: this.registerData.ad,
                    soyad: this.registerData.soyad,
                    tcNo: this.registerData.tcNo
                }).then((cal: any) => {
                    console.log(cal);
                })
            })
        } else {
            alert("Lütfen şifreniz tekrarı ile aynı olsun");
        }
    }

    passReset() {
        var auth = firebase.auth();
        auth.sendPasswordResetEmail(this.passResetData.email).then((data: any) => {
            // Email sent.
            console.log("Mail adresinize link gönderildi");
        }, (error) => {
            // An error happened.
            console.log(error);
        });
    }
}
