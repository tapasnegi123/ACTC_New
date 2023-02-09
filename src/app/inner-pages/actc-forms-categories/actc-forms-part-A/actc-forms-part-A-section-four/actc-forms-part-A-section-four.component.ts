import { AlertService } from './../../../../_common/services/alert.service';
import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, forkJoin, map, Observable, Subject, takeUntil } from 'rxjs';
import { CommonFormsService, IFormList } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { ACTCFormsPartAService } from 'src/app/_common/services/actc-forms-service/part-a.service';
import { ActcFormsService } from 'src/app/_common/services/actc-forms.service';

import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';

@Component({
  selector: 'app-actc-forms-part-A-section-four',
  templateUrl: './actc-forms-part-A-section-four.component.html',
  styleUrls: ['./actc-forms-part-A-section-four.component.scss']
})
export class ActcFormsPartASectionFourComponent implements OnInit {
  @Input() year: any
  @Output() dataFromChild: EventEmitter<any> = new EventEmitter<any>()
  @Input() formListData!:IFormList

  sectionFourthForm!:FormGroup
  presentYear: any;
  unsubscribe: Subject<any> = new Subject();
  isDisabled: boolean = false;

  constructor(private _fb: FormBuilder, private _renderer: Renderer2, private _alert: AlertService,
    private _localStorage: StorageService, private _actc: ActcFormsService, private _actcCommon: CommonFormsService,
    private _partAService: ACTCFormsPartAService) {
    this.sectionFourthForm = this.AddFormControls()
    this.GetUserDetail()
    this.GetPresetYear()
  }

  AddFormControls() {
    return this._fb.group({
      firstSection: this._fb.array([])
    })
  }


  filteredOptions: Observable<any[]> | undefined;
  ngOnInit() {
    console.log(this.formListData)
    this.GetData();
  }

  GetPresetYear() {
    this.presentYear = new Date().getFullYear()
  }

  completeData$: Observable<any> = new Observable();
  SectionFourData: any
  competitionDDArray: any = [];
  competitionDDArrayLastTwoYear: any = [];
  stateDDArray: Array<any> = [];
  ageCategoryArray: Array<any> = [];

  GetData() {
    this.presentYear = this.year;
    let formStatus$ = this._actcCommon.FormSubmitFlowStatus(this.userData.user_id, this.presentYear, this.userDetail.sportId, this.userData.role_id)
    let GetPartASection4$ = this._partAService.GetPartASection4(this.presentYear, this.userDetail?.sportId, 'senior')
    // let getComptetionDDByFilterNew$: Observable<any> = this._actcCommon.GetCompetitionList(this.userDetail.sportId, 'senior', '')
    let getComptetionDDByFilterNew$: Observable<any> = this._actcCommon.GetComptetionByFilterLast2Year(this.userData.sportId,this.presentYear,'senior','')
    let getStateDD$ = this._actc.GetStateDD()
    let ageCategory$ = this._actcCommon.GetAgeGroupDD()
    this.completeData$ = forkJoin([getComptetionDDByFilterNew$, getStateDD$, ageCategory$, GetPartASection4$,formStatus$]).pipe(
      map(([getComptetionDDByFilter, getStateDD, ageCategory, GetPartASection4,formStatus]) => {
        this.SectionFourData = GetPartASection4
        if (this.SectionFourData.length == 0) {
          this.AddNewField();
        }
        console.log(getComptetionDDByFilter)

        this.competitionDDArray = [...getComptetionDDByFilter];
        this.competitionDDArrayLastTwoYear = [...getComptetionDDByFilter] 
        for (let i of this.competitionDDArray) { if (i.tournament_year == '2021' || i.tournament_year == '2022') this.competitionDDArrayLastTwoYear.push(i) }
        this.stateDDArray = getStateDD;
        this.ageCategoryArray = ageCategory
        this.SectionFourData.forEach((x: any, index: any) => {
          this.FirstStepFormArray.push(this.CompetitionOrganizedInLastTwoYears(x, index))
        })
        if(!formStatus.IsEditable){
          this.isDisabled = true
          this.sectionFourthForm.disable({onlySelf:this.isDisabled})
        }
        return true;
      }), catchError(async (err) => console.log(err))
    )
  }

  CheckForIsEditable(formDataValue?: any, formData?: any){
    if(this.isDisabled)this.GoToNextForm()
    else this.SaveForm(formDataValue,formData)
  }

  showLoader!:boolean
  SaveForm(formDataValue: any, formData?: any) {
    this.showLoader = true
    let Competitions_organized: Array<any> = formDataValue.firstSection.map((element: any, index: any) => {
      element.Best5 = element.Best5.toString()
      return element
    });
    if (!formData.valid) {
      this.sectionFourthForm.markAllAsTouched();
      this._alert.ShowWarning('Invalid data input',0,"Please enter valid information.",true,"OK");
    } else {
      this._partAService.SavePartASection4(this.userData.user_id, this.presentYear, this.userDetail.sportId, Competitions_organized).pipe(
        takeUntil(this.unsubscribe)).subscribe({
        next: ((response: any) => {
          if (response) {
            this.showLoader = false
            this.dataFromChild.emit(this.formListData)
            this._alert.ShowSuccess("Data Saved Successfully.")
          } else {
            this._alert.ShowWarning("Unable to save form.",0,"Please try again.",true)
          }
        }),
        error: (error) => {
          this._alert.ShowWarning("Error",0,error,true)
        }
      })
    }
  }

