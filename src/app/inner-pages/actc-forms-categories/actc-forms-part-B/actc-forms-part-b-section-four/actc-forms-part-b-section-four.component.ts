import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { concatWith, forkJoin, map, Observable, Subject, takeUntil } from 'rxjs';
import { CommonFormsService, IFormList } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { IInternationalCompetionsInIndia, IInternationalExposure, INationalChampionship, ISelectionAndPreparationCamp, PartBService } from 'src/app/_common/services/actc-forms-service/part-b.services';
import { AlertService } from 'src/app/_common/services/alert.service';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';
import { FinYearDateValidation } from 'src/app/_common/utilities/nsf.util'

@Component({
  selector: 'app-actc-forms-part-b-section-four',
  templateUrl: './actc-forms-part-b-section-four.component.html',
  styleUrls: ['./actc-forms-part-b-section-four.component.scss'],
})
export class ActcFormsPartBSectionFourComponent implements OnInit {
  isReadonly = true;
  editable = true;
  @Output() dataFromChild: any = new EventEmitter();
  @Input() year: any;
  @Input() formListData!: IFormList;
  SectionFourForm: FormGroup;
  purposeCategory: Array<string> = ['Competition', 'Selection', 'Training', 'Training And Competition', 'Others']

  constructor(private fb: FormBuilder, private _actcApi: PartBService,
    private _localStorage: StorageService, private _alert: AlertService,
    private _actcCommon: CommonFormsService
  ) {
    this.SectionFourForm = this.AddFormGroup();
  }

  presentYear: any = new Date().getFullYear();
  userDetail!: IUserCredentials<any>;
  Selection_And_Preparation_Camp: any;
  International_Exposure: any;
  International_Competions_In_India: any;
  National_Championship: any;
  teamComposition: Array<string> = ["Male", "Female", "Mixed"]
  puporseOfCoachingCampArray: Array<string> = ["Training", "Option Two"]
  categoryArray: Array<string> = ["Junior", "Senior"];
  unsubscribe: Subject<any> = new Subject();
  isDisabled: boolean = false;
  ngOnInit(): void {
    console.log(this.formListData)
    this.getDetails();
    this.GetData()
  }

  AddFormGroup() {
    return this.fb.group({
      SectionOne: this.fb.array([]),
      SectionTwo: this.fb.array([]),
      SectionThree: this.fb.array([]),
      SectionFour: this.fb.array([]),
    });
  }

  getDetails() {
    this.userDetail = this._localStorage.GetUserAllCredentials();
  }

  stateDDArray: Array<any> = [];
  cityDDArray: Array<any> = [];
  competitionDDArr: Array<any> = [];
  ageCatGroupDDArray: Array<any> = [];
  nationalJuniorCompetitionArr: Array<any> = [];
  internationalJuniorCompetitionArr: Array<any> = [];
  completeData$: Observable<any> = new Observable();
  internationalExposureCompDD:Array<any> = []
  GetData() {
    this.presentYear = this.year;
    this.GetFlowStatus();
    let getPartBSectionFourData$ = this._actcApi.GetPartBSectionFourData(this.presentYear, this.userDetail.sportId);
    let competitionDD$ = this._actcCommon.GetCompetitionList(this.userDetail.sportId, 'junior', '',0);
    let getAgeCatGroupDD$ = this._actcCommon.GetAgeGroupDD();
    let getStateDD$:Observable<any> = this._actcCommon.GetStateDD();

    this.completeData$ = forkJoin([getPartBSectionFourData$,competitionDD$,
      getAgeCatGroupDD$,getStateDD$]).pipe(
      map(([getPartBSectionFourData,competitionDD,
        getAgeCatGroupDD,getStateDD]) => {
          console.log(competitionDD)
          this.internationalExposureCompDD = [...competitionDD.filter(event => event.tournament_level == "International")]
          console.log(this.internationalExposureCompDD)
        this.competitionDDArr = [...competitionDD];
        this.ageCatGroupDDArray = getAgeCatGroupDD;
        this.stateDDArray = getStateDD;
        this.AddNewFieldsAccordingToArray(getPartBSectionFourData.Selection_And_Preparation_Camp, "SectionOne")
        this.AddNewFieldsAccordingToArray(getPartBSectionFourData.International_Exposure, "SectionTwo")
        this.AddNewFieldsAccordingToArray(getPartBSectionFourData.International_Competions_In_India, "SectionThree")
        this.AddNewFieldsAccordingToArray(getPartBSectionFourData.National_Championship, "SectionFour");
        if (this.isDisabled) this.SectionFourForm.disable({ onlySelf: true });
        return true
      })
    )
  }

