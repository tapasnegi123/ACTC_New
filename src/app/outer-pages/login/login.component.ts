import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {  map, Subject, takeUntil, catchError, fromEvent, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/_common/services/authentication.service';
import { EncryptionService } from 'src/app/_common/services/encryption.service';
import { StorageService } from 'src/app/_common/services/storage.service';
import { ToastService } from 'src/app/_common/services/toast.service';
import  { Location } from '@angular/common'
import { CaptchaComponent } from 'src/app/_common/shared.barrel';
import { GenerateCaptchaService } from 'src/app/_common/services/generate-captcha.service';
import { AlertService } from 'src/app/_common/services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  show = false;
  password:any;
  showButton: boolean = true
  loginForm: FormGroup

  get loginFormControl() {
    return this.loginForm.controls
  }

  constructor(private _fb: FormBuilder, private _renderer: Renderer2, private _encrypt: EncryptionService,
    private _router: Router, private _storage: StorageService, private _toast: ToastService,
    private _auth: AuthenticationService, private _location:Location, private _captcha:GenerateCaptchaService,
    private _alert:AlertService) {
    this.loginForm = this.GetAllFormControl() 
  }

  GetAllFormControl(){
    return this._fb.group({
      email: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
      code: [null,Validators.compose([Validators.required])],
      mobile: [null, Validators.compose([Validators.pattern(/^[0-9]\d*$/), Validators.minLength(1)])],
    })
  }

  
  unsubscribe: Subject<any> = new Subject
  ngOnInit() {
    this.password = 'password';
  }

  onClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }
  ngAfterViewInit() {
    this.ClearMobileInputField()
    this.ClearEmailAndPasswordInputField()
    this.CheckInputCodeEqualToCaptcha()
  }

  correctCaptchaCode:string = ''
  GetCaptcha(event:any){
    this.correctCaptchaCode = event
  }

  CheckInputCodeEqualToCaptcha(){
    this._renderer.listen(this.codeInput?.nativeElement,'change',(event) => {
      if(this.correctCaptchaCode != this.loginFormControl['code'].value){
        this.ReloadCaptcha()
      }else{
        this.loginFormControl['code'].markAsPending()
      }
    })
  }

  //Checks for login type and call login api method
  CheckForLoginTypeAndLogin(formData: any) {
    let mobileNum, loginType: any | undefined, email, password,code
    password = formData.password
    email = formData.email
    mobileNum = formData.mobile
    code = formData.code


    if (this.AreAllFieldsEmpty(formData)) {
      this.loginForm.markAllAsTouched()
    } else {
      if ((password && email && code) != null) {
        if(code != this.correctCaptchaCode){
          this.loginFormControl['code'].markAsPending()
          this.ReloadCaptcha()
          this._alert.ShowWarning("Incorrect captcha",0,"Please enter correct captcha",true,"OK")
          this.loginForm.controls['code'].setValue("")
          return
        }
        loginType = "username"
        this.Login(email, this._encrypt.encryptionAES(password), loginType)
      }else if(mobileNum != null){
        loginType = "otp"
        this.Login(mobileNum, '', loginType) 
      }else{
        this.loginForm.markAllAsTouched()
        return
      }
 
    }
  }

  AreAllFieldsEmpty(formData: any) {
    let email, code, mobile, password
    email = formData?.email;
    code = formData?.code;
    mobile = formData?.mobile;
    password = formData?.password;

    return ( (email == null || email == "") && 
    (code == null || code == "") && 
    (mobile == null || mobile == "") && 
    (password == null || password == "") ) ? true : false
    
  }

  appId:number = 2
  subscription:Subscription = new Subscription()
  Login(username: string, password: string, loginType: string) {
    this.ToggleLoadingButton()
    this._auth.Login(username,password,loginType,this.appId).pipe(map( (response:any) => {
      if(response.length > 1){
        console.log(response);
        this.ErrorForMultiUser()
        return null
      }
      if(response.length == 1){
        return response[response.length - 1]
      }
      return response
    }),
    ).subscribe({
      next : (response:any) => {
        this.ToggleLoadingButton()
        if(response?.length == 0){
          return this._alert.ShowWarning("Invalid Username",0,"Please enter a valid username.",true,"OK")
        }
        if(loginType == "otp"){
          if(response?.isMultipleExist){
            this.ErrorForMultiUser()
            return           
          }
          if(response?.otpId == -1){
            this.ErrorForInvalidMobileNum()
            return 
          }else{
            this._alert.ShowSuccess("An OTP Has Been Sent To Your Registered Device.")
            this._router.navigate(['/login-with-otp'])
            return
          }  
        }

        if(loginType == "username"){
          this.CheckForValidPassword(response)
        }
      },
      error: (err) => {
        this.showButton = true
        if(err)this._alert.ShowWarning("Data Not Found!",0,err,true,"OK")
        // if(err.status == 500)this._alert.ShowWarning("500 error",0,err.statusText,true,"OK")
      }
    })
  }

  GenerateSession(response:any){
    this._auth.GenerateSession(response.role_id,response.user_id).subscribe(responseNew => {
    })
  }

  @ViewChild("emailInput") emailInput: ElementRef | undefined
  @ViewChild("passwordInput") passwordInput: ElementRef | undefined
  @ViewChild("code") codeInput: ElementRef | undefined
  @ViewChild("mobileNumInput") mobileNumInput: ElementRef | undefined

  ErrorForMultiUser(){
    this._alert.ShowWarning("Multiple users exist",0,"Multiple users exist with present account.Please contact your admin.",true,"Ok")
  }

  ErrorForInvalidMobileNum(){
    this._alert.ShowWarning("Invalid Mobile Number",0,
    "Please try again with a valid mobile number",true,"OK")
  }

  ClearMobileInputField() {
    fromEvent([this.emailInput?.nativeElement,
    this.passwordInput?.nativeElement,this.codeInput?.nativeElement], "keydown").pipe(takeUntil(this.unsubscribe)).subscribe(event => {
      this.SetvalueNullAndMarkAsTouched('mobile')
    })
  }

  ClearEmailAndPasswordInputField() {
    fromEvent(this.mobileNumInput?.nativeElement, "keydown").pipe(takeUntil(this.unsubscribe)).subscribe(result => {
      this.SetvalueNullAndMarkAsTouched('email')
      this.SetvalueNullAndMarkAsTouched('password')
      this.SetvalueNullAndMarkAsTouched('code')
    })
  }

  SetvalueNullAndMarkAsTouched(controlName:string){
    this.loginFormControl[controlName].setValue(null)
    this.loginFormControl[controlName].markAsUntouched()
  }

  ToggleLoadingButton() {
    this.showButton = !this.showButton
  }

  GoToPreviousPage(){
    this._location.back()
  }

  CheckForValidPassword(data:any){
      if(!data?.isPasswordValidated){
      this._alert.ShowWarning("Invalid Password",0,"The password you entered is invalid.Please type your password again.",true,"OK")
      return 
      }else{
        this._alert.ShowSuccess("You successfully logged in ")
        this._storage.setUserData(data)
        this._router.navigate(['/dashboard'])
      }
  }

  @ViewChild(CaptchaComponent) captchaComponent!:CaptchaComponent
  ReloadCaptcha(){
    this.captchaComponent.genImgcap()
  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }

  /**
   * Form Helper Methods
   */

  MarkAllAsTouched(){
    this.loginForm.markAllAsTouched()
  }

}
