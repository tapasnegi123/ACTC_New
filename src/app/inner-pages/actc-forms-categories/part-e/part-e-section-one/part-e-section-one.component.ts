import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { concatMap, map, Observable, Subject } from 'rxjs';
import { CommonFormsService, IFormList } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { IDevelopmentStatusList, IGetPartESectionOneAndTwo, IInitiativesPlannedList, IUpskillingExposurelList, PartEService } from 'src/app/_common/services/actc-forms-service/part-e.service';
import { AlertService } from 'src/app/_common/services/alert.service';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';

@Component({
  selector: 'app-part-e-section-one',
  templateUrl: './part-e-section-one.component.html',
  styleUrls: ['./part-e-section-one.component.scss'],
})
export class PartESectionOneComponent implements OnInit, OnDestroy {
  @Output() dataFromChild: EventEmitter<any> = new EventEmitter();
  @Input() year: any;
  @Input() formListData!: IFormList;
  sectionOneForm: any;
  presentYear = new Date().getFullYear();
  planFor: string = "coach";
  isDisabled: boolean = false;
  userData!: IUserCredentials<any>;
  completepartEData$: Observable<any> = new Observable();
  unsubscribe: Subject<any> = new Subject();
  DevelopmentLevelArray = [
    { value: "NSNIS Diploma", name: "NSNIS DIPLOMA" },
    { value: "NSF Certification", name: "NSF CERTIFICATION" },
    { value: "NSNIS Certification", name: "NSNIS CERTIFICATION" }
  ]

  constructor(private _fb: FormBuilder,
    private _partE: PartEService,
    private _localStorage: StorageService,
    private _alert: AlertService,
    private _actcCommon: CommonFormsService) { }

  ngOnInit(): void {
    this.sectionOneForm = this.FormGroup();
    this.userData = this.GetUserDetail();
    this.GetPartESectionOneData();
  }

  DisableAddButton(form: any) {
    return this._actcCommon.DisableWhenFormIsInvalid(form)
  }

  ngOnDestroy(): void {
    this.unsubscribe.unsubscribe();
  }

  GetUserDetail() {
    return this._localStorage.GetUserAllCredentials();
  }

