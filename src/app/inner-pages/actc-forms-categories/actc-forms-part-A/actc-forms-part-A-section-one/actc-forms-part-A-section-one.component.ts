import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild, ChangeDetectionStrategy, TemplateRef } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { concatMap, map, Observable, Subject, Subscription, take, takeUntil } from 'rxjs'
import { CommonFormsService } from "src/app/_common/services/actc-forms-service/common-forms.service";
import { ActcFormsService } from "src/app/_common/services/actc-forms.service";
import { AlertService } from "src/app/_common/services/alert.service";
import { IUserCredentials, StorageService } from "src/app/_common/services/storage.service";
import { EmailValidator } from "src/app/_common/validators/email.validator";

@Component({
  selector: 'app-actc-forms-part-A-section-one',
  templateUrl: './actc-forms-part-A-section-one.component.html',
  styleUrls: ['./actc-forms-part-A-section-one.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActcFormsPartASectionOneComponent implements OnInit {

  sectionOneForm: FormGroup;
  presentYear: any;
  userDetail!: IUserCredentials<any>
  isDisabled: boolean = false;
  
  designationDD:Array<string> = ["President","Secretary General","CEO"]
  tableHeading:Array<string> = ["NAME","DESIGNATION","EMAIL ID","MOBILE NO.","OFFICE NO.","REMARKS","ACTION"]
  @Input() formListData!: any
  @Input() year: any
  @Output() dataFromChild: EventEmitter<any> = new EventEmitter()

  constructor(private _fb: FormBuilder, private _alert: AlertService,private _actc: ActcFormsService, 
    private _localStorage: StorageService, private _commonACTC: CommonFormsService,
    private _renderer:Renderer2) {
    this.GetUserDetail()
    this.sectionOneForm = this.AddFormGroup()
  }

  AddFormGroup() {
    return this._fb.group({
      firstStepNew: this._fb.array([])
    })
  }

  ngOnInit() {
    this.GetPartAIntroductionData()
  }

  ngOnDestroy() {
    this.unsubscribe.next(1)
    this.unsubscribe.complete()
  }

  GetUserDetail() {
    this.userDetail = this._localStorage.GetUserAllCredentials()
  }

  introductionData$: Observable<any> = new Observable()
  GetPartAIntroductionData() {
    this.presentYear = this.year
    this.introductionData$ = this._commonACTC.FormSubmitFlowStatus(this.userDetail.user_id, this.presentYear, this.userDetail.sportId, this.userDetail.role_id).pipe(
      concatMap(flowStatus => this._actc.GetPartAIntroductionData(this.userDetail.sportId, this.presentYear).pipe(
        map((response: DetailList) => {
          (response.OfficialDetailsList.length != 0) ? this.AddNewField(response.OfficialDetailsList) : this.AddNewField()
          if (!flowStatus.IsEditable) this.sectionOneForm.disable({ onlySelf: true })
          else this.sectionOneForm.enable()
          this.isDisabled = !flowStatus.IsEditable
          return response
        }),
      )
      )
    )
  }

  unsubscribe: Subject<any> = new Subject()
  AddNewField(array?: any) {
    if (array != null) {
      array.forEach((response: OfficialDetailsList) => {
        this.NewFirstStepFormArray?.push(this.AddFirstSectionInputFields(response))
      })
    } else {
      this.NewFirstStepFormArray.push(this.AddFirstSectionInputFields())
    }
  }

  RemoveField(index: number, formArrayName: FormArray) {
      if (index == 0) { return }
      else {
        formArrayName.removeAt(index)
        // if (formArrayName.length > 1) {
        //   formArrayName.removeAt(index);
        // } else {
        //   formArrayName.reset();
        // }
      }
  }

  get NewFirstStepFormArray() {
    return this.sectionOneForm?.controls['firstStepNew'] as FormArray
  }

  private AddFirstSectionInputFields(data?: OfficialDetailsList): FormGroup {
    return this._fb.group({
      Id: [data?.Id || 0],
      Name: [data?.Name || "", Validators.compose([Validators.required, Validators.pattern(/^[A-Za-z\s]{0,50}$/)])],
      Designation: [data?.Designation || "", Validators.compose([Validators.required])],
      EmailId: [data?.EmailId || "", Validators.compose([Validators.required, EmailValidator])],
      MobileNo: [data?.MobileNo || "", Validators.compose([Validators.required, Validators.pattern(/^[6-9]\d{9}$/)])],
      OfficeNo: [data?.OfficeNo || "", Validators.compose([Validators.required, Validators.pattern(/^[0-9]{1,11}$/)])],
      Remarks: [data?.Remarks || "", Validators.compose([Validators.pattern(/^[ A-Za-z0-9_@./#&+-/s]{0,100}$/)])],
      sportId: [this.userDetail?.sportId],
      Fin_Year: [data?.Fin_Year || this.presentYear]
    })
  }

  NextButton(editableStatus: boolean, formData: any, form: any) {
    if (editableStatus) this.GoToSectionTwo()
    else this.SaveForm(formData, form)
  }


  @ViewChild("loader") loader!:TemplateRef<any>

  showLoader:boolean = false
  SaveForm(formData: any, form: any) {
    this.ToggleLoader()
    let completeList = [...formData.firstStepNew]
    if (!form.valid) {
      this.sectionOneForm.markAllAsTouched()
      this._alert.ShowWarning('Invalid data input', 0, "Please enter valid information.", true, "OK");
    } else {
      this._actc.SavePartAIntroductionData(this.userDetail.user_id, completeList).pipe(
        takeUntil(this.unsubscribe)
      ).subscribe({
        next: (response) => {
          this.ToggleLoader()
          if (response) {
            this.dataFromChild.emit(this.formListData)
            this._alert.ShowSuccess("Data Saved Successfully")
          }
        },
        error: (response) => {
          this.ToggleLoader()
          this._alert.ShowWarning('Error !',0,response,true)
        }
      })
    }
  }

  ToggleLoader(){
    this.showLoader = !this.showLoader
  }

  GoToSectionTwo(): void {
    this.dataFromChild.emit('Form_PartA_02')
  }

  GoToHome() {
    this.dataFromChild.emit('Form_PartA_home')
  }

  get FieldMandatoryMessage(){
    return "This field is mandatory"
  }

  get DisableAddButton(){
    return this._commonACTC.DisableWhenFormIsInvalid(this.NewFirstStepFormArray)
  }

  get NameErrorMessage() {
    return "Only 50 Alphabets are allowed"
  }

  get MobileErrorMessage() {
    return "Invalid Mobile Number"
  }

  get OfficeErrorMessage() {
    return "Invalid Office Number"
  }

  get RemarksErrorMessage() {
    return "Only 100 Alphabets are allowed"
  }

  get ValidEmailMessage(){
    return "Please Enter valid email"
  }

}

export interface DetailList {
  OfficialDetailsList: OfficialDetailsList[]
}

export interface OfficialDetailsList {
  Id: number
  Name: string
  Designation: string
  EmailId: string
  MobileNo: string
  OfficeNo: string
  Remarks: string
  sportId: number
  Fin_Year: number
}
