import { Component } from '@angular/core';
import { AngularFire } from 'angularfire2';

import { BaseService } from '../services/service'

@Component({
  selector: 'page-hesabim',
  templateUrl: 'hesabim.html'
})
export class HesabimPage {
  public profile: any;
  avatarUploadLoading = false;
  constructor(public angularFire: AngularFire, public baseService: BaseService) {

    this.angularFire.auth.subscribe(authData => {
      this.angularFire.database.object("users/" + authData.uid).subscribe((userData) => {
        this.profile = userData;
      })
    })

  }

  bilgileriKaydet() {
    // this.profile.ad ? this.profile.ad : null // bu if else ile gelen değer undefined ise null yapıyoruz yoksa hata veriyor
    var updateObj = {
      ad: this.profile.ad ? this.profile.ad : null,
      soyad: this.profile.soyad ? this.profile.soyad : null,
      meslek: this.profile.meslek ? this.profile.meslek : null,
      tasitBilgisi: this.profile.tasitBilgisi ? this.profile.tasitBilgisi : null,
      cepTel: this.profile.cepTel ? this.profile.cepTel : null,
      cepTelGosterilsinMi: this.profile.cepTelGosterilsinMi ? this.profile.cepTelGosterilsinMi : null,
      bildirimlerAcik: this.profile.bildirimlerAcik ? this.profile.bildirimlerAcik : null,
      hesapDurumu: this.profile.hesapDurumu ? this.profile.hesapDurumu : null
    }
    this.angularFire.database.object("users/" + this.profile.userId).update(updateObj).then((call) => {
      this.baseService.presentToast("Profiliniz Başarıyla Güncellendi");
    }).catch((err) => {
      this.baseService.presentToast("Hata! : Güncelleme İşleminde Hata Oluştu", 3000, true);
    })
  }

  resimSecAc() {
    var input = (<HTMLInputElement>document.getElementById('file'));
    input.click();
  }

  resimSec() {
    this.avatarUploadLoading = true;
    var silinecekAvatar = this.profile.avatar;
    var file = [(<HTMLInputElement>document.getElementById('file')).files[0]];
    this.baseService.imageUploadSTR(file, "avatarImages", "avatar").then(avatarData => {
      this.angularFire.database.object("users/" + this.profile.$key + "/avatar")
        .update(avatarData[0]).then(() => {
          this.avatarUploadLoading = false;
          this.baseService.presentToast("Profil Resminiz Güncellendi")
          this.baseService.removeStorage("avatarImages", silinecekAvatar);
        }).catch(err => {
          this.avatarUploadLoading = false;
          console.log(err);
        });
    })

  }
}

