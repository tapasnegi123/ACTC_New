import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, map, Observable, Subject, take, takeUntil } from 'rxjs';
import { CommonFormsService, IAgeCategoryDD, ICompetetionDD } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { AlertService } from 'src/app/_common/services/alert.service';
import { DoActcService, IGetInternationalComptIndia, IInternationalExposure, INationalChampionship, INationalCoachingCamp } from 'src/app/_common/services/manage-actc/do-actc.service';
import { IUserCredentials } from 'src/app/_common/services/storage.service';
import { INSFInfo } from '../../../manage-actc-list/manage-actc-list.component';

@Component({
  selector: 'junior',
  templateUrl: './junior.component.html',
  styleUrls: ['./junior.component.scss']
})
export class JuniorComponent implements OnInit {
  proposedActcForm: FormGroup

  @Input() isEditable!: boolean
  @Input() userData!: IUserCredentials<any>
  @Input() year: any;
  @Input() routeData!: INSFInfo

  navLinkBtns = [
    { name: "SELECTION & PREPARATION CAMP", id: 1 },
    { name: "INTERNATIONAL EXPOSURE", id: 2 },
    { name: "NATIONAL CHAMPIONSHIP", id: 3 },
    { name: "INTERNATIONAL COMPETITIONS IN INDIA", id: 4 }
  ]
  category = "junior";
  presentYear = new Date().getFullYear()
  constructor(private _fb: FormBuilder, private _alert: AlertService,
    private _actcCommon: CommonFormsService, private _actcDO: DoActcService) {
    this.proposedActcForm = this.AddFormGroup()
  }

  AddFormGroup() {
    return this._fb.group({
      selectionAndPreparationCampsSection: this._fb.array([]),
      internationalExposureSection: this._fb.array([]),
      nationalChampionship: this._fb.array([]),
      internationalComptIndia: this._fb.array([]),
    })
  }

  ngOnInit() {
    this.presentYear = this.year
    this.GetNationalCoachingCamps()
    this.GetCompetitionAndAgeCategoryDD()
  }

  ToggleEditMode: boolean = true
  ToggleEditableNonEditableView() {
    this.ToggleEditMode = !this.ToggleEditMode
  }

  RemoveField(index: number, formData: any) {
    formData.removeAt(index)
  }

  section: number = 1
  ToggleTemplate(data: any) {
    if (data != this.section) {
      this.ToggleEditMode = true
      this.section = data
      this.unsubscribe.unsubscribe
      this.CheckDataAndCallAPI(data)
    }
  }

  get ToggleDelete(){
    return this.isEditable && !this.ToggleEditMode
  }

  CheckDataAndCallAPI(data: number) {
    switch (data) {
      case 1:
        this.GetNationalCoachingCamps()
        break;
      case 2:
        this.GetInternationalExposure()
        break;
      case 3:
        this.GetNationalChampionship()
        break;
      case 4:
        this.GetInternationalComptIndia()
        break;
      default:
        break;
    }
  }

  @Output() dataFromJunior: EventEmitter<any> = new EventEmitter()
  Save(section: number) {
    if (section == 1) {
      let formData = this.proposedActcForm.controls['selectionAndPreparationCampsSection']?.value
      this.SaveNationalCoachingCamp(this.userData.user_id, this.userData.sportId, this.presentYear, this.userData.role_id, this.category, formData)
      this.ToggleTemplate(2)
      return
    }
    if (section == 2) {
      let formData = this.proposedActcForm.controls['internationalExposureSection']?.value
      this.SaveInternationalExposure(this.userData.user_id, this.userData.sportId, this.presentYear, this.userData.role_id, this.category, formData)
      this.ToggleTemplate(3)
      return
    }
    if (section == 3) {
      let formData = this.proposedActcForm.controls['nationalChampionship']?.value
      this.SaveNationalChampionship(this.userData.user_id, this.userData.sportId, this.presentYear, this.userData.role_id, this.category, formData)
      this.ToggleTemplate(4)
      return
    }
    if (section == 4) {
      let formData = this.proposedActcForm.controls['internationalComptIndia']?.value
      this.SaveInternationalComptIndia(this.userData.user_id, this.userData.sportId, this.presentYear, this.userData.role_id, this.category, formData)
      this.dataFromJunior.emit({ id: 3 })
      // this.ToggleTemplate(5)
    }
  }


