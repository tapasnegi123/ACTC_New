import { Injectable } from "@angular/core";
import { CheckLoginService } from "../core-services/check-login.service";

@Injectable({
    providedIn:'root'
})

export class SessionService{

    constructor(private _checkLogin:CheckLoginService){

    }

    login(loginData: any): void {
        localStorage.setItem('loginData', JSON.stringify(loginData));
        this._checkLogin.checkLogin(true);
      }
    
      logOut(): void {
        this._checkLogin.checkLogin(false);
        localStorage.removeItem('loginData');
      }
    
      getLoggedinUserData(): any {
        return JSON.parse(localStorage.getItem('loginData')!)
      }

}