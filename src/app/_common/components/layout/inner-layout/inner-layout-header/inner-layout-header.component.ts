import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordModalWindowComponent } from 'src/app/_common/modal-windows/change-password-modal-window/change-password-modal-window.component';
import { AuthenticationService } from 'src/app/_common/services/authentication.service';
import { StorageService } from 'src/app/_common/services/storage.service';

@Component({
  selector: 'app-inner-layout-header',
  templateUrl: './inner-layout-header.component.html',
  styleUrls: ['./inner-layout-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InnerLayoutHeaderComponent implements OnInit {


  objLinks:ILinks[] = [
    {link:"/dashboard",src:"/assets/images/dashboard/home-actc-new-logo.svg",title:"Home"},
    {link:"/manage-actc/list",src:"/assets/images/sidebar/verifed.svg",title:"Manage ACTC"},
    {link:"/proposal-list",src:"/assets/images/sidebar/proposed.svg",title:"Proposals"},
    // {link:"",src:"/assets/images/sidebar/phone-line (1).svg",title:"Contact Us"},
    // {link:"",src:"/assets/images/sidebar/download-2-line (1).svg",title:"Downloads"},
    // {link:"",src:"/assets/images/sidebar/setting.svg",title:"Setting"},
    // {link:"",src:"/assets/images/sidebar/file.svg",title:"Reports"},
    {link:"/tournaments",src:"/assets/images/sidebar/file.svg",title:"Tournaments"},
    {link:"/equipments",src:"/assets/images/sidebar/equipment.svg",title:"Equipments"},
    {link:"/age-category",src:"/assets/images/sidebar/age-category.svg",title:"Age Category"},
  ]

  doSdoLinks:ILinks[] = [
    {link:"/dashboard",src:"/assets/images/dashboard/home-actc-new-logo.svg",title:"Home"},
    {link:"/manage-actc/list",src:"/assets/images/sidebar/verifed.svg",title:"Manage ACTC"},
    {link:"/proposal-list",src:"/assets/images/sidebar/proposed.svg",title:"Proposals"},
  ]
  

  @ViewChild('contentSidebar') contentSidebarOff: any;
  constructor(
    private _auth: AuthenticationService,
    private _modal: NgbModal,
    private _router: Router,
    private offcanvasService: NgbOffcanvas,
    private _localStorage: StorageService
  ) {
  }

  ngOnInit() {
    this.GetUserDetail()
  }

  LogOut() {
    console.log('log out button');
    this._auth.LogOut();
    this._router.navigate(['home']);
  }

  OpenChangePasswordModal() {
    this._modal.open(ChangePasswordModalWindowComponent);
  }

  openSideMenu() {
    this.offcanvasService.open(this.contentSidebarOff, {
      panelClass: 'sidebarBody',
    });
  }

  FirstChar:any
  userDetail:any
  GetUserDetail() {
    this.userDetail = this._localStorage.getUserData()!
    this.FirstChar = (this.userDetail?.user_name).charAt(0)
    console.log(this.userDetail)
  }
}

export interface ILinks{
  src:string,
  link:string,
  title:string,
}