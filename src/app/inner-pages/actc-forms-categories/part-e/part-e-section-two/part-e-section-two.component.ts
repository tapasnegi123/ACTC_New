import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { concatMap, concatWith, forkJoin, map, observable, Observable, Subject, takeUntil } from 'rxjs';
import { CommonFormsService, IFormList } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { IDevelopmentStatusList, IGetPartESectionOneAndTwo, IInitiativesPlannedList, IUpskillingExposurelList, PartEService } from 'src/app/_common/services/actc-forms-service/part-e.service';
import { AlertService } from 'src/app/_common/services/alert.service';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-part-e-section-two',
  templateUrl: './part-e-section-two.component.html',
  styleUrls: ['./part-e-section-two.component.scss']
})
export class PartESectionTwoComponent implements OnInit, OnDestroy {
  sectionTwoForm: any;
  presentYear = new Date().getFullYear();
  planFor: string = "refree";
  isDisabled: boolean = false
  @Output() dataFromChild: any = new EventEmitter();
  @Input() year: any;
  @Input() formListData!: IFormList
  constructor(private _fb: FormBuilder, private _partESecvice: PartEService,
    private _localStorage: StorageService, private _router: Router,
    private _alert: AlertService, private _actcCommon: CommonFormsService) {
    this.sectionTwoForm = this.FormData()
  }
  DisableAddButton(form: any) {
    return this._actcCommon.DisableWhenFormIsInvalid(form)
  }


  userData!: IUserCredentials<any>
  ngOnInit(): void {
    this.userData = this.GetUserDetails();
    this.GetPartESectionTwoData();
  }

  ngOnDestroy(): void {
    this.unsubscribe.unsubscribe();
  }

  FormData() {
    return this._fb.group({
      sectionOne: this._fb.array([]),
      sectionTwo: this._fb.array([]),
      sectionThree: this._fb.array([]),
      sectionFour: this._fb.array([])
    })
  }

  GetUserDetails() {
    return this._localStorage.GetUserAllCredentials();
  }

  PartESectionTwoData$: Observable<any> = new Observable();
  GetPartESectionTwoData() {
    this.presentYear = this.year;
    this.PartESectionTwoData$ = this._actcCommon.FormSubmitFlowStatus(this.userData.user_id, this.presentYear, this.userData.sportId, this.userData.role_id).pipe(
      concatMap(flowStatus => this._partESecvice.getPartEData(this.presentYear, this.userData.sportId, this.planFor).pipe(
        map((response: any) => {
          this.CheckForNational_International(response.Development_Status_list)
          response.Initiatives_Planned_list.forEach((x: any) => { this.FormArrayThree.push(this.AddInputFieldsForInitiativesPlannedList(x)) })
          response.Upskilling_Exposurel_list.forEach((x: any) => { this.FormArrayFour.push(this.AddInpForUpskillingExposuresPlanned(x)) })
          if (!flowStatus.IsEditable) this.sectionTwoForm.disable({ onlySelf: true });
          this.isDisabled = !flowStatus.IsEditable
          return response;
        })
      )))
  }

  CheckForNational_International(array: Array<IDevelopmentStatusList>) {
    let nationalArr: Array<IDevelopmentStatusList> = [], internationalArr: Array<IDevelopmentStatusList> = []
    for (let data of array) {
      if (data.Level == "National") nationalArr.push(data);
      if (data.Level == "International") internationalArr.push(data);
    }
    nationalArr.forEach(x => {
      this.FormArrayOne.push(this.AddInputFieldsForCoaches(x, "firstStep"))
    });
    internationalArr.forEach(x => {
      this.FormArrayTwo.push(this.AddInputFieldsForCoaches(x, "secondStep"))
    });
    if (nationalArr.length == 0) this.AddNewData('firstStep')
    if (internationalArr.length == 0) this.AddNewData('secondStep')
  }

  NextButton(editableStatus:boolean,form:any,formData:any){
    if(editableStatus) this._router.navigate(['manage-actc/list'])
    else this.SaveData(form,formData)
  }

  unsubscribe: Subject<any> = new Subject()
  SaveData(form: any, formData: any) {
    let developmentList = [...formData.sectionOne, ...formData.sectionTwo]
    let initiativePlannedList = [...formData.sectionThree]
    let upskillExposureList = [...formData.sectionFour]

    if (!form.valid) {
      this.sectionTwoForm.markAllAsTouched()
      this._alert.ShowWarning('Invalid data input', 0, "Please enter valid information.", true, "OK");
    } else {
      this._partESecvice.SavePartE(this.userData.user_id, this.presentYear, this.planFor, developmentList, initiativePlannedList,upskillExposureList).subscribe({
          next: (response: IGetPartESectionOneAndTwo) => {
            if (response) {
              this._alert.ShowSuccess("Data Saved Successfully")
              this._router.navigate(['manage-actc/list'])
            }
          }
        })
    }
  }