  GetFlowStatus() {
    this._actcCommon.FormSubmitFlowStatus(this.userDetail?.user_id, this.year, this.userDetail?.sportId, this.userDetail?.role_id).subscribe(flowStatus => {
      this.isDisabled = !flowStatus.IsEditable;
    })
  }

  setStateCityVal(index: number, Tournament_Id: any, formArrayName: any, StateOrCountry: string, City: string) {
    if (Tournament_Id != undefined) {
      this._actcCommon.GetComptetionDetails(Tournament_Id).subscribe(res => {
        console.log(res)
        StateOrCountry == 'State' ? formArrayName.controls[index].get(StateOrCountry)?.patchValue(res.state) : formArrayName.controls[index].get(StateOrCountry)?.setValue(res.country);
        formArrayName.controls[index].get("City")?.patchValue(res.city);
        // formArrayName.controls[index].get("City")?.patchValue(res.city_id);
        // formArrayName.controls[index].get("NameOfCenter")?.patchValue(res.country + ", " + res.state + ", " + res.city + ", " + res.place);
        formArrayName.controls[index].get("NameOfCenter")?.patchValue(res.place);
        formArrayName.controls[index].get("Dates_From")?.patchValue(res.from_date)
        formArrayName.controls[index].get("Dates_To")?.patchValue(res.to_date)
      })
    }
  }
  GetCityList(index: any) {
    console.log(this.FormArrayOne.controls[index].get("State_Id")?.value);
    this._actcCommon.GetCityByStateDD(this.FormArrayOne.controls[index].get("State_Id")?.value).subscribe((res: any) => {
      this.cityDDArray = res;
    })
  }

  AddNewFieldsAccordingToArray(array: Array<any>, section: string) {
    if (section == "SectionOne") array.length == 0 ? this.FormArrayOne.push(this.AddFirstSectionInputFields()) : array.forEach(element => { this.FormArrayOne.push(this.AddFirstSectionInputFields(element)) })
    if (section == "SectionTwo") array.length == 0 ? this.FormArrayTwo.push(this.AddSecondSectionInputFields()) : array.forEach((element, index) => { this.FormArrayTwo.push(this.AddSecondSectionInputFields(element, index)) })
    if (section == "SectionThree") array.length == 0 ? this.FormArrayThree.push(this.AddThirdSectionInputFields()) : array.forEach(element => { this.FormArrayThree.push(this.AddThirdSectionInputFields(element)) })
    if (section == "SectionFour") array.length == 0 ? this.FormArrayFour.push(this.AddFourthSectionInputFields()) : array.forEach(element => { this.FormArrayFour.push(this.AddFourthSectionInputFields(element)) })
  }

  NextButton(editableStatus:boolean,formData:any){
    if(editableStatus) this.dataFromChild.emit(this.formListData)
    else this.SaveForm(formData)
  }

  SaveForm(formData?: any) {
    let apipostData = {
      Selection_And_Preparation_Camp: [...formData.SectionOne],
      International_Exposure: [...formData.SectionTwo],
      International_Competions_In_India: [...formData.SectionThree],
      National_Championship: [...formData.SectionFour],
    };

    if (!this.SectionFourForm.valid) {
      this.SectionFourForm.markAllAsTouched();
      this._alert.ShowWarning('Invalid data input', 0, "Please enter valid information.", true, "OK");

    } else {
      this._actcApi.SavePartBSectionFour(this.userDetail.user_id, this.presentYear, this.userDetail.sportId, apipostData).pipe(
        concatWith(this._actcCommon.SaveFormStatus(this.formListData.form_Id, this.presentYear, this.userDetail.sportId)),
        takeUntil(this.unsubscribe))
        .subscribe({
          next: (response) => {
            if (response) {
              this.dataFromChild.emit(this.formListData)
              this._alert.ShowSuccess('Data Saved Successfully');
            }
          },
        });
    }
  }