  userDetail: any
  userData!: IUserCredentials<any>
  GetUserDetail() {
    this.userDetail = this._localStorage.GetUserDetailAfterLogin();
    this.userData = this._localStorage.GetUserAllCredentials()
  }

  AddNewField() {
    this.FirstStepFormArray.push(this.CompetitionOrganizedInLastTwoYears());
  }

  setVanueDetailsOnComptetionSelection(tId: any, index: number, formArray: any) {
    if (tId != undefined) {
      this._actc.GetComptetionDetails(tId).pipe(takeUntil(this.unsubscribe)).subscribe({
        next: ((res: any) => {
          console.log(res);
          formArray.controls[index].get('Center_Name').patchValue(res?.place)
          formArray.controls[index].get('State_Id').patchValue(res?.state_id)
          formArray.controls[index].get('State')?.patchValue(res?.state)
          formArray.controls[index].get('city').patchValue(res?.city)
          formArray.controls[index].get('City_Id').patchValue(res?.city_id)
          formArray.controls[index].get('From_Date').patchValue(this._actcCommon.ConvertStringToCalendarDateFormat(res?.from_date))
          formArray.controls[index].get('To_Date').patchValue(this._actcCommon.ConvertStringToCalendarDateFormat(res?.to_date))
        })
      })
    }
  }


  GoToPreviousForm() {
    this.dataFromChild.emit("Form_PartA_03")
  }

  GoToNextForm() {
    this.dataFromChild.emit("Form_PartA_05")
  }


  PatchValue(index: number, formControlName: string, valueToBePatched: any) {
    if (formControlName == ("fromDate" || "toDate")) {
      this.FirstStepFormArray.controls[index].get(formControlName)?.patchValue(this._actcCommon.ConvertStringToCalendarDateFormat(valueToBePatched))
    } else {
      this.FirstStepFormArray.controls[index].get(formControlName)?.patchValue(valueToBePatched)
    }
  }

  DisableAddButton(form: any) {
    return this._actcCommon.DisableWhenFormIsInvalid(form)
  }

  RemoveField(index: number, event?: any) {
    const elementId = event.target.id
    let step = this.FirstStepFormArray
    step?.removeAt(index)
    let newData: any
  }

  private CompetitionOrganizedInLastTwoYears(data?: ICompetitionDetailAndEventDD, index?: any) {
    return this._fb.group({
      ID: [data?.ID || 0],
      TournamentId: [data?.TournamentId || ''],
      TournamentName: [data?.TournamentName || "0"],
      Category: [data?.Category || "senior"],
      Level: [data?.Level || "International"],
      year: [data?.year || this.presentYear],
      SportId: [data?.SportId || this.userDetail?.sportId],
      State_participate: [data?.State_participate || "", Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,2}$/)])],
      Athlete_participate: [data?.Athlete_participate || "", Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])],
      Best5: [this.ConverttoInt(data?.Best5), Validators.required],
      Remarks: [data?.Remarks || "", Validators.compose([Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      Age_Category: [data?.Age_Category || "", Validators.required],
      // Center_Name: [{ value: this.setVanueDetailsOnComptetionSelection(data?.TournamentId, index, this.FirstStepFormArray), disabled: true }, Validators.compose([Validators.required, Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      Center_Name: [data?.Center_Name || ""],
      State_Id: [ data?.State_Id || ''],
      City_Id: [data?.City_Id ],
      // city: [{ value: data?.city || '', disabled: true }, Validators.compose([Validators.required, Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      city: [data?.city || ""],
      // From_Date: [{ value:"", disabled: true }],
      From_Date: [data?.From_Date || ""],
      // To_Date: [{ value: "", disabled: true }]
      To_Date: [data?.To_Date || ""],
      State:[data?.State || ""]
    })
  }

  ConverttoInt(data: any) {
    return data != undefined ? data?.split(',').map(Number) : []
  }

  protected MinMaxDate(formArrayName: FormArray, formControlName: string, index: number) {
    return this._actcCommon.MinMaxDate(formArrayName, formControlName, index)
  }

  get FirstStepFormArray() {
    return this.sectionFourthForm.controls['firstSection'] as FormArray;
  }

  get FieldRequiredError() {
    return "This Field Is Required"
  }

  get ParticiaptingStatesError() {
    return "Invalid Number"
  }

  ngOnDestroy() {
    this.unsubscribe.next(1)
    this.unsubscribe.complete()
  }
}

export interface ICompetitionDetailAndEventDD {
  ID: number
  TournamentId: number
  TournamentName: string
  Category: string
  Level: string
  year: number
  SportId: number
  State_participate: number
  Athlete_participate: number
  Best5: string
  Remarks: string
  Age_Category: string
  Center_Name: string
  State_Id: number
  City_Id: number
  city: string
  From_Date: string
  To_Date: string
  State:string
}