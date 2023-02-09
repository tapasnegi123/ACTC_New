import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { concatMap, Observable, Subject, takeUntil, map } from 'rxjs';
import { CommonFormsService, IFormList } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { PartBService } from 'src/app/_common/services/actc-forms-service/part-b.services';
import { AlertService } from 'src/app/_common/services/alert.service';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';

@Component({
  selector: 'app-actc-forms-part-B-section-one',
  templateUrl: './actc-forms-part-B-section-one.component.html',
  styleUrls: ['./actc-forms-part-B-section-one.component.scss']
})
export class ActcFormsPartBSectionOneComponent implements OnInit, OnDestroy {
  @Output() dataFromChild: EventEmitter<any> = new EventEmitter<any>()
  @Input() year: any;
  @Input() formListData!: IFormList
  competitionDD: any = []
  CompetionListList: any = []
  SectionOneForm: FormGroup;
  TwoAndThreeData: any = [];
  isDisabled: boolean = false;
  userDetail!: IUserCredentials<any>;
  unsubscribe: Subject<any> = new Subject();
  category: string = "junior"
  Is_AgOgCg: boolean = false
  constructor(private fb: FormBuilder, private localstorage: StorageService,
    private _actc: PartBService, private _alert: AlertService, private _commonApi: CommonFormsService) {
    this.SectionOneForm = this.AddFormGroup()
  }
  presentyear = new Date().getFullYear()
  ngOnInit() {
    this.formListData
    this.getdetails();
    this.GetPartBSectionOneData();
    this.GetComptetionByFilter();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(1);
    this.unsubscribe.complete();
  }

  partBData$: Observable<any> = new Observable()
  sporthistorydata: any;
  newCompetitionDD: Array<any> = []
  GetPartBSectionOneData() {
    this.presentyear = this.year;
    this.partBData$ = this._commonApi.FormSubmitFlowStatus(this.userDetail?.user_id, this.year, this.userDetail?.sportId, this.userDetail?.role_id).pipe(
      concatMap(flowStatus => this._actc.GetPartBSectionOneData(this.presentyear, this.userDetail.sportId).pipe(
        map((response: any) => {
          this.sporthistorydata = response.sporthistorydata;
          this.isDisabled = !flowStatus.IsEditable;
          if (this.sporthistorydata != null) {
            this.SectionOneForm.controls['isOG'].patchValue(response.sporthistorydata.isOG);
            this.SectionOneForm.controls['isAG'].patchValue(response.sporthistorydata.isAG);
            this.SectionOneForm.controls['isCWG'].patchValue(response.sporthistorydata.isCWG);
            this.SectionOneForm.controls['OGYear'].patchValue(response.sporthistorydata.OGYear);
            this.SectionOneForm.controls['AGYear'].patchValue(response.sporthistorydata.AGYear);
            this.SectionOneForm.controls['CWGYear'].patchValue(response.sporthistorydata.CWGYear);
            this.SectionOneForm.controls['agegroup'].patchValue(response.sporthistorydata.agegroup);
  
            let ogVal = this.SectionOneForm.controls['isOG'].value
            if (ogVal) this.SectionOneForm.controls['OGYear'].enable();
            else this.SectionOneForm.controls['OGYear'].disable();
  
            let agVal = this.SectionOneForm.controls['isAG'].value
            if (agVal) this.SectionOneForm.controls['AGYear'].enable();
            else this.SectionOneForm.controls['AGYear'].disable();
  
            let cwg = this.SectionOneForm.controls['isCWG'].value
            if (cwg) this.SectionOneForm.controls['CWGYear'].enable();
            else this.SectionOneForm.controls['CWGYear'].disable();
          }
          this.CompetionListList = response.CompetionListList;
          this.competitionDD = response.DDCompetion
          // let international = response.CompetionListList.filter((response: any) => { return response ? response.sport_id == 0 : '' })
          let national = response.CompetionListList.filter((response: any) => { return response ? response.sport_id != 0 : '' })
  
          // this.newCompetitionDD = [
          //   ...this.DifferentCompetitionInNextFormArray(this.competitionDD, national),
          //   ...this.DifferentCompetitionInNextFormArray(national, this.competitionDD)
          // ];
          this.AddNewData(response)
          if (this.isDisabled) this.SectionOneForm.disable({ onlySelf: true })
          return response
        })
      ))
    )
  }

