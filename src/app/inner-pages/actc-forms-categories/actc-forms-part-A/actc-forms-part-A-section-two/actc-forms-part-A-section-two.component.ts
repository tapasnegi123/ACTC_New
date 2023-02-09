import { IUserCredentials } from './../../../../_common/services/storage.service';
import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy, } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { concatMap, map, Observable, Subject, takeUntil, tap, } from 'rxjs';
import { ACTCFormsPartAService } from 'src/app/_common/services/actc-forms-service/part-a.service';
import { AlertService } from 'src/app/_common/services/alert.service';
import { CommonFormsService, IFormList } from 'src/app/_common/services/actc-forms-service/common-forms.service';

@Component({
  selector: 'app-actc-forms-part-A-section-two',
  templateUrl: './actc-forms-part-A-section-two.component.html',
  styleUrls: ['./actc-forms-part-A-section-two.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActcFormsPartASectionTwoComponent implements OnInit {
  sectionOneForm!: FormGroup;
  category: string = "senior"
  Is_AgOgCg: boolean = false
  @Input() year: any;
  @Input() userDetail!: IUserCredentials<any>;
  @Input() formListData!: IFormList;

  presentYear = new Date().getFullYear();
  constructor(
    private _fb: FormBuilder,
    private _actcA: ACTCFormsPartAService,
    private _alert: AlertService,
    private _actcCommon: CommonFormsService
  ) {
    this.presentYear = this.year;
    this.sectionOneForm = this.AddFormGroup();
  }

  ngOnInit() {
    this.GetData();
    this.GetComptetionByFilter()
  }

  AddFormGroup() {
    return this._fb.group({
      isOG: [false, Validators.required],
      OGYear: [{ value: '', disabled: true }],
      isAG: [false, Validators.required],
      AGYear: [{ value: '', disabled: true }],
      international: this._fb.array([]),
      national: this._fb.array([]),
      nationalNew: this._fb.array([]),
    });
  }

  completeData$: Observable<any> = new Observable();
  competitionDD: Array<any> = [];
  newCompetitionDD: Array<any> = [];
  sporthistorydata: any;
  unsubscribe: Subject<any> = new Subject();
  isDisabled: boolean = false;

  toggle: boolean = true;
  GetData() {
    this.presentYear = this.year;
    let formStatus$ = this._actcCommon.FormSubmitFlowStatus(this.userDetail.user_id, this.presentYear,
      this.userDetail.sportId, this.userDetail.role_id);
    // let competitionlist$ = this._actcCommon.GetComptetionDDByFilter(
    //   this.userDetail.sportId,
    //   this.presentYear,
    //   'senior',
    //   '',
    //   false
    // );
    let partAData$ = this._actcA.GetPartASectionOneData(
      this.presentYear,
      this.userDetail.sportId
    );

    this.completeData$ = formStatus$.pipe(
      tap((response) => (this.isDisabled = !response.IsEditable)),
      concatMap(() =>
        partAData$.pipe(
          map(partAData => {
            // this.competitionDD = [...partAData.DDCompetion]
            // this.competitionDD = [...competitionlist]
            this.sporthistorydata = partAData.sporthistorydata;
            let international = partAData.CompetionListList.filter((response) => response ? response.sport_id == 0 : '');
            let national = partAData.CompetionListList.filter((response) => response ? response.sport_id != 0 : '');
            this.AddNewInputFieldsAccordingToArray(international, 'international');
            this.AddNewInputFieldsAccordingToArray(national, 'national');

            if (this.sporthistorydata != null) {
              this.sectionOneForm.controls['isOG'].patchValue(
                partAData.sporthistorydata.isOG
              );
              this.sectionOneForm.controls['isAG'].patchValue(
                partAData.sporthistorydata.isAG
              );
              this.sectionOneForm.controls['OGYear'].patchValue(
                partAData.sporthistorydata.OGYear
              );
              this.sectionOneForm.controls['AGYear'].patchValue(
                partAData.sporthistorydata.AGYear
              );

              let ogVal = this.sectionOneForm.controls['isOG'].value;
              if (ogVal) this.sectionOneForm.controls['OGYear'].enable();
              else this.sectionOneForm.controls['OGYear'].disable();

              let agVal = this.sectionOneForm.controls['isAG'].value;
              if (agVal) this.sectionOneForm.controls['AGYear'].enable();
              else this.sectionOneForm.controls['AGYear'].disable();
            }

            if (this.isDisabled)this.sectionOneForm.disable({ onlySelf: true });

            // for (let i = 0; i < partAData.CompetionListList.length; i++) {
            //   // if(partAData.CompetionListList[i].sport_id != 0){
            //   //   this.newCompetitionDD = this.competitionDD.filter(element => element.CompetitionId != partAData.CompetionListList[i].CompetitionId) 
            //   // }

            //   if (partAData.CompetionListList[i].sport_id != 0) {
            //     this.newCompetitionDD = this.competitionDD.filter(element => element.competitionId != partAData.CompetionListList[i].CompetitionId)
            //   }

            // }
            // a.map(element =>)
            // this.newCompetitionDD = [
            //   ...this.DifferentCompetitionInNextFormArray(
            //     this.competitionDD,
            //     national
            //   ),
            //   ...this.DifferentCompetitionInNextFormArray(
            //     national,
            //     this.competitionDD
            //   ),
            // ];

            return true;
          })
        )
      )
    );
  }

  GetComptetionByFilter() {
    this._actcCommon.GetComptetionDDByFilter(this.userDetail.sportId, this.year,this.category, '',this.Is_AgOgCg).pipe(takeUntil(this.unsubscribe)).subscribe({
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

  AddNewInputFieldsAccordingToArray(array: Array<any>, formArrayName: string) {
    if (formArrayName == 'international')
      array.forEach((x) =>
        this.InternationalFormArray.push(
          this.AddNationalAndInternationalInputFields(x, undefined)
        )
      );
    if (formArrayName == 'national') {
      array.length == 0
        ? this.AddMoreField()
        : array.forEach((x) =>
          this.NationalFormArray.push(
            this.AddNationalAndInternationalInputFields(x, undefined)
          )
        );
    }
  }

  AddMoreField() {
    this.NationalFormArrayNew.push(
      this.AddNationalAndInternationalInputFields(undefined, 'nationalNew')
    );
  }

  RemoveOrClearRow(index: number, type: any) {
    if (type == 'nationalNew') {
      this.NationalFormArrayNew.removeAt(index);
    }
    if (type == 'nationalOld') {
      this.NationalFormArray.removeAt(index);
    }
  }

  DisableAddButton(form: any) {
    return this._actcCommon.DisableWhenFormIsInvalid(form);
  }

  NextButton(editableStatus: boolean, formData: any, form: any) {
    if (editableStatus) this.dataFromChild.emit(this.formListData);
    else this.SaveForm(formData, form);
  }

  SaveForm(formData: any, form: any) {
    let sporthistorydata = {
      AGYear: formData.AGYear,
      OGYear: formData.OGYear,
      isAG: formData.isAG,
      isOG: formData.isOG,
    };

    let CompetionListList = [
      ...formData.international,
      ...formData.national,
      ...formData.nationalNew,
    ];

    if (!form.valid) {
      this.sectionOneForm.markAllAsTouched();
      this._alert.ShowWarning(
        'Invalid data input',
        0,
        'Please enter valid information.',
        true,
        'OK'
      );
    } else {
      this._actcA
        .SavePartASectionOneData(
          this.presentYear,
          this.userDetail.user_id,
          sporthistorydata,
          CompetionListList
        )
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({
          next: (response) => {
            console.log(response);
            this._alert.ShowSuccess('Data Saved Successfully');
            this.dataFromChild.emit(this.formListData);
          },
          error: (error) => {
            this._alert.ShowWarning('Error', 0, error, true);
          },
        });
    }
  }

  @Output() dataFromChild: EventEmitter<any> = new EventEmitter<any>();
  GoToSectionThree() {
    this.dataFromChild.emit('Form_PartA_03');
  }

  IsOGToggle(id: any, FormControlName: any, value: any) {
    if (id == 'isOG') this.EnableDisableOGAGInput('isOG', 'OGYear');
    if (id == 'isAG') this.EnableDisableOGAGInput('isAG', 'AGYear');
    if (value) {
      this.sectionOneForm.controls[FormControlName]?.setValidators([
        Validators.required,
        Validators.pattern(/^[12][0-9]{3}$/),
      ]);
      this.sectionOneForm.controls[FormControlName]?.setValue('0');
      this.sectionOneForm.controls[FormControlName]?.markAllAsTouched();
    }
  }

  EnableDisableOGAGInput(DDcontrolName: string, inputControlName: string) {
    let valDD = this.sectionOneForm.controls[DDcontrolName].value;
    let input = this.sectionOneForm.controls[inputControlName];
    if (valDD == 'false') {
      input.disable({ onlySelf: true });
      input.reset();
    } else {
      input.enable({ onlySelf: true });
      input.reset();
    }
  }

  GoToPreviousForm() {
    this.dataFromChild.emit('Form_PartA_01');
  }

  get SectionOneFormControls() {
    return this.sectionOneForm.controls;
  }

  get InternationalFormArray() {
    return this.sectionOneForm.controls['international'] as FormArray;
  }

  get NationalFormArray() {
    return this.sectionOneForm.controls['national'] as FormArray;
  }

  get NationalFormArrayNew() {
    return this.sectionOneForm.controls['nationalNew'] as FormArray;
  }

  private AddNationalAndInternationalInputFields(
    data?: CompetionListList,
    section?: string
  ) {
    return this._fb.nonNullable.group({
      Id: [data?.Id || 0],
      CompetitionId: [
        data?.CompetitionId || '',
        Validators.compose([Validators.required]),
      ],
      Competition: [data?.Competition || ''],
      sport_id: [this.userDetail.sportId],
      sport_name: [data?.sport_name || this.userDetail.sport_Name],
      Event: [
        data?.Event || '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[\d]{0,2}$/),
        ]),
      ],
      Medal: [
        data?.Medal || '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]{0,2}$/),
        ]),
      ],
      Remarks: [
        data?.Remarks || '',
        Validators.compose([
          Validators.pattern(/^[ A-Za-z0-9_@./#&+-/s]{0,100}$/),
        ]),
      ],
      Category: [data?.Category || 'Senior'],
    });
  }

  ngOnDestroy(){
    this.unsubscribe.next(1);
    this.unsubscribe.complete();
  }
}

export interface CompetionListList {
  Id: number;
  CompetitionId: number;
  Competition: string;
  sport_id: number;
  sport_name: string;
  Event: number;
  Medal: number;
  Remarks: string;
  Category: string
}

export interface Ddcompetion {
  CompetitionId: number;
  Competition: string;
}