  SaveFinalData(form: any, formData: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Submit'
    }).then((result) => {
      if (result.isConfirmed) {
        this._actcCommon.SubmitByNSF(this.userData.user_id, this.presentYear, this.userData.sportId, this.userData.role_id).pipe(takeUntil(this.unsubscribe)).subscribe()
        this.SaveData(form, formData)
        Swal.fire(
          'Saved!',
          'Your data has submitted successfully.',
          'success'
        )
      }
    })
  }

  goToSectionOne() {
    this.dataFromChild.emit("Form_PartE_01");
    console.log("pre")
  }

  AddNewData(type: any) {
    if (type == 'firstStep') this.FormArrayOne.push(this.AddInputFieldsForCoaches(undefined, "firstStep"))
    if (type == 'secondStep') this.FormArrayTwo.push(this.AddInputFieldsForCoaches(undefined, "secondStep"))
  }

  RemoveField(index: number, type: any) {
    if (type == 'firstDelete') this.FormArrayOne.removeAt(index)
    if (type == 'secondDelete') this.FormArrayTwo.removeAt(index)
    if (type == 'thirdDelete') this.FormArrayThree.removeAt(index)
    if (type == 'fourthDelete') this.FormArrayFour.removeAt(index)
  }

  get FormArrayOne() {
    return this.sectionTwoForm.controls['sectionOne'] as FormArray
  }
  get FormArrayTwo() {
    return this.sectionTwoForm.controls['sectionTwo'] as FormArray
  }
  get FormArrayThree() {
    return this.sectionTwoForm.controls['sectionThree'] as FormArray
  }
  get FormArrayFour() {
    return this.sectionTwoForm.controls['sectionFour'] as FormArray
  }

  private AddInputFieldsForCoaches(data?: IDevelopmentStatusList, section?: string) {
    return this._fb.nonNullable.group({
      ID: [data?.ID || 0],
      year: [data?.year || this.presentYear],
      sportId: [data?.sportId || this.userData?.sportId],
      DevelopmentLevel: [{ value: data?.DevelopmentLevel || '', disabled: this.isDisabled }, Validators.compose([Validators.required])],
      Detail: [{ value: data?.Detail || '', disabled: this.isDisabled }, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      Level: [data?.Level || this.CheckForLevelType(section)],
      PlanFor: [data?.PlanFor || this.planFor]
    });
  }

  private CheckForLevelType(sectionName: string | undefined) {
    if (sectionName === "firstStep") return "National"
    else return "International"
  }

  private AddInputFieldsForInitiativesPlannedList(data?: IInitiativesPlannedList) {
    return this._fb.nonNullable.group({
      ID: [data?.ID],
      year: [data?.year],
      sportId: [data?.sportId],
      LEVEL_7: [{ value: data?.LEVEL_7 || '', disabled: this.isDisabled }, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      LEVEL_6: [{ value: data?.LEVEL_6 || '', disabled: this.isDisabled }, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      LEVEL_5: [{ value: data?.LEVEL_5 || '', disabled: this.isDisabled }, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      LEVEL_4: [{ value: data?.LEVEL_4 || '', disabled: this.isDisabled }, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      LEVEL_3: [{ value: data?.LEVEL_3 || '', disabled: this.isDisabled }, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      LEVEL_2: [{ value: data?.LEVEL_2 || '', disabled: this.isDisabled }, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      LEVEL_1: [{ value: data?.LEVEL_1 || '', disabled: this.isDisabled }, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      ByForeignCoaches: [{ value: data?.ByForeignCoaches || '', disabled: this.isDisabled }, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      CoursesbyNSF: [{ value: data?.CoursesbyNSF || '', disabled: this.isDisabled }, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      LEVEL_A: [{ value: data?.LEVEL_A, disabled: this.isDisabled }],
      LEVEL_B: [{ value: data?.LEVEL_B, disabled: this.isDisabled }],
      LEVEL_C: [{ value: data?.LEVEL_C, disabled: this.isDisabled }],
      LEVEL_D: [{ value: data?.LEVEL_D, disabled: this.isDisabled }],
      LEVEL_E: [{ value: data?.LEVEL_E, disabled: this.isDisabled }],
      PlanFor: [data?.PlanFor || this.planFor],
      Fin_Yr: [data?.Fin_Yr || this.presentYear]
    });
  }
  private AddInpForUpskillingExposuresPlanned(data?: IUpskillingExposurelList) {
    return this._fb.nonNullable.group({
      ID: [data?.ID],
      year: [data?.year],
      sportId: [data?.sportId],
      WorldLevel: [{ value: data?.WorldLevel || '', disabled: this.isDisabled }, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      Asian: [{ value: data?.Asian || '', disabled: this.isDisabled }, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      Invitational: [{ value: data?.Invitational || '', disabled: this.isDisabled }, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      National: [{ value: data?.National || '', disabled: this.isDisabled }, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      University: [{ value: data?.University || '', disabled: this.isDisabled }, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      State: [{ value: data?.State || '', disabled: this.isDisabled }, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      District: [{ value: data?.District || '', disabled: this.isDisabled }, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      PlanFor: [data?.PlanFor || this.planFor],
      Fin_Yr: [data?.Fin_Yr || this.presentYear]
    });
  }
}