  GetPartESectionOneData() {
    this.presentYear = this.year;
    this.completepartEData$ = this._actcCommon.FormSubmitFlowStatus(this.userData.user_id, this.presentYear, this.userData.sportId, this.userData.role_id).pipe(
      concatMap(flowStatus => this._partE.getPartEData(this.presentYear, this.userData.sportId, this.planFor).pipe(
        map((response: any) => {
          this.isDisabled = !flowStatus.IsEditable;
          this.CheckForNational_International(response.Development_Status_list)
          response.Initiatives_Planned_list.forEach((x: any) => { this.FormArrayThree.push(this.AddInputFieldsForInitiativesPlannedList(x)) })
          response.Upskilling_Exposurel_list.forEach((x: any) => { this.FormArrayFour.push(this.AddInpForUpskillingExposuresPlanned(x)) })
          if (this.isDisabled) this.sectionOneForm.disable({ onlySelf: true });
          return response;
        })
      )
      )
    )
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

  NextButton(editableStatus: boolean, form: any, formData: any) {
    if (editableStatus) this.dataFromChild.emit(this.formListData);
    else this.SaveData(form, formData)
  }

  SaveData(form: any, formData: any) {
    let developmentList = [...formData.sectionOne, ...formData.sectionTwo]
    let initiativePlannedList = [...formData.sectionThree]
    let upskillExposureList = [...formData.sectionFour]

    if (!form.valid) {
      this.sectionOneForm.markAllAsTouched()
      this._alert.ShowWarning('Invalid data input', 0, "Please enter valid information.", true, "OK");
    } else {
      this._partE.SavePartE(this.userData.user_id, this.presentYear, this.planFor, developmentList, initiativePlannedList, upskillExposureList).subscribe({
        next: (response: IGetPartESectionOneAndTwo) => {
          if (response) {
            this.dataFromChild.emit(this.formListData)
            this._alert.ShowSuccess("Data Saved Successfully")
          }
        }
      })
    }
  };

  GoToSectionHome() {
    this.dataFromChild.emit('Form_PartE_home');
  }

  GoToSectionTwo() {
    this.dataFromChild.emit('Form_PartE_02');
  }

  FormGroup() {
    return this._fb.group({
      sectionOne: this._fb.array([]),
      sectionTwo: this._fb.array([]),
      sectionThree: this._fb.array([]),
      sectionFour: this._fb.array([]),
    });
  }

  // restrictDoubleSlection(DevelopmentLevelVal:any, index:number){
  //   this.FormArrayOne.value.forEach((x:any)=>{
  //     if(x.DevelopmentLevel == DevelopmentLevelVal){
  //       alert("na bhai na")
  //     }
  //     else return
  //   })
  // }

  AddNewData(type: any) {
    if (type == 'firstStep') this.FormArrayOne.push(this.AddInputFieldsForCoaches(undefined, "firstStep"));
    if (type == 'secondStep') this.FormArrayTwo.push(this.AddInputFieldsForCoaches(undefined, "secondStep"));
  }

  RemoveField(index: number, type: any) {
    if (type == 'firstDelete') this.FormArrayOne.removeAt(index);
    if (type == 'secondDelete') this.FormArrayTwo.removeAt(index);
    if (type == 'thirdDelete') this.FormArrayThree.removeAt(index);
    if (type == 'fourthDelete') this.FormArrayFour.removeAt(index);
  }

  get FormArrayOne() { return this.sectionOneForm.controls['sectionOne'] as FormArray; }
  get FormArrayTwo() { return this.sectionOneForm.controls['sectionTwo'] as FormArray; }
  get FormArrayThree() { return this.sectionOneForm.controls['sectionThree'] as FormArray; }
  get FormArrayFour() { return this.sectionOneForm.controls['sectionFour'] as FormArray; }

  private CheckForLevelType(sectionName: string | undefined) {
    return (sectionName == "firstStep") ? "National" : "International"
  }

  private AddInputFieldsForCoaches(data?: IDevelopmentStatusList, section?: string) {
    return this._fb.nonNullable.group({
      ID: [data?.ID || 0],
      year: [data?.year || this.presentYear],
      sportId: [data?.sportId || this.userData?.sportId],
      DevelopmentLevel: [data?.DevelopmentLevel || '', Validators.compose([Validators.required])],
      Detail: [data?.Detail || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      Level: [data?.Level || this.CheckForLevelType(section)],
      PlanFor: [data?.PlanFor || this.planFor]
    });
  }
  private AddInputFieldsForInitiativesPlannedList(data?: IInitiativesPlannedList) {
    return this._fb.nonNullable.group({
      ID: [data?.ID],
      year: [data?.year, Validators.compose([Validators.required])],
      sportId: [data?.sportId],
      LEVEL_7: [data?.LEVEL_7 || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      LEVEL_6: [data?.LEVEL_6 || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      LEVEL_5: [data?.LEVEL_5 || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      LEVEL_4: [data?.LEVEL_4 || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      LEVEL_3: [data?.LEVEL_3 || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      LEVEL_2: [data?.LEVEL_2 || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      LEVEL_1: [data?.LEVEL_1 || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      ByForeignCoaches: [data?.ByForeignCoaches || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      CoursesbyNSF: [data?.CoursesbyNSF || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      LEVEL_A: [data?.LEVEL_A],
      LEVEL_B: [data?.LEVEL_B],
      LEVEL_C: [data?.LEVEL_C],
      LEVEL_D: [data?.LEVEL_D],
      LEVEL_E: [data?.LEVEL_E],
      PlanFor: [data?.PlanFor],
      Fin_Yr: [data?.Fin_Yr || this.presentYear]
    });
  }
  private AddInpForUpskillingExposuresPlanned(data?: IUpskillingExposurelList) {
    return this._fb.nonNullable.group({
      ID: [data?.ID],
      year: [data?.year],
      sportId: [data?.sportId],
      WorldLevel: [data?.WorldLevel || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      Asian: [data?.Asian || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      Invitational: [data?.Invitational || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      National: [data?.National || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      University: [data?.University || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      State: [data?.State || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      District: [data?.District || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      PlanFor: [data?.PlanFor],
      Fin_Yr: [data?.Fin_Yr || this.presentYear]
    });
  }
}
