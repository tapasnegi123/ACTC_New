import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_common/services/authentication.service';
import { EncryptionService } from 'src/app/_common/services/encryption.service';
import { StorageService } from 'src/app/_common/services/storage.service';
import { ToastService } from 'src/app/_common/services/toast.service';
import  { Location } from '@angular/common'
import {  Subject, takeUntil } from 'rxjs';
import { AlertService } from 'src/app/_common/services/alert.service';

@Component({
  selector: 'app-login-with-otp',
  templateUrl: './login-with-otp.component.html',
  styleUrls: ['./login-with-otp.component.scss']
})
export class LoginWithOtpComponent implements OnInit {

  showButton:boolean = true
  loginForm: FormGroup
  usermobileNumWithOTPId:any

  constructor(private _fb: FormBuilder, private _renderer: Renderer2, private _encrypt: EncryptionService,
    private _router: Router, private _storage: StorageService, private _toast: ToastService,private _alert:AlertService,
    private _auth: AuthenticationService, private _activatedRoute:ActivatedRoute,private _location:Location) {
    this.loginForm = this._fb.group({
      otp: [, Validators.compose([Validators.required])]
    })
  }

  get loginWithOTPFormControl(){
    return this.loginForm.controls
  }

  ngOnInit(){
    this.usermobileNumWithOTPId = this._storage.GetUserMobileNumberWithReponse()
    console.log(this.usermobileNumWithOTPId)    
  }

  VerifyOTPAndLogin(formData:any){
    let otpid,otp,mobile
    otp = formData.otp
    mobile = this.usermobileNumWithOTPId?.mobileNumber 
    otpid = this.usermobileNumWithOTPId?.response?.otpId

    if(this.IsFormValid()){
      this.VerifyOTP(otpid,otp,mobile)
    }else{
      this.loginForm.markAllAsTouched()
      console.log("form data is not valid ")
    }
  }

  IsFormValid(){
    return this.loginForm.valid
  }

  unsubscribe:Subject<any> = new Subject()
  VerifyOTP(otpid:any ,otp:any ,mobile:any){
    this._auth.VerifyOTP(otpid,otp,mobile).pipe(takeUntil(this.unsubscribe)).subscribe((response:any) => {
      console.log(response)
      if(response[0].isOtpValidated){
        this._storage.setUserData(response[0])
        this._alert.ShowSuccess("You Have Logged In Successfully")
        this._router.navigate(['/dashboard']);
      }else{
        this._alert.ShowWarning("Incorrect OTP",0,"Please enter a valid OTP",true)
      }
    },(error:any) => {
      this._alert.ShowWarning("Error",0,error,true)
    })
  }

  GoToPreviousPage(){
    this._location.back()
  }

  showResendButton: boolean = false;
  showTimer = true
  ResendOTP() {
    this.showResendButton = !this.showResendButton;
    this._alert.ShowSuccess('New OTP is sent. Please check your device');
    this._auth.Login(this.usermobileNumWithOTPId.mobileNumber,'', 'otp',2).subscribe({
      next: (response) => {
        console.log(response)
      }
    })
    this.showTimer = true;
  }

  DataFromTimerCompo(event: any) {
    console.log('data from timer compo ' + event);
    this.showResendButton = event;
    this.showTimer = false;
  }



}
