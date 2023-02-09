import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { concatMap, forkJoin, map, Observable, Subject, takeUntil } from 'rxjs';
import { EstimateExpenditurePipe } from 'src/app/_common/pipes/estimated-expenditure.pipe';
import { CommonFormsService, ICompetetionDD, ICurrencyDD, IFormList, IStakeHolderDD } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { ACTCFormsPartDService, ICoachandsupportstafflist, IPartDSectionTwo, IRequirementAdministrativeList } from 'src/app/_common/services/actc-forms-service/part-d.service';
import { AlertService } from 'src/app/_common/services/alert.service';
import { IUserCredentials } from 'src/app/_common/services/storage.service';
import { FinYearDateValidation } from 'src/app/_common/utilities/nsf.util'

@Component({
  selector: 'app-part-d-section-two',
  templateUrl: './part-d-section-two.component.html',
  styleUrls: ['./part-d-section-two.component.scss'],
})
export class PartDSectionTwoComponent implements OnInit {

  sectionTwoForm: any;
  @Input() year: any
  @Input() userData!: IUserCredentials<any>;
  @Output() dataFromChild = new EventEmitter()
  @Input() formListData!: IFormList

  constructor(private _fb: FormBuilder, private _alert: AlertService,
    private _actcCommon: CommonFormsService, private _actcPartD: ACTCFormsPartDService, private _estimatedExpPipe: EstimateExpenditurePipe
  ) { }

  staffType: Array<any> = ["Coach", "Support Staff"]
  teamComposition: Array<any> = ["Male", "Female", "Mixed"]
  tenureType: Array<any> = ["Monthly", "Daily", "Regular Basis"]
  isDisabled: boolean = false;
  ngOnInit(): void {
    console.log(this.formListData)
    this.sectionTwoForm = this.AddFormGroup();
    this.GetData()
  }

  AddFormGroup() {
    return this._fb.group({
      sectionOne: this._fb.array([]),
      sectionTwo: this._fb.array([]),
      sectionThree: this._fb.array([])
    });
  }

  DisableAddButton(form: FormArray) {
    return this._actcCommon.DisableWhenFormIsInvalid(form)
  }

  competitionDD$: Observable<ICompetetionDD[]> = new Observable()
  competitionDDArr: Array<any> = []

  currencyDD$: Observable<ICurrencyDD[]> = new Observable()
  currencyArray: Array<any> = []

  coachAndSupport$: Observable<IStakeHolderDD[]> = new Observable()
  coachAndSupport: Array<any> = [];


  getCompleteSectionTwoData$: Observable<any> = new Observable()
  presentYear: any = new Date().getFullYear()

  flowStatusOfFinalSubmit$: Observable<any> = new Observable();
  flowStatusOfFinalSubmit: any

  @ViewChild("dateOfJoining") dateOfJoining!: ElementRef
  GetData() {
    this.presentYear = this.year;
    this.competitionDD$ = this._actcCommon.GetComptetionDDByFilter(this.userData.sportId, this.presentYear, '', '',false)
    let getSectionTwoData$ = this._actcPartD.GetPartDSection2(this.presentYear, this.userData.sportId)
    this.currencyDD$ = this._actcCommon.GetCurrencyList()
    this.coachAndSupport$ = this._actcCommon.GetStakeholderDesignationDD("Coach,Support Staff");
    this.flowStatusOfFinalSubmit$ = this._actcCommon.FormSubmitFlowStatus(this.userData.user_id, this.presentYear, this.userData.sportId, this.userData.role_id)

    this.getCompleteSectionTwoData$ = forkJoin([
      this.competitionDD$,
      getSectionTwoData$,
      this.currencyDD$,
      this.coachAndSupport$,
      this.flowStatusOfFinalSubmit$
    ]).pipe(
      map(([competitionDD,
        getSectionTwoData,
        currencyDD,
        coachAndSupport,
        flowStatusOfFinalSubmit
      ]) => {
        this.flowStatusOfFinalSubmit = flowStatusOfFinalSubmit
        this.competitionDDArr = [...competitionDD]
        this.currencyArray = [...currencyDD]
        this.coachAndSupport = [...coachAndSupport]
        this.CheckForCoachAndSupportStaffData(getSectionTwoData.coachandsupportstafflist);
        this.CheckForRequirementAdministrativeList(getSectionTwoData.RequirementAdministrativeList);
        if (this.flowStatusOfFinalSubmit.IsEditable == false) {
          this.sectionTwoForm.disable();
          this.isDisabled = true;
        }
        return true
      })
    )
  }

