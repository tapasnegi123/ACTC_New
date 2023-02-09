import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { concatMap, concatWith, forkJoin, map, Observable, Subject, takeUntil } from 'rxjs';
import { EstimateExpenditurePipe } from 'src/app/_common/pipes/estimated-expenditure.pipe';
import { CommonFormsService, ICompetetionDD, ICurrencyDD, IFormList } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { ACTCFormsPartAService, Coachandsupportstafflist, IGetPartASectionSix, RequirementAdministrativeList } from 'src/app/_common/services/actc-forms-service/part-a.service';
import { AlertService } from 'src/app/_common/services/alert.service';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';
import { FinYearDateValidation } from 'src/app/_common/utilities/nsf.util'

@Component({
  selector: 'app-actc-forms-part-A-section-six',
  templateUrl: './actc-forms-part-A-section-six.component.html',
  styleUrls: ['./actc-forms-part-A-section-six.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActcFormsPartASectionSixComponent implements OnInit, OnDestroy {
  @Output() dataFromChild: EventEmitter<any> = new EventEmitter<any>();
  @Input() formListData!: IFormList
  @Input() year: any
  sectionSixForm: FormGroup;

  unsubscribe: Subject<any> = new Subject();
  constructor(private _fb: FormBuilder, private _actcCommon: CommonFormsService,
    private _alert: AlertService, private _localStorage: StorageService, private _actcPartA: ACTCFormsPartAService, private _estimatedExpPipe: EstimateExpenditurePipe
  ) {
    this.sectionSixForm = this.AddFormGroup();
  }

  AddFormGroup() {
    return this._fb.group({
      firstSection: this._fb.array([]),
      secondSection: this._fb.array([]),
      thirdSection: this._fb.array([]),
    });
  }

  CheckForIsEditable(formDataValue?: any, formData?: any) {
    if (this.isDisabled) this.dataFromChild.emit(this.formListData)
    else this.SaveForm(formDataValue, formData)
  }

  DisableAddButton(formArrayName: FormArray) {
    return this._actcCommon.DisableWhenFormIsInvalid(formArrayName);
  }

  staffType: Array<any> = ['Coach', 'Support Staff'];
  teamComposition: Array<any> = ['Male', 'Female', 'Mixed'];
  tenureType: Array<any> = ['Monthly', 'Daily', 'Regular Basis'];
  userData!: IUserCredentials<any>;
  presentYear = new Date().getFullYear();
  ngOnInit() {
    console.log(this.formListData)
    this.userData = this.GetUserDetail();
    this.GetData();
  }

  getSectionSixData$: Observable<IGetPartASectionSix> = new Observable();
  competitionDDArr: Array<any> = [];
  competitionDDArrNational: Array<any> = [];
  competitionDDArrInternational: Array<any> = [];

  currencyDD$: Observable<ICurrencyDD[]> = new Observable();
  currencyArr: Array<any> = [];

  coachAndSupport$: Observable<any> = new Observable();
  coachAndSupport: Array<any> = [];
  completeData$: Observable<any> = new Observable();

  flowStatusOfFinalSubmit$: Observable<any> = new Observable();
  flowStatusOfFinalSubmit: any;
  isDisabled: boolean = false
  GetData() {
    this.presentYear = this.year;
    this.getSectionSixData$ = this._actcPartA.GetPartASectionSixData(this.presentYear, this.userData.sportId);
    let competitionDD$ = this._actcCommon.GetCompetitionList(this.userData.sportId, 'senior', '',this.presentYear)
    this.currencyDD$ = this._actcCommon.GetCurrencyList();
    this.coachAndSupport$ = this._actcCommon.GetStakeholderDesignationDD("Coach,Support Staff");
    this.flowStatusOfFinalSubmit$ = this._actcCommon.FormSubmitFlowStatus(this.userData.user_id, this.presentYear, this.userData.sportId, this.userData.role_id);

    this.completeData$ = forkJoin([competitionDD$, this.currencyDD$,
    this.getSectionSixData$, this.coachAndSupport$, this.flowStatusOfFinalSubmit$]).pipe(
      map(
        ([competionDD, currencyDD, sectionSixData, coachAndSupport, flowStatusOfFinalSubmit], index) => {
          this.flowStatusOfFinalSubmit = flowStatusOfFinalSubmit
          if (this.flowStatusOfFinalSubmit.IsEditable == false) this.isDisabled = true;
          this.competitionDDArr = [...competionDD];
          this.competitionDDArrNational = this.competitionDDArr.filter(x => { return x.tournament_level == 'National' })
          this.competitionDDArrInternational = this.competitionDDArr.filter(x => { return x.tournament_level == 'International' })
          this.currencyArr = [...currencyDD];
          this.coachAndSupport = [...coachAndSupport];
          this.CheckForCoachAndSupportStaffData(sectionSixData.coachandsupportstafflist);
          this.CheckForRequirementAdministrativeList(sectionSixData.RequirementAdministrativeList);
          if (this.isDisabled) this.sectionSixForm.disable();
          return true;
        }
      )
    );
    console.log("section 6 this.completeData$", this.completeData$);

  }

  SaveForm(formData: any, form: any) {
    console.log(formData);
    let coachSupportStaffList = [
      ...formData.firstSection,
      ...formData.secondSection,
    ];
    let adminList = [...formData.thirdSection];

    if (!form.valid) {
      this.sectionSixForm.markAllAsTouched()
      this._alert.ShowWarning('Invalid data input', 0, "Please enter valid information.", true, "OK");

    } else {
      this._actcPartA
        .SavePartASection6(this.userData.user_id, this.userData.sportId,
          this.presentYear, 'Senior', coachSupportStaffList, adminList
        )
        .pipe(
          concatMap(formStatus => this._actcCommon.SaveFormStatus(this.formListData.form_Id, this.presentYear, this.userData.sportId)),
          takeUntil(this.unsubscribe)
        )
        .subscribe({
          next: (response) => {
            this.dataFromChild.emit(this.formListData)
            this._alert.ShowSuccess("Data Saved Successfully")
          },
        })
    }
  }

  SelectedDate(formArrayControls: FormArray, index: number, FromDateControl: string, ToDateControl: string) {
    FinYearDateValidation(formArrayControls, index, FromDateControl, ToDateControl);
    this.ThirdFormArray.controls[index].get('Salary')?.setValue('');
  }

  selectVenue(value: any, index: any, formArrayName: string, ArrayName: any) {
    this._actcCommon.GetComptetionDetails(value).pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (response) => {
        console.log(response)
        if (formArrayName == "firstSection" && index >= 0) {
          ArrayName.controls[index].get("venue")?.setValue(response.place + ', ' + response.city + ', ' + response.state + ', ' + response.country)
        }
        if (formArrayName == "secondSection" && index >= 0) {
          ArrayName.controls[index].get("venue")?.setValue(response.place + ', ' + response.city + ', ' + response.state + ', ' + response.country)
        }
      }
    })
  }

  @ViewChild('staff') staff!: ElementRef;
  CheckForCoachAndSupportStaffData(arr: Array<Coachandsupportstafflist>) {
    let national: Array<Coachandsupportstafflist> = [], international: Array<Coachandsupportstafflist> = []

    if (arr.length >= 1) {

      for (let ele of arr) {
        if (ele.Level == "National") national.push(ele)
        if (ele.Level == "International") international.push(ele)
      }

      for (let index = 0; index < international.length; index++) {
        this.PopulateDesignationDDAndAddFields(this.FirstFormArray, international[index], "firstSection", index)
      }

      for (let index = 0; index < national.length; index++) {
        this.PopulateDesignationDDAndAddFields(this.SecondFormArray, national[index], "secondSection", index)
      }

    } else {
      this.PushCoachesAndSupportStaffFields(this.FirstFormArray, [], 'firstSection');
      this.PushCoachesAndSupportStaffFields(this.SecondFormArray, [], "secondSection");
    }
  }

  private PopulateDesignationDDAndAddFields(formArray: FormArray, object: Coachandsupportstafflist, section: string, index: number) {
    formArray.push(this.AddCoachesAndSupportStaff(object, section))
    this.CompositionOptions(object.Stafftype, section, index)
  }

  CheckForRequirementAdministrativeList(
    array: Array<RequirementAdministrativeList>
  ) {
    this.PushAdministrativeFields(this.ThirdFormArray, array);
  }

  designationArrFirstSection: Array<any> = [];
  designationArrSecondSection: Array<any> = [];

  NewSelectDropDown(event: any, index: number, formArrayName: any) {
    this.CompositionOptions(event.target.value, formArrayName, index);
  }

  CompositionOptions(staffType: any, formArray: any, index: number) {
    if (formArray == 'firstSection') {
      if (staffType == 'Coach')
        this.designationArrFirstSection[index] = this.coachAndSupport.filter(element => { return (element.type == staffType) ? element : '' })
      if (staffType == 'Support Staff')
        this.designationArrFirstSection[index] = this.coachAndSupport.filter(element => { return (element.type == staffType) ? element : '' })
    }
    if (formArray == 'secondSection') {
      if (staffType == 'Coach')
        this.designationArrSecondSection[index] = this.coachAndSupport.filter(element => { return (element.type == staffType) ? element : '' })
      if (staffType == 'Support Staff')
        this.designationArrSecondSection[index] = this.coachAndSupport.filter(element => { return (element.type == staffType) ? element : '' })
    }
  }

  AddNewData(type?: any) {
    if (type == 'firstStep')
      this.PushCoachesAndSupportStaffFields(this.FirstFormArray, [], "firstSection");
    if (type == 'secondStep')
      this.PushCoachesAndSupportStaffFields(this.SecondFormArray, [], "secondSection");
    if (type == 'thirdStep')
      this.PushAdministrativeFields(this.ThirdFormArray, []);
  }

  private PushCoachesAndSupportStaffFields(formArrayName: FormArray, data: Array<any>, section?: string) {
    if (data.length == 0) {
      formArrayName.push(this.AddCoachesAndSupportStaff(undefined, section));
    } else {
      data.forEach((x) => {
        formArrayName.push(this.AddCoachesAndSupportStaff(x, section));
      });
    }
  }

  PushAdministrativeFields(
    formArrayName: FormArray,
    data: Array<RequirementAdministrativeList>
  ) {
    // console.log(data);
    if (data.length == 0) {
      formArrayName.push(this.RequirementAdministrativeList());
    } else {
      data.forEach((x) => {
        formArrayName.push(this.RequirementAdministrativeList(x));
      });
    }
  }
  resetEstimatedExpendure(index: number, formArrayName: any, type: any) {
    if (type == 'firstSection') formArrayName.controls[index].get('CurrencyRate').setValue('0');
    if (type == 'secondSection') formArrayName.controls[index].get('Salary').setValue('0')
  }
  setvalidatorsAndEstimatedForFirstStep(index: number, tenure: any, salary: any, currencyConversionRate: any) {
    this.FirstFormArray.controls[index].get("CurrencyRate")?.setValidators(Validators.compose([Validators.required, Validators.pattern(/^\d{0,6}(\.\d{1,4})?$/)]));
    if (tenure == '' || salary == '') {
      this._alert.ShowWarning('Invalid data input', 0, "Please enter TENURE And SALARY First.", true, "OK");
      this.FirstFormArray.controls[index].get('Total_Expenditure')?.setValue('0');
    }
    let EstimateExpenditure = (tenure * salary * currencyConversionRate)
    this.FirstFormArray.controls[index].get("Total_Expenditure")?.setValue(EstimateExpenditure)
  }

  EstimatedExpenditureForSecondStep(index: any, tenure: any, salary: any) {
    if (tenure == '') {
      this._alert.ShowWarning('Invalid data input', 0, "Please enter TENURE First.", true, "OK");
      this.SecondFormArray.controls[index].get('Salary')?.setValue('0');
    }
    let EstimateExpenditure = (tenure * salary)
    this.SecondFormArray.controls[index].get("Total_Expenditure")?.setValue(EstimateExpenditure)
  }
  EstimatedExpenditureForThirdSection(index: number, Date_of_Joining: any, Contract_Expiry_Date: any, Salary: any) {
    if (Date_of_Joining == '' || Contract_Expiry_Date == '') {
      this._alert.ShowWarning('Invalid data input', 0, "Please enter DATE OF JOINING And DATE OF CONTRACT EXPIRY First.", true, "OK");
      this.ThirdFormArray.controls[index].get('Salary')?.setValue('');
    }
    else {
      let EstimateExpenditure = this._estimatedExpPipe.transform(Date_of_Joining, Contract_Expiry_Date, Salary);
      this.ThirdFormArray.controls[index].get('Total_Expenditure')?.setValue(EstimateExpenditure)
    }
  }

  RemoveField(index: number, type?: string) {
    if (type == 'firstSection') {
      this.DeleteFormArrayAndDesignationArr(
        this.FirstFormArray,
        this.designationArrFirstSection,
        index
      );
    }
    if (type == 'secondSection') {
      this.DeleteFormArrayAndDesignationArr(
        this.SecondFormArray,
        this.designationArrFirstSection,
        index
      );
    }
    if (type == 'thirdSection') {
      this.ThirdFormArray.removeAt(index);
    }
  }


  DeleteFormArrayAndDesignationArr(formArray: any, designationArray: any, index: number) {
    formArray.removeAt(index);
    designationArray.splice(index, 1);
  }

  GetUserDetail() {
    return this._localStorage.GetUserAllCredentials();
  }

  GoToPreviousForm() {
    this.dataFromChild.emit('Form_PartA_05');
  }

  GoToNextForm() {
    this.dataFromChild.emit('Form_PartA_07');
  }

  ngOnDestroy(): void {
    this.unsubscribe.unsubscribe();
  }

  get DateOfJoiningMin() {
    return `${this.presentYear}-04-01`
  }

  get DateOfJoiningMax() {
    return `${+this.presentYear + 1}-03-31`
  }

  get ContractExpiryDateMin() {
    return `${this.presentYear}-04-01`
  }

  get ContractExpiryDateMax() {
    return `${+this.presentYear + 1}-03-31`
  }


  get FirstFormArray() {
    return this.sectionSixForm.controls['firstSection'] as FormArray;
  }
  get SecondFormArray() {
    return this.sectionSixForm.controls['secondSection'] as FormArray;
  }

  get ThirdFormArray() {
    return this.sectionSixForm.controls['thirdSection'] as FormArray;
  }
  get RemarksErrorMessage() {
    return "Only 100 Alphabets are allowed"
  }

  private AddCoachesAndSupportStaff(data?: Coachandsupportstafflist, section?: string) {
    return this._fb.nonNullable.group({
      ID: [data?.ID || 0],
      Designation_Id: [data?.Designation_Id || '', Validators.compose([Validators.required])],
      Stafftype: [data?.Stafftype || '', Validators.compose([Validators.required])],
      Designation: [data?.Designation || '0  '],
      team_composition: [data?.team_composition || '', Validators.compose([Validators.required])],
      tournament_Id: [data?.tournament_Id || '', Validators.compose([Validators.required])],
      tournament_name: [data?.tournament_name || '0'],
      TenureType: [data?.TenureType || '', Validators.required],
      TenureTime: [data?.TenureTime || '0', Validators.compose([Validators.required, Validators.pattern(/^[0-9]{1,3}$/)])],
      Salary: [data?.Salary || '0', Validators.compose([Validators.required, Validators.pattern(/^\d{0,5}(\.\d{1,4})?$/)])],
      CurrencyType: [data?.CurrencyType || 1],
      CurrencyRate: [data?.CurrencyRate || 0, Validators.pattern(/^\d{0,6}(\.\d{1,4})?$/)],
      Remarks: [data?.Remarks || '', Validators.compose([Validators.pattern(/^[ A-Za-z0-9_@./#&+-/s]{0,100}$/)])],
      Category: [data?.Category || 'Senior'],
      Level: [data?.Level || this.CheckSection(section)],
      venue: [{ value: data?.venue || "", disabled: true }],
      Total_Expenditure: [data?.Total_Expenditure || '']
    });
  }

  private RequirementAdministrativeList(data?: RequirementAdministrativeList) {
    return this._fb.nonNullable.group({
      ID: [data?.ID || 0],
      Designation: [data?.Designation || '', Validators.compose([Validators.required, Validators.pattern(/^(.{1,100})$/)])],
      TenureType: [data?.TenureType || '', Validators.compose([Validators.required])],
      Date_of_Joining: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Date_of_Joining) || '', Validators.compose([Validators.required])],
      Contract_Expiry_Date: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Contract_Expiry_Date) || '', Validators.compose([Validators.required])],
      Total_Days: [data?.Total_Days || '0'],
      Salary: [data?.Salary || '', Validators.compose([Validators.required, Validators.pattern(/^\d{0,5}(\.\d{1,4})?$/)])],
      Remarks: [data?.Remarks || '', Validators.compose([Validators.pattern(/^[ A-Za-z0-9_@./#&+-/s]{0,100}$/)])],
      Category: [data?.Category || 'Senior'],
      Total_Expenditure: [data?.Total_Expenditure || '']
    });
  }

  /**
   * Helper Methods 
   */
  private CheckSection(sectionName: string | undefined) {
    return (sectionName == "secondSection") ? "National" : "International"
  }

  protected MinMaxDate(formArrayName: FormArray, formControlName: string, index: number) {
    return this._actcCommon.MinMaxDate(formArrayName, formControlName, index)
  }


}
