import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment2 } from "src/environments/environment";
import { HttpService } from "../core-services/http.service";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  constructor(private _api: HttpService, private _storage: StorageService, 
    private http:HttpClient,private _router:Router) {

  }

  Login(username: string, password: string, loginType: string, appId?:number):Observable<any> {
    return this._api.post("Login/Login", {
      username: username,
      password: password,
      logintype: loginType,
      appID: appId
    })
  }

  GenerateSession(roleId:number,userId:number){
    return this._api.get("Login/GenerateSession?roleId=" + roleId + "&userId=" + userId)
  }

  VerifyOTP(otpid: any, otp: any, mobile: any) {
    return this._api.get(`Login/Login_Otp/ConfirmOtp?otpId=${otpid}&otp=${otp}&mobile=${mobile}`)
  }

  ForgotPassword(userId: string) {
    return this._api.get(`Login/ForgotPassword?userId=${userId}`)
  }

  ForgotPasswordConfirm(otpId: any, otp: any, mobileNo: any) {
    return this._api.get(`Login/ForgotPassword/Confirm?otp=${otp}&otpId=${otpId}&mobileNo=${mobileNo}`)
  }

  isLoggedIn() {
    return sessionStorage.getItem('token')
  }

  ResetPassword(userId:string,username:string,password:string){
    return this._api.post(`Login/ForgotPassword/ResetPassword`,{userId,username,password})
  }

  IsAuthenicated() {
    let user = this._storage.getUserData();
    if (user != null) {
      if (user.token != null) {
        // if (this.validateToken) return true;
        return true
      }
    }
    return false;
  }

  LogoutAndNavigateToLogin(){
    this._router.navigate(['login'])
    this.LogOut()
  }

  LogOut() {
    let userData = this._storage.getUserData();
    if (userData) {
      this._storage.clearStorage();
    }
  }

  ContactUs(data:any){
    return this._api.post(`Home/ContactUs`, data)
  }

  GetApprovedACTCList(){
    return this._api.getACTC(`Common/Get`)
  }

}