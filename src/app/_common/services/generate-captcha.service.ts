import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GenerateCaptchaService {
  possibleCaptcha =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  constructor() {}

  CreateCaptcha() {
    let result:string ='' 
    for (var i = 0; i < 5; i++) {
      result += this.possibleCaptcha.charAt(
        Math.floor(Math.random() * this.possibleCaptcha.length)
      );
    }
    return result
  }

  RefreshCaptcha() {
    return this.CreateCaptcha();
  }
}