  CheckForCoachAndSupportStaffData(arr: Array<ICoachandsupportstafflist>) {
    let national: Array<ICoachandsupportstafflist> = [], international: Array<ICoachandsupportstafflist> = []
    for (let ele of arr) {
      if (ele.Level == "National") national.push(ele)
      if (ele.Level == "International") international.push(ele)
    }
    if (international.length == 0) this.AddNewData('stepOne')
    else {
      for (let index = 0; index < international.length; index++) {
        this.PopulateDesignationDDAndAddFields(this.FormArrayOne, international[index], "firstSection", index)
      }
    }
    if (national.length == 0) this.AddNewData('stepTwo')
    else {
      for (let index = 0; index < national.length; index++) {
        this.PopulateDesignationDDAndAddFields(this.FormArrayTwo, national[index], "secondSection", index)
      }
    }
  }

  private PopulateDesignationDDAndAddFields(formArray: FormArray, object: ICoachandsupportstafflist, section: string, index: number) {
    formArray.push(this.AddCoachesAndSupportStaff(object, section, index))
    this.CompositionOptions(object.Stafftype, section, index)
  }

  CheckForRequirementAdministrativeList(array: Array<IRequirementAdministrativeList>) {
    this.PushAdministrativeFields(this.FormArrayThree, array);
  }

  PushAdministrativeFields(
    formArrayName: FormArray,
    data: Array<IRequirementAdministrativeList>
  ) {
    if (data.length == 0) {
      formArrayName.push(this.AddAdministrative());
    } else {
      data.forEach((x) => {
        formArrayName.push(this.AddAdministrative(x));
      });
    }
  }


  unsubscribe: Subject<any> = new Subject()
  sectionOneDesignationArray: Array<any> = []
  sectionTwoDesignationArray: Array<any> = []

  NewSelectStaffType(event: any, index: number, formArrayName: any) {
    this.CompositionOptions(event.target.value, formArrayName, index);
  }

  CompositionOptions(staffType: any, formArray: any, index: number) {
    if (formArray == 'firstSection') {
      if (staffType == 'Coach')
        this.sectionOneDesignationArray[index] = this.coachAndSupport.filter(element => { return (element.type == staffType) ? element : '' })
      if (staffType == 'Support Staff')
        this.sectionOneDesignationArray[index] = this.coachAndSupport.filter(element => { return (element.type == staffType) ? element : '' })
    }
    if (formArray == 'secondSection') {
      if (staffType == 'Coach')
        this.sectionTwoDesignationArray[index] = this.coachAndSupport.filter(element => { return (element.type == staffType) ? element : '' })
      if (staffType == 'Support Staff')
        this.sectionTwoDesignationArray[index] = this.coachAndSupport.filter(element => { return (element.type == staffType) ? element : '' })
    }
  }

  GetCompetitionDetail(competitionId: any, index: number | any, formArrayName: string | any) {
    if (competitionId != undefined) {
      this._actcCommon.GetComptetionDetails(competitionId).pipe(takeUntil(this.unsubscribe)).subscribe({
        next: (response) => {
          if(response != undefined){
            if (formArrayName == "firstSection" && index >= 0) this.SetVenue(this.FormArrayOne,index,response)
            if (formArrayName == "secondSection" && index >= 0) this.SetVenue(this.FormArrayTwo,index,response)
          }else{
            return 
          }
        }
      })
    }
  }

  SetVenue(formArray:FormArray,index:number,obj:any ){
    formArray.controls[index].get("venue")?.setValue(obj?.state + "," + obj?.place + "," + obj?.city + "," + (obj?.country || ''))
  }

  NextButton(editableStatus:boolean,formData: any, form: any){
    if(editableStatus) this.dataFromChild.emit(this.formListData)
    else this.SaveForm(formData,form)
  }

