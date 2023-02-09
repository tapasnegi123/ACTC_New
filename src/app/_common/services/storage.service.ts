import { Injectable } from '@angular/core';
import { INSFInfo } from 'src/app/inner-pages/manage-actc/manage-actc-list/manage-actc-list.component';
import { IUserInfo } from 'src/app/outer-pages/forgot-password/forgot-password.component';
import { IUser } from '../interface/user.interface';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private _encryption:EncryptionService) { }

  SetYear(year:any){
    sessionStorage.setItem('year',year)
  }

  get GetYear(){
    return sessionStorage.getItem('year')!
  }

  setUserData(userdata: IUser) {
    let encryptedData = this._encryption.encryptionAES(JSON.stringify(userdata))
    sessionStorage.setItem('loggedin_user', encryptedData);
  }
 
  getUserData() {
    let dencryptedData:string = this._encryption.decryptionAES(sessionStorage.getItem('loggedin_user')!)
    if(dencryptedData ==  "error")return null
    else return JSON.parse(dencryptedData) as IUser;
  }

  SetUserNameAndId(userdata:any){
    let encryptedData = this._encryption.encryptionAES(JSON.stringify(userdata))
    sessionStorage.setItem('loggedin_user', encryptedData);
  }

  GetUserNameAndId(){
    let dencryptedData = this._encryption.decryptionAES(sessionStorage.getItem('loggedin_user')!)
    var userdata = JSON.parse(dencryptedData) as IUser;
    return userdata;
  }

  /**
   * Setter method for nsfinfo
   * @interface INSFInfo
   * @param nsfData 
   */
  SetNsfInfo(nsfData:INSFInfo){
    let encryptData = this._encryption.encryptionAES(JSON.stringify(nsfData))
    sessionStorage.setItem("nsfInfo",encryptData)
  }

  /**
   * Getter method for nsfinfo
   * @interface INSFInfo 
   */
  GetNsfInfo(){
    const getNsfInfo = sessionStorage.getItem('loggedin_user')
    let decryptedData = this._encryption.decryptionAES(getNsfInfo)
    return JSON.parse(decryptedData) as INSFInfo
  }

  SetUserMobileNumberWithResponse(mobileNumber:any,response:any){
    let encryptedData = this._encryption.encryptionAES(JSON.stringify( {mobileNumber,response}))
    sessionStorage.setItem('user_mobilenumber',encryptedData);
  }

  GetUserMobileNumberWithReponse(){
    let dencryptedData = this._encryption.decryptionAES(sessionStorage.getItem('user_mobilenumber')!)
    var userdata = JSON.parse(dencryptedData);
    return userdata;
  }

  SetUserDetailAfterLogin(userDetailData:any){
    let encryptedData = this._encryption.encryptionAES(JSON.stringify(userDetailData))
    sessionStorage.setItem('after_login_user_detail', encryptedData);
  }

  GetUserDetailAfterLogin(){
    let dencryptedData = this._encryption.decryptionAES(sessionStorage.getItem('after_login_user_detail'))
    var userdata = JSON.parse(dencryptedData);
    return userdata;
  }

  GetUserAllCredentials():IUserCredentials<any>{
    let userDetail,userData,result
    userDetail = this.GetUserDetailAfterLogin()
    userData = this.getUserData()
    result = {...userDetail,...userData}
    return result
  }

  NewGetUserAllCredentials():IUserCredentials<any>{
    let userDetail,userData,result:IUserCredentials<any>
    userDetail = this.GetUserDetailAfterLogin()
    userData = this.getUserData()
    result = {...userDetail,...userData}
    return result
  }

  updateUserData(firstname?: string, lastName?: string) {
      var userdata = JSON.parse(sessionStorage.getItem('loggedin_user')!) as IUser;
      this.setUserData(userdata);
  }

  clearStorage() {
      sessionStorage.clear();
  }
}

export interface IUserCredentials<T>{
  email_id: any
  isOtpValidated: boolean
  isPasswordValidated: boolean
  isStakeHolder: boolean
  isSuperAdminn: boolean
  login_password: any
  name: string
  role_id: number
  role_name: string
  token: string
  totalUser: any
  user_id: number
  user_name: string
  sportId: number
  sport_Name: string
}
