import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AlertService } from 'src/app/_common/services/alert.service';
import { DoActcService } from 'src/app/_common/services/manage-actc/do-actc.service';
import { StorageService } from 'src/app/_common/services/storage.service';
import { INSFInfo } from '../../../manage-actc-list/manage-actc-list.component';

@Component({
  selector: 'coaches-development-program',
  templateUrl: './coaches-development-program.component.html',
  styleUrls: ['./coaches-development-program.component.scss']
})
export class CoachesDevelopmentProgramComponent implements OnInit {
  @Input() year: any
  @Input() isEditable!: boolean;
  @Input() routeData!: INSFInfo

  constructor(private modalService: NgbModal, private _localStorage: StorageService, private _ACTCDOservice: DoActcService, private _alert: AlertService, private _fb: FormBuilder, private _router: Router) { }

  userDetail: any;
  do_sdo_developmentPlanForCoach$: Observable<any> = new Observable()
  do_sdo_developmentPlanForReferee$: Observable<any> = new Observable()
  unsubscribe: Subject<any> = new Subject;
  NSFRoleId: number = 1002
  DORoleId: number = 106;
  SDORoleId: number = 47;
  DO_formSubmit!: FormGroup;
  SDO_formSubmit!: FormGroup
  @ViewChild('DOModal') DOModal!: ElementRef
  @ViewChild('SDOModal') SDOModal!: ElementRef

  ngOnInit(): void {
    this.userDetail = this._localStorage.GetUserAllCredentials();
    this.Get_Do_Sdo_developmentPlan();
    this.DO_formSubmit = this.DOFinalSubmissionForm();
    this.SDO_formSubmit = this.SDOFinalSubmissionForm();
  }

  DOFinalSubmissionForm() {
    return this._fb.group({
      forwardTo: ['backToNSF', Validators.required],
      comment: ['']
    })
  }
  SDOFinalSubmissionForm() {

    return this._fb.group({
      forwardTo: ['backToDO', Validators.required],
      comment: ['']
    })
  }

  openModal() {
    if (this.userDetail.role_id == 106) this.modalService.open(this.DOModal, { size: 'lg', centered: true })
    if (this.userDetail.role_id == 47) this.modalService.open(this.SDOModal, { size: 'lg', centered: true })
  }

  finalSubmission(formVal: any) {
    console.log(formVal)
    if (formVal.forwardTo == 'backToNSF') {
      this._ACTCDOservice.ForwardForm(this.userDetail.user_id, this.year, this.routeData.sport_detail_id, this.userDetail.role_id, this.NSFRoleId, '').pipe(takeUntil(this.unsubscribe)).subscribe(res => {
        if (res) {
          this._alert.ShowSuccess("Data Forwarded To NSF Successfully");
          this.navigateToManageACTC();
        }
        else this._alert.ShowWarning("Something Went Wrong!! Please try again")
      })
    }
    if (formVal.forwardTo == 'forwardToSDO') {
      this._ACTCDOservice.SubmitForm(this.userDetail.user_id, this.year, this.routeData.sport_detail_id, this.userDetail.role_id, '').pipe(takeUntil(this.unsubscribe)).subscribe(res => {
        if (res) {
          this._alert.ShowSuccess("Data Submitted To SDO Successfully");
          this.navigateToManageACTC();
        }
        else this._alert.ShowWarning("Something Went Wrong!! Please try again");
      })
    }
    if (formVal.forwardTo == 'backToDO') {
      this._ACTCDOservice.ForwardForm(this.userDetail.user_id, this.year, this.routeData.sport_detail_id, this.userDetail.role_id, this.DORoleId, '').pipe(takeUntil(this.unsubscribe)).subscribe(res => {
        if (res) {
          this._alert.ShowSuccess("Data Forwarded To DO Successfully");
          this.navigateToManageACTC();
        }
        else this._alert.ShowWarning("Something Went Wrong!! Please try again")
      })
    }
    if (formVal.forwardTo == 'approve') {
      this._ACTCDOservice.SubmitForm(this.userDetail.user_id, this.year, this.routeData.sport_detail_id, this.userDetail.role_id, '').pipe(takeUntil(this.unsubscribe)).subscribe(res => {
        if (res) {
          this._alert.ShowSuccess("Approved Successfully");
          this.navigateToManageACTC();
        }
        else this._alert.ShowWarning("Something Went Wrong!! Please try again")
      })
    }
    if (formVal.forwardTo == 'reject') {
      this._ACTCDOservice.RejectFormBySDO(this.userDetail.user_id, this.year, this.routeData.sport_detail_id, this.userDetail.role_id, '').pipe(takeUntil(this.unsubscribe)).subscribe(res => { if(res){
        this._alert.ShowSuccess("Form Rejected");
        this.navigateToManageACTC();
      } 
      else this._alert.ShowWarning("Something Went Wrong!! Please try again") })
    }
    this.modalService.dismissAll();
  }

  navigateToManageACTC(){
    this._router.navigate(['manage-actc/list']);
  }

  Get_Do_Sdo_developmentPlan() {
    this.do_sdo_developmentPlanForCoach$ = this._ACTCDOservice.Get_Development_Plan(this.year, this.routeData.sport_detail_id, "Coach")
    this.do_sdo_developmentPlanForReferee$ = this._ACTCDOservice.Get_Development_Plan(this.year, this.routeData.sport_detail_id, "Refree")
  }
}
