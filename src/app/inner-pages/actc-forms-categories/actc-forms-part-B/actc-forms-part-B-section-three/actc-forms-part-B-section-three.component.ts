import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, forkJoin, map, Observable, Subject, takeUntil } from 'rxjs';
import { CommonFormsService, IFormList } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { IGetPartBSectionThreeData, PartBService } from 'src/app/_common/services/actc-forms-service/part-b.services';
import { AlertService } from 'src/app/_common/services/alert.service';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';

@Component({
  selector: 'app-actc-forms-part-B-section-three',
  templateUrl: './actc-forms-part-B-section-three.component.html',
  styleUrls: ['./actc-forms-part-B-section-three.component.scss']
})
export class ActcFormsPartBSectionThreeComponent implements OnInit {
  @Output() dataFromChild: any = new EventEmitter()
  @Input() year: any;
  @Input() formListData!: IFormList;
  sectionThreeForm: any;
  userDetail!: IUserCredentials<any>;
  partBThreeData: any;
  kid: any
  unsubscribe: Subject<any> = new Subject();
  category: string = 'junior';
  isDisabled:boolean = false;

  constructor(private fb: FormBuilder, private _api: PartBService, private localstorage: StorageService,
    private _alert: AlertService, private _commonApi: CommonFormsService) {
    this.sectionThreeForm = this.AddFormGroup()
  }
  presentYear = new Date().getFullYear()
  ngOnInit() {
    this.getdetails();
    this.SectionThree();
  }
  State: any;
  AgeGroup: any;
  Event: any;
  getPartBData$: Observable<any> = new Observable();
  getState$: Observable<any> = new Observable();
  getCity$: Observable<any> = new Observable();
  EventData: any;
  getEvent$: Observable<any> = new Observable();
  getEventData$: Observable<any> = new Observable();
  getAgeGroup$: Observable<any> = new Observable();
  completeData$: Observable<any> = new Observable();
  cmptId: any;

  SectionThree() {
    this.presentYear = this.year;
    this.GetFlowStatus();
    this.getPartBData$ = this._api.GetPartBSectionThreeData(this.presentYear, this.userDetail.sportId, this.category)
    this.getState$ = this._commonApi.GetStateDD();
    this.getAgeGroup$ = this._commonApi.GetAgeGroupDD()
    this.getEvent$ = this._commonApi.GetComptetionByFilterLast2Year(this.userDetail.sportId,this.presentYear,"junior","national")
    this.completeData$ = forkJoin([this.getPartBData$, this.getState$, this.getAgeGroup$, this.getEvent$]).pipe(
      map((response: any) => {
        this.partBThreeData = [...response[0]];
        this.State = [...response[1]];
        this.AgeGroup = [...response[2]]
        this.Event = [...response[3]]
        this.AddNewData(this.partBThreeData)
        if (this.isDisabled) this.sectionThreeForm.disable({ onlySelf: true });
        return true
      })
    )
  }

  GetFlowStatus() {
    this._commonApi.FormSubmitFlowStatus(this.userDetail?.user_id, this.year, this.userDetail?.sportId, this.userDetail?.role_id).subscribe(flowStatus => {
      this.isDisabled = !flowStatus.IsEditable;
    })
  }

  setVanueDetailsOnComptetionSelection(TournamentId: any, index: number, formArray: any) {
    if (TournamentId != undefined) {
      this._commonApi.GetComptetionDetails(TournamentId).pipe(takeUntil(this.unsubscribe)).subscribe({
        next: (res => {
          console.log(res);
          formArray.controls[index].get('Center_Name').patchValue(res.place);
          formArray.controls[index].get('State_Id').patchValue(res.state_id);
          formArray.controls[index].get('State').patchValue(res.state);
          formArray.controls[index].get('City_Id').patchValue(res.city_id);
          formArray.controls[index].get('City').patchValue(res.city);
          formArray.controls[index].get('From_Date').patchValue(this._commonApi.ConvertStringToCalendarDateFormat(res.from_date));
          formArray.controls[index].get('To_Date').patchValue(this._commonApi.ConvertStringToCalendarDateFormat(res.to_date));

          // formArray.controls[index].get('From_Date').patchValue(res.from_date);
          // formArray.controls[index].get('To_Date').patchValue(res.to_date);
        })
      })
    }
  }

