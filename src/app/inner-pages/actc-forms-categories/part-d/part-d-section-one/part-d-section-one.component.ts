import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, map, Observable, Subject, takeUntil } from 'rxjs';
import { CommonFormsService, IFormList } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { ACTCFormsPartDService } from 'src/app/_common/services/actc-forms-service/part-d.service';
import { AlertService } from 'src/app/_common/services/alert.service';
import {
  IUserCredentials,
  StorageService,
} from 'src/app/_common/services/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-part-d-section-one',
  templateUrl: './part-d-section-one.component.html',
  styleUrls: ['./part-d-section-one.component.scss'],
})
export class PartDSectionOneComponent implements OnInit {
  sectionOneForm: FormGroup;
  presentYear: any;
  isDisabled: boolean = false;
  @Input() userData!: IUserCredentials<any>;
  @Input() year: any
  @Input() formListData!:IFormList
  
  constructor(private fb: FormBuilder, private _actcPartD: ACTCFormsPartDService,
    private _localStorage: StorageService, private _actcCommon: CommonFormsService,
    private _renderer: Renderer2, private _alert: AlertService
  ) {
    this.sectionOneForm = this.AddFormGroup();
    this.presentYear = new Date().getFullYear();
  }

  AddFormGroup() {
    return this.fb.group({
      sectionOne: this.fb.array([]),
      sectionTwo: this.fb.array([]),
      sectionThree: this.fb.array([]),
    });
  }

  DisableAddButton(form: any) {
    return this._actcCommon.DisableWhenFormIsInvalid(form)
  }

  ngOnInit(): void {
    this.userData = this.GetUserDetail();
    this.GetData();

    console.log(this.formListData)
  }

  InputChange(event: any, index: number) {
    let controlName = event.target.id
    let value = event.target.value
    this.PatchValueToFormArrayTwoAndThree(value, index, controlName)
  }


  DDChange(event: any, index: number) {
    let val = this.getTOPSNCOEDDArr.find(e => { return (e.id == event.target.value) ? e.name : '' })
    this.PatchValueToFormArrayTwoAndThree(val.name, index, 'academy_name')
  }

  PatchValueToFormArrayTwoAndThree(value: any, index: number, controlName: string) {
    this.FormArrayTwo.controls[index].get(controlName)?.patchValue(value)
    this.FormArrayThree.controls[index].get(controlName)?.patchValue(value)
  }

  GetUserDetail() {
    return this._localStorage.GetUserAllCredentials();
  }

  partDData$: Observable<any> = new Observable();
  getAllData$: Observable<any> = new Observable();
  getTOPSNCOEDDArr: Array<any> = []
  flowStatusOfFinalSubmit: any

  GetData() {
    this.presentYear = this.year;
    this.partDData$ = this._actcPartD.GetPartDSection1(this.presentYear, this.userData.sportId)
    let getTOPSNCOEDD$ = this._actcCommon.GetTOPSNCOEDD(this.userData.sportId)
    let flowStatusOfFinalSubmit$ = this._actcCommon.FormSubmitFlowStatus(this.userData.user_id, this.presentYear, this.userData.sportId, this.userData.role_id)
    this.getAllData$ = forkJoin([
      this.partDData$,
      getTOPSNCOEDD$,
      flowStatusOfFinalSubmit$
    ]).pipe(
      map((response) => {
        this.flowStatusOfFinalSubmit = response[2]
        this.CreateInputFieldsAccordingToData(response[0])
        this.getTOPSNCOEDDArr = [...response[1]]
        if (this.flowStatusOfFinalSubmit.IsEditable == false) {
          this.sectionOneForm.disable();
          this.isDisabled = true;
        }
        return response
      }))

  }

  CreateInputFieldsAccordingToData(data: Array<any>) {
    if (data.length == 0) { 
      this.FormArrayOne.push(this.AddInputFields(undefined, 'first'))
      this.FormArrayTwo.push(this.AddInputFields(undefined, 'second'))
      this.FormArrayThree.push(this.AddInputFields(undefined, 'third'))
    }
    else {
      data.forEach((x: IPartDSectionOne) => {
        this.FormArrayOne.push(this.AddInputFields(x, 'first'))
        this.FormArrayTwo.push(this.AddInputFields(x, 'second'))
        this.FormArrayThree.push(this.AddInputFields(x, 'third'))
      })
    }
  }

  NextButton(editableStatus:boolean,form:any){
    if(editableStatus) this.dataFromChild.emit(this.formListData)
    else this.SaveData(form)
  }

  unsubscribe: Subject<any> = new Subject()
  @Output() dataFromChild: any = new EventEmitter()
  SaveData(form: FormGroup) {
    let formValue: any = this.sectionOneForm.getRawValue();
    let formData = [...formValue.sectionOne]
    if (this.sectionOneForm.controls['sectionOne'].status == "INVALID") {
      this.sectionOneForm.markAllAsTouched();
      this._alert.ShowWarning('Invalid data input',0,"Please enter valid information.",true,"OK");
    } else {
      this._actcPartD.SavePartDSectionOne(this.userData.user_id, this.presentYear,this.userData.sportId, [...formData]).pipe(
          takeUntil(this.unsubscribe)).subscribe({
          next: (response: IPartDSectionOne) => {
            if (response) {
              this.dataFromChild.emit(this.formListData)
              this._alert.ShowSuccess("Data Saved Successfully")
            } else {
              this._alert.ShowWarning("An error occured while saving the form")
            }
          }
        })
    }
  }