  SelectedDate(formArrayControls: FormArray, index: number, FromDateControl: string, ToDateControl: string) {
    FinYearDateValidation(formArrayControls, index, FromDateControl, ToDateControl)
  }

  get FormArrayOne() {
    return this.SectionFourForm.controls['SectionOne'] as FormArray;
  }
  get FormArrayTwo() {
    return this.SectionFourForm.controls['SectionTwo'] as FormArray;
  }
  get FormArrayThree() {
    return this.SectionFourForm.controls['SectionThree'] as FormArray;
  }
  get FormArrayFour() {
    return this.SectionFourForm.controls['SectionFour'] as FormArray;
  }

  GoToPreviousPage() {
    this.dataFromChild.emit('Form_PartB_03');
  }

  GoToSummary() {
    this.dataFromChild.emit('Form_PartB_00');
  }

  AddNewField(type?: any) {
    if (type == 'firstStep') {
      this.FormArrayOne.push(this.AddFirstSectionInputFields());
    }
    if (type == 'secondStep') {
      this.FormArrayTwo.push(this.AddSecondSectionInputFields());
    }
    if (type == 'thirdStep') {
      this.FormArrayThree.push(this.AddThirdSectionInputFields());
    }
    if (type == 'fourthStep') {
      this.FormArrayFour.push(this.AddFourthSectionInputFields());
    }
  }

  RemoveField(index: number, type: any) {
    if (type === 'firstDelete') {
      this.FormArrayOne.removeAt(index);
    }
    if (type == 'secondDelete') {
      this.FormArrayTwo.removeAt(index);
    }
    if (type == 'thirdDelete') {
      this.FormArrayThree.removeAt(index);
    }
    if (type == 'fourthDelete') {
      this.FormArrayFour.removeAt(index);
    }
  }

