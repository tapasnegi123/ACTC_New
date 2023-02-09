import {
  Component,
  OnInit,
  Renderer2
} from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { AuthenticationService } from 'src/app/_common/services/authentication.service';
import { Subject, take, takeUntil } from 'rxjs';
import { ToastService } from 'src/app/_common/services/toast.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/_common/services/storage.service';
import { AlertService } from 'src/app/_common/services/alert.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;

  constructor(
    private _location: Location,private _fb: FormBuilder,
    private _auth: AuthenticationService,private _toast: ToastService,
    private _route: Router,private _renderer: Renderer2,
    private _storage: StorageService,private _alert:AlertService
  ) {
    this.forgotPasswordForm = this.AddFormGroup()
  }

  AddFormGroup(){
    return this._fb.group({
      userId: [null, Validators.compose([Validators.required])],
      number: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      email: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      forgetotp: [null, Validators.compose([Validators.required])],
    });
  }

  unsubscribe: Subject<any> = new Subject();
  ngOnInit() {}

  get forgotFormControl() {
    return this.forgotPasswordForm.controls;
  }

  templateOne: boolean = true;
  templateTwo: boolean = false;
  templatethree: boolean = false;

  mobileNum: any;

  userInfo!:IUserInfo
  ValidateIdMobileNumOrEmail(formData: any) {
    this.ToggleSubmitBtn();
    if (this.forgotFormControl['userId'].value == null) {
      this.forgotFormControl['userId'].markAsTouched();
      this.ToggleSubmitBtn();
    } else {
      this._auth
        .ForgotPassword(formData.userId)
        .pipe(take(1))
        .subscribe({
          next: (response: any) => {
            this.ToggleSubmitBtn()
            console.log(response);
            this.userInfo = response
            if (response?.multipleExist) {
              this._alert.ShowWarning('Multiple User Exists',0,'Please enter valid credentials',true);
              return;
            }
            if (response?.otpGeneratedId == -1) {
              // this._toast.ShowWarning('Invalid Mobile Number');
              this._alert.ShowWarning('Invalid Mobile Number',0,"Please enter a valid mobile number",true);
              return;
            }

            this.SetValueAndDisable('number', response.mask_mobileNo);
            this.SetValueAndDisable('email', response.mask_emailId);

            this.ToggleFormOneAndTwo();
            this.ToggleSubmitBtn();
          },
          error: (error) => {
            this.ToggleSubmitBtn();
            if(error.status){
              // this._toast.ShowWarning(error.statusText)
              this._alert.ShowWarning("Error",0,error.statusText,true)
            }
            console.log(error);
          },
        });
    }
  }

  SetValueAndDisable(controlName: string, value: any) {
    this.forgotFormControl[controlName].setValue(value);
    this.forgotFormControl[controlName].disabled;
  }


  submittingBtn: boolean = true;

  ToggleSubmitBtn() {
    this.submittingBtn = !this.submittingBtn;
  }

  ToggleFormOneAndTwo() {
    this.templateOne = !this.templateOne;
    this.templateTwo = !this.templateTwo;
  }

  ToggleFormTwoAndThree() {
    this.templateTwo = !this.templateTwo;
    this.templatethree = !this.templatethree;
  }

  showResendButton: boolean = true;
  ResendOTP() {
    this.GetOTP()
    this._alert.ShowSuccess('New OTP is sent. Please check your device');
    this.ToggleTimerAndResend()
  }

  otpId: any;
  showTimer: any = false;
  SendOTP() {
    this.GetOTP()
    this._alert.ShowSuccess('OTP Sent Successfully');
    this.ToggleFormTwoAndThree();
    this.ToggleTimerAndResend()
  }

  ToggleTimerAndResend(){
    this.showTimer = !this.showTimer
    this.showResendButton = !this.showResendButton
  }

  GetOTP(){
    this._auth.Login(this.userInfo.username,'','otp',2).pipe().subscribe({
      next: (response:any) => {
        console.log(response)
        this.otpId = response.otpId;
      }
    })
  }

  GoToPreviousPage() {
    this._location.back();
  }

  DataFromTimerCompo(event: any) {
    console.log('data from timer compo ' + event);
    this.showResendButton = event;
    this.showTimer = false;
  }


  VerifyOTP(value: any) {
    console.log(value);
    if (value == null) {
      this.forgotFormControl['forgetotp'].markAsTouched();
    } else {
      this.ForgotPasswordConfirm(value);
      // this.showTimer = true
      // this.showResendButton = true;
    }
  }

  ForgotPasswordConfirm(enteredOTP: any) {
    this._auth
      .ForgotPasswordConfirm(this.otpId, enteredOTP, this.userInfo?.mobileNo)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (response) => {
            if (!response) {
              this._alert.ShowWarning('Invalid OTP',0,"Please enter a valid OTP",true);
            } else {
              this._storage.SetUserNameAndId(this.userInfo);
              // this._alert.ShowSuccess("")
              this._route.navigate(['/reset-password']);
            }
        },
        error: (error) => {
          if (error?.error?.status == 400) {
            // this._toast.ShowWarning(error?.error?.title + 'Please check your OTP');
            this._alert.ShowWarning(error?.error?.title + 'Please check your OTP');
          }

          if (error?.error?.status == 500) {
            // this._toast.ShowWarning('Something went wrong. Please check your internet connection');
            this._alert.ShowWarning('500 Error',0,error.error,true);
          }
        },
      });
  }

  ngOnDestroy() {
    this.unsubscribe.unsubscribe();
  }
}

//interface

export interface IUserInfo {
  userId: number;
  name: string;
  username: string;
  emailId: string;
  mask_emailId: string;
  mobileNo: string;
  mask_mobileNo: string;
  multipleExist: boolean;
  otpGeneratedId: number;
}
