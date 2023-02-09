import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';
import { AddModalWindowComponent } from 'src/app/_common/modal-windows/add-modal-window/add-modal-window.component';
import { DO } from './user-info-array';
import { CommonFormsService } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { Subject, takeUntil } from 'rxjs';
import { AlertService } from 'src/app/_common/services/alert.service';
import { RouteDateService } from 'src/app/_common/services/route-date.service';
@Component({
  selector: 'app-nsf',
  templateUrl: './nsf-dashboard.component.html',
  styleUrls: ['./nsf-dashboard.component.scss'],
  // host: {
  //   "(window:click)": "onClick()"
  // }

})
export class NsfDashboardComponent implements OnInit {

  showOptionNSF: boolean = false;
  showOptionDO: boolean = false;
  loginUserData: any;
  role_name: string = '';
  userDetail!: IUserCredentials<any>
  linksForDO = DO;
  unsubscribe: Subject<any> = new Subject;
  showLoader: boolean = false;

  constructor(private _router: Router, private eRef: ElementRef, private _localStorage: StorageService, private modalService: NgbModal, private _commonApi: CommonFormsService,
    private _alert: AlertService,private _routeDate:RouteDateService) {
    this.loginUserData = this._localStorage.getUserData()
  }

  @HostListener('document:click', ['$event']) OnClick() {
    console.log("Mouse is clicked outside");
  }

  ngOnInit() {
    this.userDetail = this._localStorage.GetUserAllCredentials()
    this.role_name = this.userDetail.role_name
  }

  ManageACTC() {
    this._router.navigate(['manage-actc/list'])
  }

  clickOut(event: any) {
    if (event.target.id != 'dropdownList') this.showOptionNSF = true;
  }
  currentYear: number = new Date().getFullYear();
  NavigateToFormA() {
    this.ToggleLoader()
    this._commonApi.GetACTCList(this.loginUserData.role_id, this.loginUserData.user_id).pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (response: Array<any>) => {
        this.ToggleLoader()
        let currentYearArr: Array<any> = [];
        response.forEach((data: any) => {
          (data.financialYear == this.currentYear) ? currentYearArr.push(data) : currentYearArr = []
        });

        (currentYearArr.length <= 0) ? this._alert.ShowWarning('DO has not enabled ACTC form for this year yet', 0, 'Please contact your DO', true, 'OK') : this._localStorage.SetYear(this.currentYear),this._router.navigate(['/nsf-forms', this.currentYear]);
      }
    })
  }

  ToggleLoader(){
    this.showLoader = !this.showLoader
  }

  isShow() {
    if (this.loginUserData?.role_id == 1002) {
      this.showOptionNSF = !this.showOptionNSF;
    } else {
      this.showOptionDO = !this.showOptionDO;
    }
  }
  clickedOutside() {
    this.showOptionNSF = false;
    this.showOptionDO = false;
  }

  CheckUrlAndNavigate(data: string) {
    if (data == '') return
    else if (data == 'EAS') this.submissionForNSF()
    else this._router.navigate([data])
  }


  submissionForNSF() {
    this.modalService.open(AddModalWindowComponent, { size: 'lg', centered: true, backdrop: 'static', keyboard: false, });
  }

  ngOnDestroy() {
    this.unsubscribe.next(1);
    this.unsubscribe.complete();
  }
}
