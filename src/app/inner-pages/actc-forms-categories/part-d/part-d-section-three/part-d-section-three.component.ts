import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { concatWith, forkJoin, map, Observable, Subject, takeUntil } from 'rxjs';
import { CommonFormsService, IFormList } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { ACTCFormsPartDService } from 'src/app/_common/services/actc-forms-service/part-d.service';
import { AlertService } from 'src/app/_common/services/alert.service';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';

@Component({
  selector: 'app-part-d-section-three',
  templateUrl: './part-d-section-three.component.html',
  styleUrls: ['./part-d-section-three.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartDSectionThreeComponent implements OnInit {
  @Input() userData!: IUserCredentials<any>;
  @Output() dataFromChild: any = new EventEmitter()
  @Input() year: any
  @Input() formListData!:IFormList

  sectionThreeForm: any;
  presentYear: any = new Date().getFullYear();
  isDisabled: boolean = false;
  constructor(private _alert: AlertService, private _fb: FormBuilder, private _actcPartD:ACTCFormsPartDService, private _actcCommon: CommonFormsService, private _localStorage: StorageService) {}

  ngOnInit(): void {
    console.log(this.formListData);
    
    this.sectionThreeForm = this.AddFormGroup();
    this.GetData()

  }

  AddFormGroup() {
    return this._fb.group({
      sectionOne: this._fb.array([]),
      sectionTwo: this._fb.array([]),
    });
  }

  DisableAddButton(form: any) {
    return this._actcCommon.DisableWhenFormIsInvalid(form)
  }

  getPartDData$: Observable<any> = new Observable()
  equipList$: Observable<any> = new Observable();
  getCurrencyList$: Observable<any> = new Observable();
  completeList$: Observable<any> = new Observable();
  flowStatusOfFinalSubmit$: Observable<any> = new Observable();
  flowStatusOfFinalSubmit: any

  currency: Array<any> = []
  partDData: Array<any> = []
  equipmentList: Array<any> = []

  dataToBeShownFirstSection: any = []
  dataToBeShownSecondSection: any = []

  consumableArr: any = []
  nonConsumableArr: any = []
  GetData() {
    this.presentYear = this.year;
    console.log(" part c section 3 this.presentYear", this.presentYear);
    this.equipList$ = this._actcCommon.GetEquipmentList(this.userData.sportId)
    this.getCurrencyList$ = this._actcCommon.GetCurrencyList()
    this.getPartDData$ = this._actcPartD.GetPartDSection3(this.presentYear, this.userData.sportId, 'ki_junior')
    this.flowStatusOfFinalSubmit$ = this._actcCommon.FormSubmitFlowStatus(this.userData.user_id, this.presentYear, this.userData.sportId, this.userData.role_id)

    this.completeList$ = forkJoin([this.getPartDData$, this.getCurrencyList$, this.equipList$, this.flowStatusOfFinalSubmit$]).pipe(
      map((response) => {
        console.log(response)
        this.partDData = [...response[0]]
        this.currency = [...response[1]]
        this.equipmentList = [...response[2]]
        this.flowStatusOfFinalSubmit = response[3]

        this.partDData.map((result: any) => {
          if (result.is_consumeable) this.dataToBeShownFirstSection.push(result)
          else this.dataToBeShownSecondSection.push(result)
        })

        this.equipmentList.map((response: any) => {
          if (response.is_consumeable) this.consumableArr.push(response)
          else this.nonConsumableArr.push(response)
        })

        this.AddNewFieldsAccordingToArray()
        if (this.flowStatusOfFinalSubmit.IsEditable == false) {
          this.isDisabled = true;
          this.sectionThreeForm.disable();
        }
        return response
      })
    )
  }

  AddNewFieldsAccordingToArray() {
    if (this.dataToBeShownFirstSection.length == 0) {
      this.FormArrayOne.push(this.Consumables())
    }
    else {
      this.dataToBeShownFirstSection.forEach((x: any) => {
        this.FormArrayOne.push(this.Consumables(x))
      })
    }

    if(this.dataToBeShownSecondSection.length == 0){
      this.FormArrayTwo.push(this.NonConsumables())
    }
    else{
    this.dataToBeShownSecondSection.forEach((x: any) => {
      this.FormArrayTwo.push(this.NonConsumables(x))
    })
  }
  }

  NextButton(editableStatus:boolean,form: any, formValid: any){
    if(editableStatus) this.dataFromChild.emit(this.formListData)
    else this.SaveForm(form,formValid)
  }

  unsubscribe: Subject<any> = new Subject()
  SaveForm(form: any, formValid: any) {
    let formDataArr = [...form.sectionOne, ...form.sectionTwo]

    if (!formValid.valid) {
      this.sectionThreeForm.markAllAsTouched()
      this._alert.ShowWarning('Invalid data input',0,"Please enter valid information.",true,"OK");
    } else {
      this._actcPartD.SavePartDSection3(this.userData.user_id, this.presentYear, this.userData.sportId,'ki_junior',formDataArr).pipe(takeUntil(this.unsubscribe)).subscribe({
        next: (response) => {
          this._alert.ShowSuccess("Data Saved Successfully.")
          this.dataFromChild.emit(this.formListData)
        }
      })
    }
  }

  goToSectionTwo() {
    this.dataFromChild.emit('Form_PartD_02');
  }

  GoToNextPartE() {
    this.dataFromChild.emit(5)
  }


  get FormArrayOne() {
    return this.sectionThreeForm.controls['sectionOne'] as FormArray;
  }

  get FormArrayTwo() {
    return this.sectionThreeForm.controls['sectionTwo'] as FormArray;
  }

  AddNewData(type: any) {
    if (type == 'firstStep') {
      this.FormArrayOne.push(this.Consumables());
    }
    if (type == 'secondStep') {
      this.FormArrayTwo.push(this.NonConsumables());
    }
  }

  RemoveField(index: number, type: any) {
    if (type == 'firstDelete') {
      this.FormArrayOne.removeAt(index);
    }
    if (type == 'secondDelete') {
      this.FormArrayTwo.removeAt(index);
    }
  }


  private Consumables(data?: any, section?: any, index?: any) {
    return this._fb.nonNullable.group({
      Id: [data?.Id || 0],
      Equipment_Id: [data?.Equipment_Id || '', Validators.compose([Validators.required])],
      Equipment_Name: [data?.Equipment_Name || ""],
      is_consumeable: [true],
      SportId: [data?.SportId || this.userData?.sportId],
      Year: [this.presentYear],
      Quantity: [data?.Quantity || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,6}$/)])],
      Price: [data?.Price || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,6}$/)])],
      Currency_Id: [data?.Currency_Id || '', Validators.compose([Validators.required])],
      Currency_Name: [data?.Currency_Name || ""],
      Conversion_Rate: [data?.Conversion_Rate || '', Validators.compose([Validators.required, Validators.pattern(/^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/)])],
      Expected_Price: [data?.Expected_Price || '0', Validators.compose([Validators.required, Validators.pattern(/^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/)])],
      Remarks: [data?.Remarks || "", Validators.compose([Validators.pattern(/^[ A-Za-z0-9_@./#&+-/s]{0,100}$/)])]
    })
  }

  private NonConsumables(data?: any, section?: any, index?: any) {
    return this._fb.nonNullable.group({
      Id: [data?.Id || 0],
      Equipment_Id: [data?.Equipment_Id || '', Validators.compose([Validators.required])],
      Equipment_Name: [data?.Equipment_Name || ""],
      is_consumeable: [false],
      SportId: [data?.SportId || this.userData?.sportId],
      Year: [this.presentYear],
      Quantity: [data?.Quantity || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,6}$/)])],
      Price: [data?.Price || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,6}$/)])],
      Currency_Id: [data?.Currency_Id || '', Validators.compose([Validators.required])],
      Currency_Name: [data?.Currency_Name || ""],
      Conversion_Rate: [data?.Conversion_Rate || '', Validators.compose([Validators.required, Validators.pattern(/^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/)])],
      Expected_Price: [data?.Expected_Price || '0', Validators.compose([Validators.required, Validators.pattern(/^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/)])],
      Remarks: [data?.Remarks || "", Validators.compose([Validators.pattern(/^[ A-Za-z0-9_@./#&+-/s]{0,100}$/)])]
    })
  }

}

export interface IPartDSectionThree {
  Id: number
  Equipment_Id: number
  Equipment_Name: string
  is_consumeable: boolean
  SportId: number
  Year: number
  Quantity: number
  Price: number
  Currency_Id: number
  Currency_Name: string
  Conversion_Rate: number
  Expected_Price: number
  Remarks: string
}