  getdetails() {
    this.userDetail = this.localstorage.GetUserAllCredentials();
  }

  status$ = new BehaviorSubject<any>(null);
  statusId$ = this.status$.pipe(
    map((statusId: string) => JSON.parse(statusId) as number)
  );

  get FormArray() {
    return this.sectionThreeForm.controls['Section'] as FormArray
  }
  AddFormGroup() {
    return this.fb.group({
      Section: this.fb.array([]),
    })
  }
  RemoveField(index: number) {
    this.FormArray.removeAt(index)
  }
  AddNewData(response: any) {
    if(this.partBThreeData.length == 0) this.AddNewField()
    response.forEach((response: any, index: number) => {
      this.FormArray.push(this.AddInputFields(response, index));
    })
  }

  AddNewField() {
    this.FormArray.push(this.AddInputFields());
  }

  NextButton(editableStatus:boolean,formData:any, form:any){
    if(editableStatus) this.dataFromChild.emit(this.formListData)
    else this.SaveForm(formData, form)
  }

  SaveForm(formData?: any, form?: any) {
    let Competitions_organized: Array<any> = formData.Section.map((element: any, index: any) => {
      element.Best5 = element.Best5.toString()
      return element
    });

    if (!form.valid) {
      this.sectionThreeForm.markAllAsTouched();
      this._alert.ShowWarning('Invalid data input',0,"Please enter valid information.",true,"OK")
    } else {
      this._api.SavePartBSectionThree(this.userDetail.user_id, this.presentYear, this.userDetail.sportId, Competitions_organized).pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (response) => {
          if (response) {
            this.dataFromChild.emit(this.formListData)
            this._alert.ShowSuccess('Data Saved Successfully.')
          }
        }
      })
    }
  }

  GoToSectionFour() {
    this.dataFromChild.emit('Form_PartB_04')
  }
  GoToPreviousPage() {
    this.dataFromChild.emit("Form_PartB_02")
  }

  DisableAddButton(form: any) {
    return this._commonApi.DisableWhenFormIsInvalid(form)
  }

  minDate: any
  SetFromDate(event: any) {
    this.minDate = event.target.value
  }

  maxDate: any
  SetToDate(event: any) {
    this.maxDate = event.target.value
  }

  get FinancialYearDFMin(){
    return `${this.presentYear}-04-01`
  }

  get FinancialYearDFMax(){
    return `${+this.presentYear + 1}-03-31`
  }

  get FinancialYearDTMin(){
    return `${this.presentYear}-04-01`
  }

  get FinancialYearDTMax(){
    return `${+this.presentYear + 1}-03-31`
  }

  private AddInputFields(data?: IGetPartBSectionThreeData, index?: any) {
    return this.fb.group({
      ID: [data?.ID || 0],
      TournamentId: [data?.TournamentId || '', Validators.compose([Validators.required])],
      TournamentName: [data?.TournamentName || ''],
      Category: [data?.Category || 'junior'],
      Level: [data?.Level || 'national'],
      year: [data?.year || this.presentYear],
      SportId: [this.userDetail?.sportId || 0],
      State_participate: [data?.State_participate || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,2}$/)])],
      Athlete_participate: [data?.Athlete_participate || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])],
      Best5: [this.ConverttoInt(data?.Best5), Validators.required],
      Remarks: [data?.Remarks || ''],
      Age_Category: [data?.Age_Category || "", Validators.compose([Validators.required])],
      Center_Name: [data?.Center_Name || ""],
      State_Id: [{ value: data?.State_Id || '', disabled: true }],
      City_Id: [{ value: (data?.City_Id) || '', disabled: true }],
      From_Date: [data?.From_Date || ""],
      To_Date: [data?.To_Date || ""],
      State: [data?.State],
      City: [data?.City]
    })
  }

  protected MinMaxDate(formArrayName: FormArray, formControlName: string, index: number) {
    return this._commonApi.MinMaxDate(formArrayName, formControlName, index)
  }

  private ConverttoInt(data: any) {
    return data != undefined ? data?.split(',').map(Number) : []
  }
}