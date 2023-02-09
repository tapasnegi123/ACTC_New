import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';
import { INSFInfo } from './manage-actc-list/manage-actc-list.component';

@Component({
  selector: 'app-manage-actc',
  templateUrl: './manage-actc.component.html',
  styleUrls: ['./manage-actc.component.scss']
})
export class ManageActcComponent implements OnInit {
  userDetail?:IUserCredentials<any>

  constructor(private _localStorage:StorageService,private _router:Router) {
  }
  
  showView = 1
  ngOnInit(): void {
    this.userDetail = this._localStorage.GetUserAllCredentials();
  }

  // year:any
  // DataFromChild(data:INSFInfo){
  //   console.log(data)
  //   this.year = data.financialYear
  //   this.showView = data.toggleStatus
  // }

  ReleaseMOM(){
    this._router.navigate(['manage-actc/release-mom'])
  }

}
