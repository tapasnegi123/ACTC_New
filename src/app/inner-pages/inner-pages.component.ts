import { StorageService } from './../_common/services/storage.service';
import { AlertService } from './../_common/services/alert.service';
import { Component, inject } from "@angular/core"
import { Subscription } from "rxjs"
import { ActcFormsService } from '../_common/services/actc-forms.service';
import { AuthenticationService } from '../_common/services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: "app-inner-pages",
    templateUrl: "./inner-pages.component.html",
    styleUrls: ["./inner-pages.component.scss"]
})

export class InnerPagesComponent{

    _alert = inject(AlertService)
    _actcService = inject(ActcFormsService)
    _localStorage = inject(StorageService)
    _auth = inject(AuthenticationService)
    
    loginUserData:any

    ngOnInit(){
    this.loginUserData = this._localStorage.getUserData()
    this.GetUserDetails()
    }

    userDetail:any
    subscription:Subscription = new Subscription()
    GetUserDetails(){
      this.subscription = this._actcService.GetUserDetail(this.loginUserData.user_id,this.loginUserData.role_id).subscribe({
        next : (response:any) => {
          if(response == null){
            this._alert.ShowWarning("User not found")
            this._auth.LogoutAndNavigateToLogin()
          }
          this._localStorage.SetUserDetailAfterLogin(response)
          this.userDetail = response
        },
        error : (error:HttpErrorResponse) => {
          this._alert.ShowWarning("No Data Found",0,error.message,true)
          this._auth.LogoutAndNavigateToLogin()
        }
      })
    }
  
  
    ngOnDestroy(){
      this.subscription.unsubscribe()
    }
    
}