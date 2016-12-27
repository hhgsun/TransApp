import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';

import { NavController, MenuController, NavParams } from 'ionic-angular';

import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
    animations: [
        //For the logo
        trigger('flyInBottomSlow', [
            state('in', style({
                transform: 'translate3d(0,0,0)'
            })),
            transition('void => *', [
                style({ transform: 'translate3d(0,2000px,0' }),
                animate('2000ms ease-in-out')
            ])
        ]),
        //For the background detail
        trigger('flyInBottomFast', [
            state('in', style({
                transform: 'translate3d(0,0,0)'
            })),
            transition('void => *', [
                style({ transform: 'translate3d(0,2000px,0)' }),
                animate('1000ms ease-in-out')
            ])
        ]),
        //For the login form
        trigger('bounceInBottom', [
            state('in', style({
                transform: 'translate3d(0,0,0)'
            })),
            transition('void => *', [
                animate('2000ms 200ms ease-in', keyframes([
                    style({ transform: 'translate3d(0,2000px,0)', offset: 0 }),
                    style({ transform: 'translate3d(0,-20px,0)', offset: 0.9 }),
                    style({ transform: 'translate3d(0,0,0)', offset: 1 })
                ]))
            ])
        ]),
        //For login button
        trigger('fadeIn', [
            state('in', style({
                opacity: 1
            })),
            transition('void => *', [
                style({ opacity: 0 }),
                animate('1000ms 2000ms ease-in')
            ])
        ])
    ]
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
        if (this.loginData.email == "", null && this.loginData.password == "", null) {
            alert("Lütfen Bilgileri Kontrol Ediniz.")
        } else {
            var credentials: any = { email: this.loginData.email, password: this.loginData.password }
            this.angularFire.auth.login(credentials, { provider: AuthProviders.Password, method: AuthMethods.Password }).then((data: any) => {
                console.log(data.uid);
                //this.navCtrl.setRoot(IlanlarPage);
            }).catch((err) => {
                alert("Hata: " + err.message);
                console.log("Error message: " + err.message);
            });
        }
    }

    register() {
        if (this.registerData.passwordRep == this.registerData.password) {
            console.log(this.registerData.displayName);
            var credentials: any = { email: this.registerData.email, password: this.registerData.password }
            this.angularFire.auth.createUser(credentials).then((data: any) => {
                this.angularFire.database.object("users/" + data.uid).set({
                    userId: data.uid,
                    email: this.registerData.email,
                    ad: this.registerData.ad,
                    soyad: this.registerData.soyad
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
