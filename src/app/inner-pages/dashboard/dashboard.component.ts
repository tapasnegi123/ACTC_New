import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, Subscription } from 'rxjs';
import { ActcFormsService } from 'src/app/_common/services/actc-forms.service';
import { AlertService } from 'src/app/_common/services/alert.service';
import { AuthenticationService } from 'src/app/_common/services/authentication.service';
import { StorageService } from 'src/app/_common/services/storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loginUserData:any
  constructor(private _router:Router, private _localStorage:StorageService,private _alert:AlertService,
    private _actcService:ActcFormsService, private _auth:AuthenticationService) {
    this.loginUserData = this._localStorage.getUserData()
  }

  ngOnInit() {
    // this.GetUserDetails()
  }


}