  SaveForm(formData: any, form: FormArray) {
    console.log(formData)
    let coachSupportStaffList = [
      ...formData.sectionOne,
      ...formData.sectionTwo,
    ];
    let adminList = [...formData.sectionThree];

    if (!form.valid) {
      this.sectionTwoForm.markAllAsTouched()
      this._alert.ShowWarning('Invalid data input', 0, "Please enter valid information.", true, "OK");
    } else {
      this._actcPartD.SavePartDSection2(this.userData.user_id, this.userData.sportId, this.presentYear, "ki_junior",
        coachSupportStaffList, adminList).pipe(
          concatMap(event => this._actcCommon.SaveFormStatus(this.formListData.form_Id,this.presentYear,this.userData.sportId)),
          takeUntil(this.unsubscribe)).subscribe({
          next: (response) => {
            if (!response) {
              this._alert.ShowWarning("Form has not been submitted.An error occured")
            } else {
              this._alert.ShowSuccess("Data Saved Successfully")
              this.dataFromChild.emit(this.formListData)
            }
          },
          error:(error:HttpErrorResponse)=>{
            this._alert.ShowWarning('Error', 0, error.message, true, "OK");
          }
        })
    }
  }

  SelectedDate(formArrayControls: FormArray, index: number, FromDateControl: string, ToDateControl: string) {
    FinYearDateValidation(formArrayControls, index, FromDateControl, ToDateControl);
  }

  GoToSectionThree() {
    this.dataFromChild.emit('Form_PartD_03');
  }
  GoToSectionOne() {
    this.dataFromChild.emit('Form_PartD_01');
  }

  AddNewData(type: any) {
    if (type == 'stepOne') this.FormArrayOne.push(this.AddCoachesAndSupportStaff(undefined, "sectionOne"));
    if (type == 'stepTwo') this.FormArrayTwo.push(this.AddCoachesAndSupportStaff(undefined, "sectionTwo"));
    if (type == 'stepThree') this.FormArrayThree.push(this.AddAdministrative());
  }

  RemoveField(index: number, type: any) {
    if (type == 'firstSection') this.FormArrayOne.removeAt(index);
    if (type == 'secondSection') this.FormArrayTwo.removeAt(index);
    if (type == "thirdSection") this.FormArrayThree.removeAt(index);
  }

  protected MinMaxDate(formArrayName: FormArray, formControlName: string, index: number) {
    return this._actcCommon.MinMaxDate(formArrayName, formControlName, index)
  }

  get FormArrayOne() {
    return this.sectionTwoForm.controls['sectionOne'] as FormArray;
  }

  get FormArrayTwo() {
    return this.sectionTwoForm.controls['sectionTwo'] as FormArray;
  }

  get FormArrayThree() {
    return this.sectionTwoForm.controls['sectionThree'] as FormArray;
  }

  get DatesOfCompetetionDFMin(){
    return `${this.presentYear}-04-01`
  }

  get DatesOfCompetetionDFMax(){
    return `${+this.presentYear + 1}-03-31`
  }

  get DatesOfCompetetionDTMin(){
    return `${this.presentYear}-04-01`
  }

  get DatesOfCompetetionDTMax(){
    return `${+this.presentYear + 1}-03-31`
  }

  

  resetEstimatedExpendure(index: number, formArrayName: any, type: any) {
    if (type == 'sectionOne') formArrayName.controls[index].get('CurrencyRate').reset();
    if (type == 'sectionTwo') formArrayName.controls[index].get('Salary').reset()
  }

  setvalidatorsAndEstimatedForFirstStep(index: number, tenure: any, salary: any, currencyConversionRate: any) {
    this.FormArrayOne.controls[index].get("CurrencyRate")?.setValidators(Validators.compose([Validators.required, Validators.pattern(/^\d{0,6}(\.\d{1,4})?$/)]));
    if (tenure == '' || salary == '') {
      this._alert.ShowWarning('Invalid data input', 0, "Please enter TENURE And SALARY First.", true, "OK");
      this.FormArrayOne.controls[index].get('Salary')?.reset();
    }
    let EstimateExpenditure = (tenure * salary * currencyConversionRate)
    this.FormArrayOne.controls[index].get("Total_Expenditure")?.setValue(EstimateExpenditure)
  }

