import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

constructor() { }

encryptionAES (plainText:any) {
  let _key = CryptoJS.enc.Utf8.parse(environment.enc_Key);
  let _iv = CryptoJS.enc.Utf8.parse(environment.ency_iv);
  let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plainText), _key, {
    keySize: 128 / 8,
    iv: _iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  return encrypted
}

decryptionAES(encryptedText:any){

  if(encryptedText != (null || undefined) ){
    let _key = CryptoJS.enc.Utf8?.parse(environment.enc_Key);
    let _iv = CryptoJS.enc.Utf8?.parse(environment.ency_iv);
    let decrypt = CryptoJS.AES?.decrypt(encryptedText, _key, {
      keySize: 128 / 8,
      iv: _iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
    return decrypt;    
  }else{
    return "error"
    // throw new Error('Unable to encrypt the string')
  }
}

}