  unsubscribe: Subject<any> = new Subject()
  ageCategoryDDArray: Array<IAgeCategoryDD> = []
  competitionDD: Array<ICompetetionDD> = []
  allDD$: Observable<any> = new Observable()
  purposeOfCoachingCamp = ["Training", "Pre Competition"]
  GetCompetitionAndAgeCategoryDD() {
    let getAgeCatGroupDD$: Observable<any> = this._actcCommon.GetAgeGroupDD()
    let competitionDD$: Observable<any> = this._actcCommon.GetComptetionDDByFilter(this.userData.sportId, this.presentYear, '', '',false)
    this.allDD$ = forkJoin([getAgeCatGroupDD$, competitionDD$]).pipe(
      map(([getAgeCatGroupDD, competitionDD]) => {
        this.competitionDD = [...competitionDD]
        this.ageCategoryDDArray = [...getAgeCatGroupDD]
        return true
      }),
      take(1)
    )
  }

  nationalCoachingCamps$: Observable<any> = new Observable()
  GetNationalCoachingCamps() {
    this.nationalCoachingCamps$ = this._actcDO.Get_NationalCoachingCamp(this.presentYear, this.routeData.sport_detail_id, this.userData.role_id, this.category).pipe(
      map((response: any) => {
        console.log(response)
        this.SelectionAndPreparationCampFormArray.clear()
        if (typeof response != "string") {
          response.forEach((x: any) => {
            this.SelectionAndPreparationCampFormArray.push(this.SelectionAndPreparationCampInputFields(x))
          })
        }
        return response
      }),
      takeUntil(this.unsubscribe)
    )
  }