  EstimatedExpenditureForSecondStep(index: any, tenure: any, salary: any) {
    if (tenure == '') {
      this._alert.ShowWarning('Invalid data input', 0, "Please enter TENURE First.", true, "OK");
      this.FormArrayTwo.controls[index].get('Salary')?.reset();
    }
    let EstimateExpenditure = (tenure * salary)
    this.FormArrayTwo.controls[index].get("Total_Expenditure")?.setValue(EstimateExpenditure)
  }

  EstimatedExpenditureForThirdSection(index: number, Date_of_Joining: any, Contract_Expiry_Date: any, Salary: any) {
    if (Date_of_Joining == '' || Contract_Expiry_Date == '') {
      this._alert.ShowWarning('Invalid data input', 0, "Please enter DATE OF JOINING And DATE OF CONTRACT EXPIRY First.", true, "OK");
      this.FormArrayThree.controls[index].get('Salary')?.reset();
    }
    else {
      let EstimateExpenditure = this._estimatedExpPipe.transform(Date_of_Joining, Contract_Expiry_Date, Salary);
      this.FormArrayThree.controls[index].get('Total_Expenditure')?.setValue(EstimateExpenditure)
    }
  }

  private AddCoachesAndSupportStaff(data?: ICoachandsupportstafflist, section?: string, index?: number) {
    return this._fb.nonNullable.group({
      ID: [data?.ID || 0],
      Designation_Id: [data?.Designation_Id || '', Validators.compose([Validators.required])],
      Designation: [data?.Designation || ''],
      Stafftype: [data?.Stafftype || '', Validators.compose([Validators.required])],
      team_composition: [this._actcCommon.CapitalizeFirstLetterOfString(data?.team_composition) || '', Validators.compose([Validators.required])],
      tournament_Id: [data?.tournament_Id || '', Validators.required],
      tournament_name: [data?.tournament_name || ''],
      TenureType: [data?.TenureType || '', Validators.compose([Validators.required])],
      TenureTime: [data?.TenureTime || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])],
      Salary: [data?.Salary || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,6}$/)])],
      CurrencyType: [data?.CurrencyType || 1],
      CurrencyRate: [data?.CurrencyRate || 0],
      Remarks: [data?.Remarks || '', Validators.compose([Validators.pattern(/^[ A-Za-z0-9_@./#&+-/s]{0,100}$/)])],
      Category: [data?.Category || 'KI_Junior'],
      Level: [data?.Level || this.CheckForLevelType(section)],
      venue: [{ value: data?.venue || this.GetCompetitionDetail(data?.tournament_Id, index, section), disabled: true }],
      Total_Expenditure: [data?.Total_Expenditure || '']
    });
  }

  private AddAdministrative(data?: IRequirementAdministrativeList) {
    return this._fb.group({
      ID: [data?.ID || 0],
      Designation: [data?.Designation || "", Validators.compose([Validators.required, Validators.pattern(/^[ A-Za-z0-9_@./#&+-/s]{0,100}$/)])],
      TenureType: [data?.TenureType || "", Validators.compose([Validators.required])],
      Date_of_Joining: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Date_of_Joining) || "", Validators.compose([Validators.required])],
      Contract_Expiry_Date: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Contract_Expiry_Date) || "", Validators.compose([Validators.required])],
      Total_Days: [data?.Total_Days || 0],
      Salary: [data?.Salary || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,6}$/)])],
      Remarks: [data?.Remarks || "", Validators.compose([Validators.pattern(/^[ A-Za-z0-9_@./#&+-/s]{0,100}$/)])],
      Category: [data?.Category || "Junior"],
      Total_Expenditure: [data?.Total_Expenditure || '']
    })
  }

  private CheckForLevelType(sectionName: string | undefined) {
    return (sectionName == "sectionTwo") ? "National" : "International"
  }

}


type Venue = {
  state:string,
  place:string,
  city:string,
  country:string
}