  DisableAddButton(form: any) {
    return this._actcCommon.DisableWhenFormIsInvalid(form)
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

  protected MinMaxDate(formArrayName: FormArray, formControlName: string, index: number) {
    return formArrayName.controls[index].get(formControlName)?.value
  }

  private AddFirstSectionInputFields(data?: ISelectionAndPreparationCamp) {
    return this.fb.group({
      AgeCategory: [data?.AgeCategory || '', [Validators.required]],
      City: [data?.City || '', Validators.required],
      Dates_From: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_From) || '', Validators.required],
      Dates_To: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_To) || '', Validators.required],
      EstimatedExpenditure: [data?.EstimatedExpenditure || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,8}$/)])],
      Id: [data?.Id || 0],
      NameOfCenter: [data?.NameOfCenter || '', Validators.compose([Validators.required, Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      NoOfCoaches: [data?.NoOfCoaches || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,2}$/)])],
      NoOfPlayer: [data?.NoOfPlayer || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])],
      NoOfSupportStaff: [data?.NoOfSupportStaff || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,2}$/)])],
      PurposeOfCoachingCamp: [data?.PurposeOfCoachingCamp || '', Validators.required],
      SportId: [data?.SportId || this.userDetail.sportId],
      State: [data?.State || '', Validators.required],
      State_Id: [data?.State_Id || '0'],
      TeamComposition: [this._actcCommon.CapitalizeFirstLetterOfString(data?.TeamComposition) || '', Validators.required],
      TotalNoOfParticipants: [data?.TotalNoOfParticipants || '0'],
      Tournament_Id: [data?.Tournament_Id || '', Validators.required],
      year: [data?.year || this.presentYear],
      Category: [(data?.Category) || 'JUNIOR'],
    });
  }
  private AddSecondSectionInputFields(data?: IInternationalExposure, index?: any) {
    return this.fb.group({
      AgeCategory: [data?.AgeCategory || '', [Validators.required]],
      City: [data?.City || '', [Validators.required]],
      Country: [data?.Country || '', [Validators.required]],
      Dates_From: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_From) || '', [Validators.required]],
      Dates_To: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_To) || '', [Validators.required]],
      EstimatedExpenditure: [data?.EstimatedExpenditure || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,8}$/)])],
      Id: [data?.Id || 0],
      // NameOfCenter: [{ value: this.setStateCityVal(index, data?.Tournament_Id, this.FormArrayTwo, 'Country', 'City') }],
      NameOfCenter: [ data?.NameOfCenter || ''],
      NameOfTopRankedCountries: [data?.NameOfTopRankedCountries || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,2}$/)])],
      NoOfCoaches: [data?.NoOfCoaches || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,2}$/)])],
      NoOfCountries: [data?.NoOfCountries || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      NoOfPlayers: [data?.NoOfPlayers || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])],
      NoOfSupportStaff: [data?.NoOfSupportStaff || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,2}$/)])],
      Remarks: [data?.Remarks || '', Validators.compose([Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      SportId: [data?.SportId || this.userDetail.sportId],
      TeamComposition: [this._actcCommon.CapitalizeFirstLetterOfString(data?.TeamComposition) || '', Validators.required],
      TotalParticipants: [data?.TotalParticipants || '0'],
      Tournament_Id: [data?.Tournament_Id || '', Validators.required],
      year: [data?.year || this.presentYear],
      NoOfPlayersExpected: [data?.NoOfPlayersExpected || '0'],
      Category: [(data?.Category) || 'Junior'],
      Purpose: [(data?.Purpose) || '', Validators.required]
    });
  }
  private AddThirdSectionInputFields(data?: IInternationalCompetionsInIndia) {
    return this.fb.group({
      Tournament_Id: [data?.Tournament_Id || '', Validators.required],
      AgeCategory: [data?.AgeCategory || '', Validators.required],
      NoOfCountries: [data?.NoOfCountries || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      NoOfAthletes: [data?.NoOfAthletes || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])],
      City: [data?.City || '', Validators.compose([Validators.required, Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      Dates_From: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_From) || '', Validators.required],
      Dates_To: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_To) || '', Validators.required],
      EstimatedExpenditure: [data?.EstimatedExpenditure || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,8}$/)])],
      Id: [data?.Id || 0],
      IndianTeamTotal: [data?.IndianTeamTotal || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      NameOfCenter: [data?.NameOfCenter || '', Validators.compose([Validators.required, Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      NoOfCoaches: [data?.NoOfCoaches || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,2}$/)])],
      NoOfPlayers: [data?.NoOfPlayers || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])],
      NoOfSupportStaff: [data?.NoOfSupportStaff || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,2}$/)])],
      ProposedLastDateOfSubmission: [data?.ProposedLastDateOfSubmission || '0'],
      Remarks: [data?.Remarks || '', Validators.compose([Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      SportId: [this.userDetail.sportId || ''],
      State: [data?.State || '', Validators.required],
      TotalDays: [data?.TotalDays || '0'],
      year: [data?.year || this.presentYear],
      Category: [(data?.Category) || 'JUNIOR'],
    });
  }
  private AddFourthSectionInputFields(data?: INationalChampionship) {
    return this.fb.group({
      AgeCategory: [data?.AgeCategory || '', Validators.required],
      City: [data?.City || '', Validators.compose([Validators.required, Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      Dates_From: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_From) || '', Validators.required],
      Dates_To: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_To) || '', Validators.required],
      EsimatedExpenditure: [data?.EsimatedExpenditure || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,8}$/)])],
      Id: [data?.Id || 0],
      NameOfCenter: [data?.NameOfCenter || '', Validators.compose([Validators.required, Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      NameOfStatesAndUTs: [data?.NameOfStatesAndUTs || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      Remarks: [data?.Remarks || '', Validators.compose([Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      SportId: [data?.SportId || this.userDetail.sportId],
      State: [data?.State || '0'],
      State_Id: [data?.State_Id || '', Validators.required],
      year: [data?.year || this.presentYear],
      City_Id: [data?.City_Id || '0'],
      Category: [(data?.Category) || 'JUNIOR'],
    });
  }

}