  SaveNationalCoachingCamp(userID: number, sportID: number, year: number, role_id: number, category: string, formData: any) {
    this._actcDO.SaveNationalCoachingCamp(userID, sportID, year, role_id, category, formData).pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (response) => {
        if (response) {
          // this.ToggleTemplate(2)
          this._alert.ShowSuccess("Data saved successfully.")
        }
      },
      error: (error) => {
        console.log(error)
        this._alert.ShowWarning("An unexpected error occured.Please contact your admin", 0, JSON.stringify(error), true, "OK")
      }
    })
  }

  internationalExposure$: Observable<any> = new Observable()
  GetInternationalExposure() {
    this.internationalExposure$ = this._actcDO.Get_InternationalExposure(this.presentYear, this.routeData.sport_detail_id, this.userData.role_id, this.category).pipe(
      map((response: any) => {
        this.InternationalExposureFormArray.clear()
        if (typeof response != "string") {
          response.forEach((x: any) => {
            this.InternationalExposureFormArray.push(this.InternationalExposureInputFields(x))
          })
        }
        return response
      }),
      takeUntil(this.unsubscribe)
    )
  }

  SaveInternationalExposure(userID: number, sportID: number, year: number, role_id: number, category: string, formData: any) {
    console.log(formData)
    this._actcDO.SaveInternationalExposure(userID, sportID, year, role_id, category, formData).pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (response) => {
        if (response) this._alert.ShowSuccess("Data saved successfully.")
        this.ToggleTemplate(3)
      }, error: () => {
      }
    })
  }

  nationalChampionship$: Observable<any> = new Observable()
  GetNationalChampionship() {
    this.nationalChampionship$ = this._actcDO.Get_NationalChampionship(this.presentYear, this.routeData.sport_detail_id, this.userData.role_id, this.category).pipe(
      map((response) => {
        this.NationalChampionshipFormArray.clear()
        if (typeof response != "string") {
          response.forEach(x => {
            this.NationalChampionshipFormArray.push(this.NationalChampionshipInputFields(x))
          })
        }
        return response
      })
    )
  }

  SaveNationalChampionship(userId: number, sportId: number, year: number, roleId: number, category: string, formData: any) {
    this._actcDO.SaveNationalChampionship(userId, sportId, year, roleId, category, formData).pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (response) => {
        this.ToggleTemplate(4)
        if (response) this._alert.ShowSuccess("Data saved successfully.")
        console.log(response)
      },
      error: () => {

      }
    })
  }

  international_Compt_India$: Observable<any> = new Observable()
  GetInternationalComptIndia() {
    this.international_Compt_India$ = this._actcDO.Get_International_Compt_India(this.presentYear,this.routeData.sport_detail_id, this.userData.role_id, this.category).pipe(
      map((response) => {
        this.InternationalComptIndiaFormArray.clear()
        if (typeof response != "string") {
          response.forEach(x => {
            this.InternationalComptIndiaFormArray.push(this.InternationalComptIndiaInputFields(x))
          })
        }
        return response
      }),
      takeUntil(this.unsubscribe)
    )
  }

  SaveInternationalComptIndia(userId: number, sportId: number, year: number, roleId: number, category: string, formData: any) {
    this._actcDO.SaveInternationalComptetionIndia(userId, sportId, year, roleId, category, formData).pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (response) => {
        if (response) this._alert.ShowSuccess("Data saved successfully.")
        this.ToggleTemplate(5)
      },
      error: () => {

      }
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(1)
    this.unsubscribe.complete()
  }

  get SelectionAndPreparationCampFormArray() {
    return this.proposedActcForm.controls['selectionAndPreparationCampsSection'] as FormArray
  }

  get SelectionAndPreparationCampControls() {
    return this.SelectionAndPreparationCampFormArray.controls
  }


  get InternationalExposureFormArray() {
    return this.proposedActcForm.controls['internationalExposureSection'] as FormArray
  }

  get InternationalExposureFormControls() {
    return this.InternationalExposureFormArray.controls
  }

  get NationalChampionshipFormArray() {
    return this.proposedActcForm.controls['nationalChampionship'] as FormArray
  }

  get NationalChampionshipControls() {
    return this.NationalChampionshipFormArray.controls
  }

  get InternationalComptIndiaFormArray() {
    return this.proposedActcForm.controls['internationalComptIndia'] as FormArray
  }

  get InternationalComptIndiaFormControls() {
    return this.InternationalComptIndiaFormArray.controls
  }

  private SelectionAndPreparationCampInputFields(data?: INationalCoachingCamp) {
    return this._fb.group({
      Id: [data?.Id || 0],
      PurposeOfCoachingCamp: [data?.PurposeOfCoachingCamp, Validators.required],
      Tournament_Id: [data?.Tournament_Id || '', Validators.required],
      Tournament_Name: [data?.Tournament_Name || 0],
      TeamComposition: [data?.TeamComposition || '', Validators.required],
      AgeCategory: [data?.AgeCategory || 0, Validators.required],
      AgeCategory_Name: [data?.AgeCategory_Name || 0, Validators.required],
      year: [data?.year || this.presentYear],
      SportId: [data?.SportId || this.userData.sportId],
      NoOfPlayer: [data?.NoOfPlayer || 0, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])],
      NoOfCoaches: [data?.NoOfCoaches || 0, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,2}$/)])],
      NoOfSupportStaff: [data?.NoOfSupportStaff || 0, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,2}$/)])],
      NameOfCenter: [data?.NameOfCenter || 0, Validators.compose([Validators.required, Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      State: [data?.State || '', Validators.required],
      City: [data?.City || '', Validators.compose([Validators.required, Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      Dates_From: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_From) || '', [Validators.required]],
      Dates_To: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_To) || '', [Validators.required]],
      TotalNoOfParticipants: [data?.TotalNoOfParticipants || 0],
      EstimatedExpenditure: [data?.EstimatedExpenditure || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      Category: [data?.Category || 'Junior'],
      Sai_Comments: [data?.Sai_Comments || ''],
      Final_Decision: [data?.Final_Decision || ''],
      Action: [data?.Action]
    })
  }

  private InternationalExposureInputFields(data?: IInternationalExposure) {
    return this._fb.group({
      AgeCategory: [data?.AgeCategory || 0, [Validators.required]],
      AgeCategory_Name: [data?.AgeCategory_Name],
      City: [data?.City || '', Validators.compose([Validators.required, Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      Country: [data?.Country || '', [Validators.required]],
      Dates_From: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_From) || '', [Validators.required]],
      Dates_To: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_To) || '', [Validators.required]],
      EstimatedExpenditure: [data?.EstimatedExpenditure || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      Id: [data?.Id || 0],
      NameOfCenter: [data?.NameOfCenter || '', Validators.compose([Validators.required, Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      NameOfTopRankedCountries: [data?.NameOfTopRankedCountries || '0'],
      NoOfCoaches: [data?.NoOfCoaches || 0, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,2}$/)])],
      NoOfCountries: [data?.NoOfCountries || 0, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,4}$/)])],
      NoOfPlayers: [data?.NoOfPlayers || 0, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])],
      NoOfSupportStaff: [data?.NoOfSupportStaff || 0, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,2}$/)])],
      Remarks: [data?.Remarks || '', Validators.compose([Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      SportId: [data?.SportId || this.userData.sportId],
      TeamComposition: [data?.TeamComposition || '0'],
      TotalParticipants: [data?.TotalParticipants || 0],
      Tournament_Id: [data?.Tournament_Id || '', Validators.required],
      Tournament_Name: [data?.Tournament_Name],
      year: [data?.year || this.presentYear],
      Category: [(data?.Category) || this.category],
      NoOfPlayersExpected: [data?.NoOfPlayersExpected || 0, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])],
      Sai_Comments: [data?.Sai_Comments],
      Final_Decision: [data?.Final_Decision],
      Action: [data?.Action],
    })
  }

  private NationalChampionshipInputFields(data: INationalChampionship) {
    return this._fb.group({
      AgeCategory_Name: [data?.AgeCategory_Name, Validators.required],
      Sai_Comments: [data?.Sai_Comments, Validators.required],
      Final_Decision: [data?.Final_Decision, Validators.required],
      Action: [data?.Action, Validators.required],
      Id: [data?.Id, Validators.required],
      AgeCategory: [data?.AgeCategory, Validators.required],
      year: [data?.year, Validators.required],
      SportId: [data?.SportId, Validators.required],
      NameOfStatesAndUTs: [data.NameOfStatesAndUTs, Validators.required],
      NameOfCenter: [data.NameOfCenter, Validators.required],
      State: [data.State, Validators.required],
      City: [data.City, Validators.required],
      City_Id: [data.City_Id, Validators.required],
      State_Id: [data.State_Id, Validators.required],
      Dates_From: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_From), Validators.required],
      Dates_To: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_To), Validators.required],
      EsimatedExpenditure: [data.EsimatedExpenditure, Validators.required],
      Remarks: [data.Remarks, Validators.required],
      Category: [(data?.Category) || 'Senior', Validators.required],
    })
  }

  private InternationalComptIndiaInputFields(data: IGetInternationalComptIndia) {
    return this._fb.group({
      AgeCategory_Name: [data?.AgeCategory_Name, Validators.compose([])],
      Tournament_Id: [data.Tournament_Id],
      Tournament_Name: [data?.Tournament_Name, Validators.compose([])],
      Sai_Comments: [data?.Sai_Comments, Validators.compose([])],
      Final_Decision: [data?.Final_Decision, Validators.compose([])],
      Action: [data?.Action, Validators.compose([])],
      Id: [data?.Id, Validators.compose([])],
      NameOfCompetition: [data?.NameOfCompetition, Validators.compose([])],
      AgeCategory: [data?.AgeCategory, Validators.compose([])],
      year: [data?.year, Validators.compose([])],
      SportId: [data?.SportId, Validators.compose([])],
      NoOfCountries: [data?.NoOfCountries, Validators.compose([])],
      NoOfAthletes: [data?.NoOfAthletes, Validators.compose([])],
      NoOfPlayers: [data?.NoOfPlayers, Validators.compose([])],
      NoOfCoaches: [data?.NoOfCoaches, Validators.compose([])],
      NoOfSupportStaff: [data?.NoOfSupportStaff, Validators.compose([])],
      NameOfCenter: [data?.NameOfCenter, Validators.compose([])],
      State: [data?.State, Validators.compose([])],
      City: [data?.City, Validators.compose([])],
      Dates_From: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_From), Validators.compose([])],
      Dates_To: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Dates_To), Validators.compose([])],
      TotalDays: [data?.TotalDays, Validators.compose([])],
      IndianTeamTotal: [data?.IndianTeamTotal, Validators.compose([])],
      ProposedLastDateOfSubmission: [data?.ProposedLastDateOfSubmission, Validators.compose([])],
      EstimatedExpenditure: [data?.EstimatedExpenditure, Validators.compose([])],
      Remarks: [data?.Remarks, Validators.compose([])],
      Category: [data?.Category, Validators.compose([])],
      City_Id: [data?.City_Id, Validators.compose([])],
      State_Id: [data?.State_Id, Validators.compose([])],
    })
  }

  protected MinMaxDate(formArrayName: FormArray, formControlName: string, index: number) {
    return this._actcCommon.MinMaxDate(formArrayName, formControlName, index)
  }

  minDate: any
  SetFromDate(event: any) {
    this.minDate = event.target.value
  }

  maxDate: any
  SetToDate(event: any) {
    this.maxDate = event.target.value
  }

}
