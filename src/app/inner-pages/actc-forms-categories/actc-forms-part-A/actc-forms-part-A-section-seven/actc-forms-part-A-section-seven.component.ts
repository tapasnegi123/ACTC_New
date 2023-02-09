import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, concatWith, forkJoin, map, Observable, pipe, Subject, takeUntil } from 'rxjs';
import { ActcFormsService } from 'src/app/_common/services/actc-forms.service';
import { AlertService } from 'src/app/_common/services/alert.service';
import { StorageService } from 'src/app/_common/services/storage.service';
import { CommonFormsService, IFormList } from 'src/app/_common/services/actc-forms-service/common-forms.service';

@Component({
  selector: 'app-actc-forms-part-A-section-seven',
  templateUrl: './actc-forms-part-A-section-seven.component.html',
  styleUrls: ['./actc-forms-part-A-section-seven.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActcFormsPartASectionSevenComponent implements OnInit {
  @Input() year: any;
  @Output() dataFromChild: EventEmitter<any> = new EventEmitter()
  @Input() formListData!: IFormList
  //#region Variables declaration
  userDetail: any;
  currenyDropDown: any;
  sectionSevenForm: FormGroup;
  consumableEquipment: any;
  nonConsumableEquipment: any;
  presentYear = new Date().getFullYear()
  datatobeShown: any;
  category: string = 'senior'

  currency: any = []
  nonConsumable: Array<any> = []
  consumable: Array<any> = []

  dataToBeShownFirstSection: Array<any> = []
  dataToBeShownSecondSection: Array<any> = []
  //#endregion

  unsubscribe: Subject<any> = new Subject<any>()
  //#region constructor
  constructor(private _actc: ActcFormsService, private _fb: FormBuilder,
    private _alert: AlertService, private _renderer: Renderer2, private _localStorage: StorageService,
    private _router: Router, private _commonACTC: CommonFormsService) {
    this.GetUserDetail();
    this.sectionSevenForm = this.AddFormGroup()
  }

  AddFormGroup() {
    return this._fb.group({
      firstSection: this._fb.array([]),
      secondSection: this._fb.array([])
    })
  }
  //#endregion

  //#region Observable
  equipList$: Observable<any> = new Observable();
  getCurrencyList$: Observable<any> = new Observable();
  completeList$: Observable<any> = new Observable();
  datatobeShown$: Observable<any> = new Observable();
  //#endregion

  //#region Ngoninit
  ngOnInit() {
    this.GetData();
  }

  DisabledBtn(form: any) {
    return this._commonACTC.DisableWhenFormIsInvalid(form)
  }

  GoToSummary() {
    this.dataFromChild.emit('Form_PartA_00')
  }

  GoToPreviousForm() {
    this.dataFromChild.emit("Form_PartA_06")
  }

  userData: any
  GetUserDetail() {
    this.userDetail = this._localStorage.GetUserDetailAfterLogin();
    this.userData = this._localStorage.getUserData()
  }

  flowStatusOfFinalSubmit$: Observable<any> = new Observable();
  flowStatusOfFinalSubmit: any;
  isDisabled: boolean = false
  GetData() {
    this.presentYear = this.year;
    this.equipList$ = this._actc.GetEquipmentList(this.userDetail.sportId)
    this.getCurrencyList$ = this._actc.GetCurrencyList()
    this.datatobeShown$ = this._actc.GetSectionSevenData(this.userDetail.sportId, this.presentYear, this.category);
    this.flowStatusOfFinalSubmit$ = this._commonACTC.FormSubmitFlowStatus(this.userData.user_id, this.presentYear, this.userDetail.sportId, this.userData.role_id);
    this.completeList$ = forkJoin([this.equipList$, this.getCurrencyList$, this.datatobeShown$, this.flowStatusOfFinalSubmit$]).pipe(
      map((result: any) => {
        this.currency = [...result[1]]
        this.datatobeShown = [...result[2]]
        this.flowStatusOfFinalSubmit = result[3];
        if (this.flowStatusOfFinalSubmit.IsEditable == false) this.isDisabled = true;
        if (this.datatobeShown == 0) {
          this.AddNewField('firstStep');
          this.AddNewField('secondStep');
        }
        this.datatobeShown.map((result: any) => {
          if (result.is_consumeable) this.dataToBeShownFirstSection.push(result)
          else this.dataToBeShownSecondSection.push(result)
        })
        result[0].map((response: any) => {
          if (response.is_consumeable) this.consumable.push(response)
          else this.nonConsumable.push(response)
        })
        this.AddNewFieldsAccordingToArray();
        if (this.isDisabled) this.sectionSevenForm.disable();
        return result
      }),
      catchError(async (err, caught) => {
        this._alert.ShowWarning(err.statusText)
        // this._router.navigate(['dashboard'])
      })
    )

  }

  AddNewFieldsAccordingToArray() {
    this.dataToBeShownFirstSection.forEach(x => {
      this.FirstStepFormArray.push(this.Consumables(x))
    })

    this.dataToBeShownSecondSection.forEach(x => {
      this.SecondStepFormArray.push(this.NonConsumables(x))
    })
  }

  AddNewField(type?: any) {
    if (type == 'firstStep') this.FirstStepFormArray?.push(this.Consumables())
    if (type == 'secondStep') this.SecondStepFormArray?.push(this.NonConsumables())
  }

  RemoveField(index: number, type?: string) {
    if (type == "firstSection") {
      console.log("Delete first section fields")
      this.FirstStepFormArray.removeAt(index)
    }
    if (type == "secondSection") {
      console.log("Delete second section fields")
      this.SecondStepFormArray.removeAt(index)
    }
  }

  CheckForIsEditable(formDataValue?: any, formData?: any) {
    if (this.isDisabled) this.dataFromChild.emit(this.formListData)
    else this.SaveForm(formDataValue, formData)
  }

  SaveForm(formData: any, form: any) {
    let formDataArr = [...formData.firstSection, ...formData.secondSection];
    if (!form.valid) {
      this.sectionSevenForm.markAllAsTouched()
      this._alert.ShowWarning('Invalid data input', 0, "Please enter valid information.", true, "OK");

    } else {
      this._actc.SavePartASection7(this.userData.user_id, this.presentYear, this.userDetail.sportId, this.category, formDataArr).pipe(
        concatWith(this._commonACTC.SaveFormStatus(this.formListData.form_Id, this.presentYear, this.userDetail.sportId)),
        takeUntil(this.unsubscribe)
      ).subscribe({
        next: (response) => {
          if (response) {
            this._alert.ShowSuccess("Data Saved Successfully")
            this.dataFromChild.emit(this.formListData)
          } else {
            this._alert.ShowWarning("Unable to save form.", 0, "Please try again.", true)
            return
          }
        }
      })
    }
  }

  resetEstimatedPrice(index: number, formArrayName: any) {
    formArrayName.controls[index].get('Conversion_Rate')?.setValue('');
  }

  calculateExpectedPrice(index: any, Quantity: any, Price: any, Conversion_Rate: any, formArrayName: any) {
    if (Quantity == '' || Price == '') {
      this._alert.ShowWarning('Invalid data input', 0, "Please enter Quantity And Price First.", true, "OK");
      formArrayName.controls[index].get('Conversion_Rate')?.setValue('');
    }
    let ExpectedPrice = (Quantity * Price * Conversion_Rate)
    formArrayName.controls[index].get("Expected_Price")?.setValue(ExpectedPrice)
  }

  get FirstStepFormArray() {
    return this.sectionSevenForm?.controls['firstSection'] as FormArray
  }

  get SecondStepFormArray() {
    return this.sectionSevenForm?.controls['secondSection'] as FormArray
  }

  private Consumables(data?: any) {
    return this._fb.group({
      Id: [data?.Id || 0],
      Equipment_Id: [data?.Equipment_Id || '', Validators.compose([Validators.required])],
      Equipment_Name: [data?.Equipment_Name || ""],
      is_consumeable: [true],
      SportId: [data?.SportId || this.userDetail?.sportId],
      Year: [this.presentYear],
      Quantity: [data?.Quantity || '', Validators.compose([Validators.required, Validators.pattern(/^[0-9]{1,6}$/)])],
      Price: [data?.Price || '', Validators.compose([Validators.required, Validators.pattern(/^\d{0,6}(\.\d{1,4})?$/)])],
      Currency_Id: [data?.Currency_Id || '', Validators.compose([Validators.required])],
      Currency_Name: [data?.Currency_Name || ""],
      Conversion_Rate: [data?.Conversion_Rate || '', Validators.compose([Validators.required, Validators.pattern(/^\d{0,6}(\.\d{1,4})?$/)])],
      Expected_Price: [data?.Expected_Price || '0'],
      Remarks: [data?.Remarks || "", Validators.compose([Validators.pattern(/^[ A-Za-z0-9_@./#&+-/s]{0,100}$/)])]
    })
  }

  private NonConsumables(data?: any) {
    return this._fb.nonNullable.group({
      Id: [data?.Id || 0],
      Equipment_Id: [data?.Equipment_Id || '', Validators.compose([Validators.required])],
      Equipment_Name: [data?.Equipment_Name || ""],
      is_consumeable: [false],
      SportId: [data?.SportId || this.userDetail?.sportId],
      Year: [this.presentYear],
      Quantity: [data?.Quantity || '', Validators.compose([Validators.required, Validators.pattern(/^[0-9]{1,6}$/)])],
      Price: [data?.Price || '', Validators.compose([Validators.required, Validators.pattern(/^\d{0,6}(\.\d{1,4})?$/)])],
      Currency_Id: [data?.Currency_Id || '', Validators.compose([Validators.required])],
      Currency_Name: [data?.Currency_Name || ""],
      Conversion_Rate: [data?.Conversion_Rate || '', Validators.compose([Validators.required, Validators.pattern(/^\d{0,6}(\.\d{1,4})?$/)])],
      Expected_Price: [data?.Expected_Price || '0'],
      Remarks: [data?.Remarks || "", Validators.compose([Validators.pattern(/^[ A-Za-z0-9_@./#&+-/s]{0,100}$/)])]
    })
  }

  ngOnDestroy() {
    this.unsubscribe.unsubscribe
  }

}
