import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import  { Location } from '@angular/common'
import { ConfirmedValidator } from 'src/app/_common/validators/password.validator';
import { AuthenticationService } from 'src/app/_common/services/authentication.service';
import { StorageService } from 'src/app/_common/services/storage.service';
import { ToastService } from 'src/app/_common/services/toast.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/_common/services/alert.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  show = false;
  shows = false ;
  confirmpasswords:any;
  password:any;
  resetPasswordFrom: FormGroup

  constructor(private _fb: FormBuilder,private _location:Location , private _rendere:Renderer2, private _api:AuthenticationService,
    private _storage:StorageService, private _toast:ToastService, private _router:Router, private _alert:AlertService) {
    this.resetPasswordFrom = this._fb.group({
      newpass:[null, Validators.compose([Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/)])],
      confirmpass:[null, Validators.compose([Validators.required]) ]
    }, { 
      validators: ConfirmedValidator('newpass', 'confirmpass') // return { "notMatched" : true }
    })
  }

  get resetPasswordFromControl(){
    return this.resetPasswordFrom.controls
  }

  data:any
  ngOnInit() {
    this.password = 'password';
    this.confirmpasswords = 'password';
    this.data = this._storage.GetUserNameAndId()
    console.log(this.data)
   
  }
  passwords(){
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }
ccc(){
  
  if (this.confirmpasswords === 'password') {
    this.confirmpasswords = 'text';
    this.shows = true;
  } else {
    this.confirmpasswords = 'password';
    this.shows = false;
  }
  
}

  @ViewChild("resetPassword") resetPassword!:ElementRef
  ngAfterViewInit(){
    this.resetPassword
  }

  GoToPreviousPage(){
    this._location.back()
  }

  ResetPassword(formData:any){
    console.log(formData)
    console.log(this.data)
    if(this.resetPasswordFrom.invalid){
      console.log("form is invalid")
      this.resetPasswordFrom.markAllAsTouched()
    }else{
      this._api.ResetPassword(this.data.userId,this.data.username,formData.confirmpass).subscribe({
        next: (response) => {
          this._alert.ShowSuccess("Password Updated")
          this._router.navigate(['/login'])
        },
        error: (error) => {
          if(error.status == 405){
            this._alert.ShowWarning("405 Error",0,error,true)
          }
        }
      })
      console.log("form is valid. Api is called")
    }
  }

}