  GetComptetionByFilter() {
    this._commonApi.GetComptetionDDByFilter(this.userDetail.sportId, this.year,this.category, '',this.Is_AgOgCg).pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (response:any) => {
        this.newCompetitionDD = response
      }
    });
  }

  DifferentCompetitionInNextFormArray(array1: any, array2: any) {
    return array1.filter((object1: any) => {
      return !array2.some((object2: any) => {
        return object1.CompetitionId === object2.CompetitionId;
      });
    });
  }

  pdata: any
  selectedData(event: any) {
    let apiData = this.competitionDD;
    this.pdata = event.target.value
    console.log(this.pdata);
    this.competitionDD = this.competitionDD.filter((f: any) => f.CompetitionId !== this.pdata)
  }

  CheckForIsEditable(formDataValue?: any) {
    if (this.isDisabled) this.GoToSectionTwo()
    else this.SaveForm(formDataValue)
  }

  SaveForm(formData: any) {
    console.log(formData)
    let sporthistorydata = {
      AGYear: formData.AGYear,
      OGYear: formData.OGYear,
      CWGYear: formData.CWGYear,
      isAG: formData.isAG,
      isOG: formData.isOG,
      isCWG: formData.isCWG,
      agegroup: formData.agegroup

    };
    let CompetionListList = [
      ...formData.sectionTwo,
      ...formData.sectionThree,
      ...formData.sectionThreeNew,
    ];
    if (!this.SectionOneForm.valid) {
      this.SectionOneForm.markAllAsTouched();
      this._alert.ShowWarning('Invalid data input', 0, "Please enter valid information.", true, "OK")
    }
    else {
      this._actc.SavePartBectionOne(this.userDetail.user_id, this.presentyear, this.userDetail.sportId, sporthistorydata, CompetionListList).pipe(takeUntil(this.unsubscribe))
        .subscribe({
          next: (response) => {
            if (response) {
              this._alert.ShowSuccess('Data Saved Successfully ')
              this.dataFromChild.emit(this.formListData)
            } else {
              this._alert.ShowWarning("Form is not saved !! Please try again")
            }
          }
        })
    }
  }

  getdetails() {
    this.userDetail = this.localstorage.GetUserAllCredentials();
  }
  get FormArrayOne() {
    return this.SectionOneForm.controls['sectionOne'] as FormArray
  }
  get FormArrayTwo() {
    return this.SectionOneForm.controls['sectionTwo'] as FormArray
  }
  get FormArrayThree() {
    return this.SectionOneForm.controls['sectionThree'] as FormArray
  }
  get FormArrayThreeNew() {
    return this.SectionOneForm.controls['sectionThreeNew'] as FormArray
  }

  AddFormGroup() {
    return this.fb.group({
      isOG: [false],
      OGYear: [{ value: 0, disabled: true }, Validators.required],
      isAG: [false],
      AGYear: [{ value: 0, disabled: true }, Validators.required],
      isCWG: [false],
      CWGYear: [{ value: 0, disabled: true }, Validators.required],
      agegroup: ['', Validators.required],
      sectionTwo: this.fb.array([]),
      sectionThree: this.fb.array([]),
      sectionThreeNew: this.fb.array([]),
    })
  }

  AddNewData(response?: any) {
    if (response.CompetionListList.length <= 3) this.AddNewField();
    response.CompetionListList.forEach((response: any) => {
      if (response.sport_id === 0) this.FormArrayTwo.push(this.AddSecondSectionFields(response));
      if (response.sport_id === 10) this.FormArrayThree.push(this.AddThirdSectionFields(response));
    })
  }
  AddNewField() {
    this.FormArrayThreeNew.push(this.AddThirdSectionFields());
  }

  RemoveField(index: number, type: any) {
    if (type == 'sectionThree') {
      this.FormArrayThree.removeAt(index)
    }
    if (type == 'sectionThreeNew') {
      this.FormArrayThreeNew.removeAt(index)
    }
  }

  IsOGToggle(id: any) {
    if (id == 'isOG') this.EnableDisableOGAGInput('isOG', 'OGYear');
    if (id == 'isAG') this.EnableDisableOGAGInput('isAG', 'AGYear');
    if (id == 'isCWG') this.EnableDisableOGAGInput('isCWG', 'CWGYear');
  }

  EnableDisableOGAGInput(DDcontrolName: string, inputControlName: string) {
    let valDD = this.SectionOneForm.controls[DDcontrolName].value;
    let input = this.SectionOneForm.controls[inputControlName];
    if (valDD == 'false') {
      input.disable({ onlySelf: true });
      input.reset();
    } else {
      input.enable({ onlySelf: true });
      input.reset();
    }
  }

  setValidatorsConditionally(id: any, value: any) {
    if (value) {
      this.SectionOneForm.controls[id].setValidators([Validators.required, Validators.pattern(/^[12][0-9]{3}$/)])
    }
    if (id == "agegroup") this.SectionOneForm.controls[id].setValidators(Validators.required)
  }

  DisableAddButton(form: any) {
    return this._commonApi.DisableWhenFormIsInvalid(form);
  }

  GoToSectionTwo() {
    console.log('save btn is');
    this.dataFromChild.emit('Form_PartB_02');
  }
  GoToSummery() {
    this.dataFromChild.emit('Form_PartB_home')
  }

  toggle: boolean = true
  private AddSecondSectionFields(data?: any) {
    return this.fb.group({
      Competition: [{ value: data?.Competition || "", disabled: true }],
      Event: [data?.Event || 0, Validators.compose([Validators.required, Validators.pattern(/^[0-9]{0,4}$/),])],
      Medal: [data?.Medal || 0, Validators.compose([Validators.required, Validators.pattern(/^[0-9]{0,4}$/),])],
      Remarks: [data?.Remarks || ''],
      sport_name: [data?.sport_name || '0'],
      sport_id: [this.userDetail?.sportId || 0],
      CompetitionId: [data?.CompetitionId || '', [Validators.required]],
      Id: [data?.Id || 0],
      Category: [data?.Category || 'Junior']
    })
  }

  private AddThirdSectionFields(data?: any) {
    return this.fb.group({
      Competition: [{ value: data?.Competition || "", disabled: true }, [Validators.required]],
      Event: [data?.Event || '', Validators.compose([Validators.required, Validators.pattern(/^[0-9]{0,4}$/),])],
      Medal: [data?.Medal || '', Validators.compose([Validators.required, Validators.pattern(/^[0-9]{0,4}$/),])],
      Remarks: [data?.Remarks || ''],
      sport_name: [data?.sport_name || ''],
      sport_id: [this.userDetail?.sportId || 0],
      CompetitionId: [data?.CompetitionId || '', [Validators.required]],
      Id: [data?.Id || 0],
      Category: [data?.Category || 'Junior']
    })
  }
}

