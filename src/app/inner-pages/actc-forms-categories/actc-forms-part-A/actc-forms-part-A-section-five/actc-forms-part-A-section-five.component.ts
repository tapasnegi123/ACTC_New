import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, map, Observable, Subject, takeUntil } from 'rxjs';
import { CommonFormsService, IFormList, IGetCompetitionList } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { ACTCFormsPartAService, IInternationalCompetionsInIndum, IInternationalExposure, INationalChampionship, ISelectionAndPreparationCamp } from 'src/app/_common/services/actc-forms-service/part-a.service';
import { AlertService } from 'src/app/_common/services/alert.service';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';
import { FinYearDateValidation } from 'src/app/_common/utilities/nsf.util'

@Component({
  selector: 'app-actc-forms-part-A-section-five',
  templateUrl: './actc-forms-part-A-section-five.component.html',
  styleUrls: ['./actc-forms-part-A-section-five.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActcFormsPartASectionFiveComponent implements OnInit {
  @Output() dataFromChild: EventEmitter<any> = new EventEmitter<any>()
  @Input() formListData!: IFormList
  @Input() year: any
  sectionFiveForm: any
  presentYear: any = new Date().getFullYear()

  constructor(private _fb: FormBuilder, private _renderer: Renderer2,
    private _actcPartA: ACTCFormsPartAService, private _actcCommon: CommonFormsService, private _localStorage: StorageService, private _alert: AlertService) {
    this.GetUserDetail()
    this.sectionFiveForm = this.AddFormGroup()
  }

  puporseOfCoachingCampArray: Array<string> = ["Training", "Pre Competition", "Other"];
  teamComposition: Array<string> = ["Male", "Female", "Mixed"]
  isReadonly: boolean = true;

  GoToPreviousForm() {
    this.dataFromChild.emit("Form_PartA_04")
  }

  GoToNextForm() {
    this.dataFromChild.emit("Form_PartA_06")
  }

  AddFormGroup() {
    return this._fb.group({
      sectionOne: this._fb.array([]),
      sectionTwo: this._fb.array([]),
      sectionThree: this._fb.array([]),
      sectionFour: this._fb.array([]),
    })
  }
  ngOnInit() {
    this.GetData();
  }

  ngOnDestroy() {
    this.unsubscribe.next(1)
    this.unsubscribe.complete()
  }

  userData!: IUserCredentials<any>
  GetUserDetail() {
    this.userData = this._localStorage.GetUserAllCredentials()
  }

  completeData$: Observable<any> = new Observable();

  nationalCompetitionDD: Array<any> = [];
  competitionDDArrInternational: Array<any> = [];
  stateDDArray: Array<any> = [];
  countryDDArray: Array<any> = [];
  ageCatGroupDDArray: Array<any> = [];
  nationalSeniorCompetitionArr: Array<any> = [];
  internationalSeniorCompetitionArr: Array<any> = [];
  flowStatusOfFinalSubmit: any;
  isDisabled: boolean = false
  masterCompetitionArr:Array<IGetCompetitionList> = []
  GetData() {
    this.presentYear = this.year;
    let getSectionFiveData$: Observable<any> = this._actcPartA.GetPartASectionFiveData(this.presentYear, this.userData.sportId);
    let competitionDD$: Observable<any> = this._actcCommon.GetCompetitionList(this.userData.sportId, 'senior', '',0);
    let getStateDD$: Observable<any> = this._actcCommon.GetStateDD();
    let getAgeCatGroupDD$: Observable<any> = this._actcCommon.GetAgeGroupDD();
    let flowStatusOfFinalSubmit$: Observable<any> = this._actcCommon.FormSubmitFlowStatus(this.userData.user_id, this.presentYear, this.userData.sportId, this.userData.role_id)

    this.completeData$ = forkJoin([getSectionFiveData$, competitionDD$, getStateDD$,
      getAgeCatGroupDD$, flowStatusOfFinalSubmit$
    ]).pipe(
      map(([getPartASectionFiveData,competitionDD,
        getStateDD,getAgeCatGroupDD,flowStatusOfFinalSubmit]) => {
        console.log(competitionDD)
        let mastercompetitionDDArr = [...competitionDD];
        this.nationalCompetitionDD = mastercompetitionDDArr.filter(x => { return x.tournament_level == 'National' })
        this.competitionDDArrInternational = mastercompetitionDDArr.filter(x => { return x.tournament_level == 'International' })
        this.stateDDArray = getStateDD;
        this.ageCatGroupDDArray = getAgeCatGroupDD;
        this.flowStatusOfFinalSubmit = flowStatusOfFinalSubmit;
        if (flowStatusOfFinalSubmit.IsEditable == false) {
          this.isDisabled = true
        }
        if (getPartASectionFiveData.Selection_And_Preparation_Camp.length == 0) this.AddNewField('firstStep')
        if (getPartASectionFiveData.International_Exposure.length == 0) this.AddNewField('secondStep')
        if (getPartASectionFiveData.International_Competions_In_India.length == 0) this.AddNewField('thirdStep')
        if (getPartASectionFiveData.National_Championship.length == 0) this.AddNewField('fourthStep')

        this.AddNewFieldsAccordingToArray(getPartASectionFiveData.Selection_And_Preparation_Camp, "sectionOne")
        this.AddNewFieldsAccordingToArray(getPartASectionFiveData.International_Exposure, "sectionTwo")
        this.AddNewFieldsAccordingToArray(getPartASectionFiveData.International_Competions_In_India, "sectionThree")
        this.AddNewFieldsAccordingToArray(getPartASectionFiveData.National_Championship, "sectionFour")

        for (let i of mastercompetitionDDArr) {
          if (i.competitionId == 1004) {
            this.nationalSeniorCompetitionArr.push(i)
          }
          if (i.competitionId == 1006) {
            this.internationalSeniorCompetitionArr.push(i)
          }
        }
        if (this.isDisabled) this.sectionFiveForm.disable();
        return true
      })
    )
  }

  setStateCityVal(index: number, Tournament_Id: any, formArrayName: any, StateOrCountry: string, City: string) {
    if (Tournament_Id != undefined) {
      this._actcCommon.GetComptetionDetails(Tournament_Id).subscribe(res => {
        StateOrCountry == 'State' ? formArrayName.controls[index].get(StateOrCountry)?.patchValue(res.state) : formArrayName.controls[index].get(StateOrCountry)?.setValue(res.country);
        formArrayName.controls[index].get("City")?.patchValue(res.city);
        formArrayName.controls[index].get("NameOfCenter")?.patchValue(res.place);
        formArrayName.controls[index].get("Dates_From")?.patchValue(res.from_date);
        formArrayName.controls[index].get("Dates_To")?.patchValue(res.to_date);
      })
    }
  }

  CheckForIsEditable(formDataValue?: any, formData?: any) {
    if (this.isDisabled) this.dataFromChild.emit(this.formListData);
    else this.SaveData(formDataValue, formData)
  }

  unsubscribe: Subject<any> = new Subject()
  SaveData(formData?: any, form?: any) {
    let Selection_And_Preparation_Camp = [...formData.sectionOne];
    let International_Exposure = [...formData.sectionTwo];
    let International_Competions_In_India = [...formData.sectionThree];
    let National_Championship = [...formData.sectionFour];
    console.log(formData)

    if (!form.valid) {
      this.sectionFiveForm.markAllAsTouched();
      this._alert.ShowWarning('Form is not valid', 0, "Please enter valid information.", true, "OK");
    } else {
      this._actcPartA.SavePartASection5(this.userData.user_id, this.userData.sportId, this.presentYear,
        Selection_And_Preparation_Camp, International_Exposure, International_Competions_In_India, National_Championship).pipe(
          takeUntil(this.unsubscribe)
        ).subscribe({
          next: ((response: any) => {
            if (response) {
              this.dataFromChild.emit(this.formListData);
              this._alert.ShowSuccess("Data Saved Successfully");
            }
          })
        })
    }
  }

  SelectedDate(formArrayControls: FormArray, index: number, FromDateControl: string, ToDateControl: string) {
    FinYearDateValidation(formArrayControls, index, FromDateControl, ToDateControl)
  }


  AddNewField(type: string) {
    if (type == "firstStep") this.FirstFormArray.push(this.NationalCoachingcampsInputFields())
    if (type == "secondStep") this.SecondFormArray.push(this.InternationalExposureInputFields())
    if (type == "thirdStep") this.ThirdFormArray.push(this.InternationalCompetitionsIndia())
    if (type == "fourthStep") this.FourthFormArray.push(this.NationalChampionshipInputFields())
  }

  AddNewFieldsAccordingToArray(array: Array<any>, section: string) {
    if (section == "sectionOne") array.forEach((element: any, index: number) => { this.FirstFormArray.push(this.NationalCoachingcampsInputFields(element, index)) })
    if (section == "sectionTwo") array.forEach((element: any, index: any) => { this.SecondFormArray.push(this.InternationalExposureInputFields(element, index)) })
    if (section == "sectionThree") array.forEach(element => { this.ThirdFormArray.push(this.InternationalCompetitionsIndia(element)) })
    if (section == "sectionFour") array.forEach(element => { this.FourthFormArray.push(this.NationalChampionshipInputFields(element)) })
  }

  // RemoveField(index: any, type?: string) {
  //   if (type == "firstDelete") this.FirstFormArray.removeAt(index)
  //   if (type == "secondDelete") this.SecondFormArray.removeAt(index)
  //   if (type == "thirdDelete") this.ThirdFormArray.removeAt(index)
  //   if (type == "fourthDelete") this.FourthFormArray.removeAt(index)
  // }

  RemoveField(index:number,formArrayName:FormArray){
    formArrayName.removeAt(index)
  }

  DisableAddButton(form: any) {
    return this._actcCommon.DisableWhenFormIsInvalid(form)
  }

  protected MinMaxDate(formArrayName: FormArray, formControlName: string, index: number) {
    return this._actcCommon.MinMaxDate(formArrayName, formControlName, index)
  }

  get FinancialYearDFMin() {
    return `${this.presentYear}-04-01`
  }

  get FinancialYearDFMax() {
    return `${+this.presentYear + 1}-03-31`
  }

  get FinancialYearDTMin() {
    return `${this.presentYear}-04-01`
  }

  get FinancialYearDTMax() {
    return `${+this.presentYear + 1}-03-31`
  }

  get FirstFormArray() {
    return this.sectionFiveForm?.controls['sectionOne'] as FormArray
  }

  get SecondFormArray() {
    return this.sectionFiveForm?.controls['sectionTwo'] as FormArray
  }

  get ThirdFormArray() {
    return this.sectionFiveForm?.controls['sectionThree'] as FormArray
  }

  get FourthFormArray() {
    return this.sectionFiveForm?.controls['sectionFour'] as FormArray
  }

  private NationalCoachingcampsInputFields(data?: ISelectionAndPreparationCamp, index?: any): FormGroup {
    return this._fb.group({
      Id: [data?.Id || 0],
      PurposeOfCoachingCamp: [(data?.PurposeOfCoachingCamp) || '', Validators.required],
      Tournament_Id: [data?.Tournament_Id || '', Validators.required],
      TeamComposition: [(data?.TeamComposition) || '', Validators.required],
      AgeCategory: [data?.AgeCategory || '', Validators.required],
      year: [data?.year || this.presentYear],
      SportId: [data?.SportId || this.userData.sportId],
      NoOfPlayer: [data?.NoOfPlayer || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])],
      NoOfCoaches: [data?.NoOfCoaches || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,2}$/)])],
      NoOfSupportStaff: [data?.NoOfSupportStaff || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,2}$/)])],
      NameOfCenter: [data?.NameOfCenter || '', Validators.compose([Validators.required, Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      State: [data?.State || '', Validators.required],
      City: [data?.City || '', Validators.compose([Validators.required, Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      Dates_From: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_From) || '', [Validators.required]],
      Dates_To: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_To) || '', [Validators.required]],
      TotalNoOfParticipants: [data?.TotalNoOfParticipants || 0],
      EstimatedExpenditure: [data?.EstimatedExpenditure || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,8}$/)])],
      Category: [data?.Category || 'Senior'],
    })
  }

  private InternationalExposureInputFields(data?: IInternationalExposure, index?: any): FormGroup {
    return this._fb.group({
      AgeCategory: [data?.AgeCategory || '', [Validators.required]],
      City: [data?.City || '', Validators.compose([Validators.required, Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      Country: [data?.Country || '', [Validators.required]],
      Dates_From: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_From) || '', [Validators.required]],
      Dates_To: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_To) || '', [Validators.required]],
      EstimatedExpenditure: [data?.EstimatedExpenditure || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,8}$/)])],
      Id: [data?.Id || 0],
      NameOfCenter: [data?.NameOfCenter || ''],
      NameOfTopRankedCountries: [data?.NameOfTopRankedCountries || '0'],
      NoOfCoaches: [data?.NoOfCoaches || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,2}$/)])],
      NoOfCountries: [data?.NoOfCountries || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      NoOfPlayers: [data?.NoOfPlayers || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])],
      NoOfSupportStaff: [data?.NoOfSupportStaff || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,2}$/)])],
      Remarks: [data?.Remarks || '', Validators.compose([Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      SportId: [data?.SportId || this.userData.sportId],
      TeamComposition: [data?.TeamComposition || '0'],
      TotalParticipants: [data?.TotalParticipants || 0],
      Tournament_Id: [data?.Tournament_Id || '', Validators.required],
      year: [data?.year || this.presentYear],
      Category: [(data?.Category) || 'Senior'],
      NoOfPlayersExpected: [data?.NoOfPlayersExpected || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])],
    })
  }

  private InternationalCompetitionsIndia(data?: IInternationalCompetionsInIndum) {
    return this._fb.group({
      AgeCategory: [data?.AgeCategory || '', Validators.required],
      City: [data?.City || '', Validators.compose([Validators.required, Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      City_Id: [data?.City_Id || '0'],
      Dates_From: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_From) || '', Validators.required],
      Dates_To: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_To) || '', Validators.required],
      EstimatedExpenditure: [data?.EstimatedExpenditure || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,8}$/)])],
      Id: [data?.Id || 0],
      IndianTeamTotal: [data?.IndianTeamTotal || '0'],
      NameOfCenter: [data?.NameOfCenter || ''],
      NameOfCompetition: [data?.NameOfCompetition || ""],
      NoOfCoaches: [data?.NoOfCoaches || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,2}$/)])],
      NoOfCountries: [data?.NoOfCountries || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      NoOfPlayers: [data?.NoOfPlayers || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])],
      NoOfSupportStaff: [data?.NoOfSupportStaff || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])],
      ProposedLastDateOfSubmission: [data?.ProposedLastDateOfSubmission || '0'],
      Remarks: [data?.Remarks || '', Validators.compose([Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      SportId: [this.userData.sportId || ''],
      TotalDays: [data?.TotalDays || '0'],
      year: [data?.year || this.presentYear],
      Category: [(data?.Category) || 'Senior'],
      NoOfAthletes: [data?.NoOfAthletes || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])],
      State: [data?.State || '',],
      State_Id: [data?.State_Id || '0'],
      Tournament_Id: [data?.Tournament_Id || "", Validators.required]
    })
  }

  private NationalChampionshipInputFields(data?: INationalChampionship): FormGroup {
    return this._fb.group({
      AgeCategory: [data?.AgeCategory || '', Validators.required],
      City: [data?.City || '', Validators.compose([Validators.required, Validators.pattern(/^[ A-Za-z-(),]{0,100}$/)])],
      City_Id: [data?.City_Id || 0],
      Dates_From: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_From) || '', Validators.required],
      Dates_To: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_To) || '', Validators.required],
      EsimatedExpenditure: [data?.EsimatedExpenditure || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,8}$/)])],
      Id: [data?.Id || 0],
      NameOfCenter: [data?.NameOfCenter || '', Validators.compose([Validators.required, Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      Remarks: [data?.Remarks || '', Validators.compose([Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      SportId: [data?.SportId || this.userData.sportId],
      State: [data?.State || '0'],
      State_Id: [data?.State_Id || '', Validators.required],
      year: [data?.year || this.presentYear],
      Category: [(data?.Category) || 'Senior'],
      NameOfStatesAndUTs: [data?.NameOfStatesAndUTs || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])]
    })
  }

}