  vacancyNonNegative(formcontrolName: string, index: any) {
    if (formcontrolName == 'C_Athlete_B') {
      let sanctionedAthleteBoys = this.FormArrayOne.controls[index].get("S_Athlete_B")?.value;
      if (sanctionedAthleteBoys == '') {
        Swal.fire('Please Enter Sanctioned Athlete For Boys First !!!');
        this.FormArrayTwo.controls[index].get('C_Athlete_B')?.reset();
      }
      else {
        this.FormArrayTwo.controls[index].get("C_Athlete_B")?.setValidators(Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/), Validators.max(sanctionedAthleteBoys)]))
      }
    }
    if (formcontrolName == 'C_Athlete_G') {
      let sanctionedAthleteGirls = this.FormArrayOne.controls[index].get('S_Athlete_G')?.value;
      if (sanctionedAthleteGirls == '') {
        Swal.fire('Please Enter Sanctioned Athlete For Girls First !!!');
        this.FormArrayTwo.controls[index].get('C_Athlete_G')?.reset();
      }
      else {
        this.FormArrayTwo.controls[index].get('C_Athlete_G')?.setValidators(Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/), Validators.max(sanctionedAthleteGirls)]))
      }
    }
    if (formcontrolName == 'C_Coach_B') {
      let sanctionedCoachBoys = this.FormArrayOne.controls[index].get('S_Coach_B')?.value;
      if (sanctionedCoachBoys == '') {
        Swal.fire('Please Enter Sanctioned Coaches For Boys First !!!');
        this.FormArrayThree.controls[index].get('C_Coach_B')?.reset();
      }
      else {
        this.FormArrayThree.controls[index].get('C_Coach_B')?.setValidators(Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/), Validators.max(sanctionedCoachBoys)]));
      }
    }
    if (formcontrolName == 'C_Coach_G') {
      let sanctionedCoachGirls = this.FormArrayOne.controls[index].get('S_Coach_G')?.value;
      if (sanctionedCoachGirls == '') {
        Swal.fire('Please Enter Sanctioned Coaches For Girls First !!!');
        this.FormArrayThree.controls[index].get('C_Coach_G')?.reset();
      }
      else {
        this.FormArrayThree.controls[index].get('C_Coach_G')?.setValidators(Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/), Validators.max(sanctionedCoachGirls)]));
      }
    }
  }

  GoToSectionTwo() {
    this.dataFromChild.emit('Form_PartD_02');
  }

  GoToSectionHome() {
    this.dataFromChild.emit('Form_PartD_home');
  }

  get FormArrayOne() {
    return this.sectionOneForm.controls['sectionOne'] as FormArray;
  }

  get FormArrayTwo() {
    return this.sectionOneForm.controls['sectionTwo'] as FormArray;
  }
  get FormArrayThree() {
    return this.sectionOneForm.controls['sectionThree'] as FormArray;
  }

  InputAtheleteAndCoachData(index: number, controlName: string, value: any) {
    this.FormArrayOne.controls[index].get(controlName)?.patchValue(value)
  }

  ptchValueFromCurrentStrenthToSanctionedAthlete(val: any, formControlName: string, index: number) {
    this.FormArrayOne.controls[index].get(formControlName)?.patchValue(val.value)
  }

  AddNewData(type?: any) {
    let arr = [{formArrayName:this.FormArrayOne,type:"first"},{formArrayName:this.FormArrayTwo,type:"second"},
    {formArrayName:this.FormArrayThree,type:"third"}]
    for(let type of arr){
      type.formArrayName.push(this.AddInputFields(undefined,type.type))
    }
    // this.FormArrayOne.push(this.AddInputFields(undefined, "first"));
    // this.FormArrayTwo.push(this.AddInputFields(undefined, "second"));
    // this.FormArrayThree.push(this.AddInputFields(undefined, "third"));
  }

  RemoveField(index: number, type: any) {
    this.FormArrayOne.removeAt(index);
    this.FormArrayTwo.removeAt(index);
    this.FormArrayThree.removeAt(index);
  }

  private AddInputFields(data?: IPartDSectionOne, section?: string): FormGroup {
    return this.fb.nonNullable.group({
      ID: [data?.ID || 0],
      Academy_Id: [data?.Academy_Id || '', Validators.compose([Validators.required])],
      academy_name: [data?.academy_name || '0'],
      academy_type: [data?.academy_type || '0'],
      S_Athlete_G: [data?.S_Athlete_G || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])],
      S_Athlete_B: [data?.S_Athlete_B || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])],
      C_Athlete_G: [data?.C_Athlete_G || '0'],
      C_Athlete_B: [data?.C_Athlete_B || '0'],
      S_Coach_G: [data?.S_Coach_G || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,2}$/)])],
      S_Coach_B: [data?.S_Coach_B || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,2}$/)])],
      C_Coach_G: [data?.C_Coach_G || "0"],
      C_Coach_B: [data?.C_Coach_B || "0"],
      Remarks_Athlete: [data?.Remarks_Athlete || ""],
      Remarks_Coach: [data?.Remarks_Coach || ""],
    });
  }

}


export interface IPartDSectionOne {
  ID: number
  Academy_Id: number
  academy_name: string
  academy_type: string
  S_Athlete_G: number
  S_Athlete_B: number
  C_Athlete_G: number
  C_Athlete_B: number
  S_Coach_G: number
  S_Coach_B: number
  C_Coach_G: number
  C_Coach_B: number
  Remarks_Athlete: string
  Remarks_Coach: string
}

