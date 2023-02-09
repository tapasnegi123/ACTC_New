import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, map, Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { CommonFormsService, IAgeCategoryDD, ICompetetionDD, ICurrencyDD, IEquipmentDD } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { AlertService } from 'src/app/_common/services/alert.service';
import { Coachandsupportstafflist, DoActcService, IGetEquipment, IGetInternationalComptIndia, IInternationalExposure, INationalChampionship, INationalCoachingCamp, IRemuneration, RequirementAdministrativeList } from 'src/app/_common/services/manage-actc/do-actc.service';
import { IUserCredentials } from 'src/app/_common/services/storage.service';
import { INSFInfo } from '../../../manage-actc-list/manage-actc-list.component';
import { IProposedACTCSummary } from '../proposed-actc.component';

@Component({
  selector: 'senior',
  templateUrl: './senior.component.html',
  styleUrls: ['./senior.component.scss']
})
export class SeniorComponent implements OnDestroy {

  proposedActcForm: FormGroup
  ToggleEditMode: boolean = true

  @Input() userData!: IUserCredentials<any>
  @Input() isEditable!: boolean
  @Input() year: any;
  @Input() routeData!: INSFInfo

  navLinkBtns = [
    { name: "NATIONAL COACHING CAMPS", id: 1 },
    { name: "INTERNATIONAL EXPOSURE", id: 2 },
    { name: "NATIONAL CHAMPIONSHIP", id: 3 },
    { name: "INTERNATIONAL COMPETITIONS IN INDIA", id: 4 },
    { name: "REMUNERATION INDIAN COACH & SUPPORT STAFF", id: 5 },
    { name: "EQUIPMENT", id: 6 },
  ]

  presentYear = new Date().getFullYear()
  category = "senior"
  constructor(private _fb: FormBuilder, private _alert: AlertService,
    private _actcCommon: CommonFormsService, private _actcDO: DoActcService) {
    this.proposedActcForm = this.AddFormGroup()
  }

  AddFormGroup() {
    return this._fb.group({
      nationalCoachingCampsSection: this._fb.array([]),
      internationalExposureSection: this._fb.array([]),
      nationalChampionship: this._fb.array([]),
      internationalComptIndia: this._fb.array([]),
      coachandsupportstafflist: this._fb.array([]),
      administrativeList: this._fb.array([]),
      consumable: this._fb.array([]),
      nonConsumable: this._fb.array([]),
    })
  }

  ngOnInit() {
    console.log(this.routeData)
    this.presentYear = this.year
    this.GetNationalCoachingCamps()
    this.GetCompetitionAndAgeCategoryDD()
  }

  ToggleEditableNonEditableView() {
    this.ToggleEditMode = !this.ToggleEditMode
  }

  RemoveField(index: any, formData: any) {
    formData.removeAt(index)
  }


  section: number = 1
  @Output() dataFromSenior: EventEmitter<any> = new EventEmitter()
  Save(section: number) {

    if (section == 1) {
      let formData = this.proposedActcForm.controls['nationalCoachingCampsSection']?.value
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
      this.ToggleTemplate(5)
      return
    }
    if (section == 5) {
      let coachandsupportstafflist = this.proposedActcForm.controls['coachandsupportstafflist']?.value
      let administrativeList = this.proposedActcForm.controls['administrativeList']?.value
      this.SaveRemunerationCoachSupportStaff(this.userData.user_id, this.userData.sportId, this.presentYear,
        this.userData.role_id, this.category, coachandsupportstafflist, administrativeList)
      this.ToggleTemplate(6)
    }
    if (section == 6) {
      let consumable, nonConsumable, formData
      consumable = this.proposedActcForm.controls['consumable']?.value
      nonConsumable = this.proposedActcForm.controls['nonConsumable']?.value
      formData = [...consumable, ...nonConsumable]
      this.SaveEquipment(this.userData.user_id, this.userData.sportId, this.presentYear, this.userData.role_id, this.category, formData)

      this.dataFromSenior.emit({ id: 2 })
    }
  }

  ToggleTemplate(data: any) {
    console.log(this.ToggleEditMode)
    if (data != this.section) {
      this.ToggleEditMode = true
      this.section = data
      this.unsubscribe.next(1)
      this.unsubscribe.complete()
      if (data == 1) this.GetNationalCoachingCamps()
      if (data == 2) this.GetInternationalExposure()
      if (data == 3) this.GetNationalChampionship()
      if (data == 4) this.GetInternationalComptIndia()
      if (data == 5) this.GetRemunerationCoachSuppportStaff()
      if (data == 6) this.GetEquipment()
      // this.MockToggle()
    }
  }

  get ToggleDelete(){
    return this.isEditable && !this.ToggleEditMode
  }

  unsubscribe: Subject<any> = new Subject()
  ageCategoryDDArray: Array<IAgeCategoryDD> = []
  competitionDD: Array<ICompetetionDD> = []
  equipmentDDArray: Array<IEquipmentDD> = []
  currencyDDArray: Array<ICurrencyDD> = []
  allDD$: Observable<any> = new Observable()
  purposeOfCoachingCamp: Array<any> = ["Training", "Pre Competition"]
  GetCompetitionAndAgeCategoryDD() {
    let getAgeCatGroupDD$: Observable<any> = this._actcCommon.GetAgeGroupDD()
    let competitionDD$: Observable<any> = this._actcCommon.GetComptetionDDByFilter(this.userData.sportId, this.presentYear, '', '',false)
    let equipmentDD$: Observable<any> = this._actcCommon.GetEquipmentList(this.userData.sportId)
    let currencyDD$: Observable<any> = this._actcCommon.GetCurrencyList()
    this.allDD$ = forkJoin([getAgeCatGroupDD$, competitionDD$, equipmentDD$, currencyDD$]).pipe(
      map(([getAgeCatGroupDD, competitionDD, equipmentDD, currencyDD]) => {
        this.competitionDD = [...competitionDD]
        this.ageCategoryDDArray = [...getAgeCatGroupDD]
        this.equipmentDDArray = [...equipmentDD]
        this.currencyDDArray = [...currencyDD]
        return true
      })
    )
  }

  DisableForm(editableStatus:boolean){
    // this.proposedActcForm.disable({onlySelf: !editableStatus})
    if(!editableStatus) this.proposedActcForm.disable()
  }

  nationalCoachingCamps$: Observable<any> = new Observable()
  subs!: Subscription
  GetNationalCoachingCamps() {
    this.nationalCoachingCamps$ = this._actcDO.Get_NationalCoachingCamp(this.year, this.routeData.sport_detail_id, this.userData.role_id, this.category).pipe(
      map(response => {
        console.log(response)
        this.SelectionAndPreparationCampFormArray.clear()
        if (typeof response != "string") {
          response.forEach(x => {
            this.SelectionAndPreparationCampFormArray.push(this.SelectionAndPreparationCampInputFields(x))
          })
           this.DisableForm(this.isEditable)
        }
        return response
      }),
      takeUntil(this.unsubscribe)
    )
  }

  SaveNationalCoachingCamp(userID: number, sportID: number, year: number, role_id: number, category: string, formData: any) {
    this._actcDO.SaveNationalCoachingCamp(userID, sportID, year, role_id, category, formData).pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (response) => {
        if (response) this._alert.ShowSuccess("Data saved successfully.")
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
      map(response => {
        if (typeof response != "string") {
          this.InternationalExposureFormArray.clear()
          response.forEach(x => {
            this.InternationalExposureFormArray.push(this.InternationalExposureInputFields(x))
          })
          this.DisableForm(this.isEditable)
          return response
        } else {
          return false
        }
      }),
      takeUntil(this.unsubscribe)
    )
  }

  SaveInternationalExposure(userID: number, sportID: number, year: number, role_id: number, category: string, formData: any) {
    console.log(formData)
    this._actcDO.SaveInternationalExposure(userID, sportID, year, role_id, category, formData).pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (response) => {
        if (response) this._alert.ShowSuccess("Data saved successfully.")
      }, error: () => {
      }
    })
  }

  nationalChampionship$: Observable<any> = new Observable()
  GetNationalChampionship() {
    this.nationalChampionship$ = this._actcDO.Get_NationalChampionship(this.presentYear, this.routeData.sport_detail_id, this.userData.role_id, 'senior').pipe(
      map((response) => {
        console.log(response);
        this.NationalChampionshipFormArray.clear()
        if (typeof response != "string") {
          response.forEach(x => {
            this.NationalChampionshipFormArray.push(this.NationalChampionshipInputFields(x))
          })
          this.DisableForm(this.isEditable)
        }
        return response
      })
    )
  }

  SaveNationalChampionship(userId: number, sportId: number, year: number, roleId: number, category: string, formData: any) {
    this._actcDO.SaveNationalChampionship(userId, sportId, year, roleId, category, formData).pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (response) => {
        if (response) this._alert.ShowSuccess("Data saved successfully.")
        console.log(response)
      },
      error: () => {

      }
    })
  }

  international_Compt_India$: Observable<any> = new Observable()
  GetInternationalComptIndia() {
    this.international_Compt_India$ = this._actcDO.Get_International_Compt_India(this.presentYear, this.routeData.sport_detail_id, this.userData.role_id, 'senior').pipe(
      map((response) => {
        console.log(response)
        if (typeof response != "string") {
          this.InternationalComptIndiaFormArray.clear()
          response.forEach(x => {
            this.InternationalComptIndiaFormArray.push(this.InternationalComptIndiaInputFields(x))
          })
          this.DisableForm(this.isEditable)
        }
        return response
      })
    )
  }

  SaveInternationalComptIndia(userId: number, sportId: number, year: number, roleId: number, category: string, formData: any) {
    this._actcDO.SaveInternationalComptetionIndia(userId, sportId, year, roleId, category, formData).pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (response) => {
        if (response) this._alert.ShowSuccess("Data saved successfully.")
      },
      error: () => {

      }
    })
  }

  get_Remuneration$: Observable<any> = new Observable()
  GetRemunerationCoachSuppportStaff() {
    this.get_Remuneration$ = this._actcDO.Get_Remuneration_Coach_SuppportStaff(this.presentYear, this.routeData.sport_detail_id, this.userData.role_id).pipe(
      map((response: IRemuneration) => {
        console.log(response)
        if (typeof response != "string") {
          this.CoachAndSupportStaffFormArray.clear()
          this.AdministrativeFormArray.clear()
          response.coachandsupportstafflist.forEach(x => {
            this.CoachAndSupportStaffFormArray.push(this.CoachAndSupportStaffInputfields(x))
          })
          response.RequirementAdministrativeList.forEach(x => {
            this.AdministrativeFormArray.push(this.AdministrativeInputfields(x))
          })
          this.DisableForm(this.isEditable)
        }
        return response
      })
    )
  }

  SaveRemunerationCoachSupportStaff(userId: number, sportId: number, year: number, roleId: number, category: string, coachandsupportstafflist: any, RequirementAdministrativeList: any) {
    this._actcDO.Save_Remuneration_Coach_SuppportStaff(userId, sportId, year, roleId, category, coachandsupportstafflist, RequirementAdministrativeList).pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (response) => {
        if (response) this._alert.ShowSuccess("Data saved successfully.")
      },
      error: (error:HttpErrorResponse) => {
        this._alert.ShowWarning("Error",0,error.message,true)
      }
    })
  }

  getEquipment$: Observable<any> = new Observable()
  GetEquipment() {
    this.getEquipment$ = this._actcDO.Get_Equipment(this.presentYear, this.routeData.sport_detail_id, this.userData.role_id, this.category).pipe(
      map(response => {
        console.log(response)
        this.ConsumableFormArray.clear()
        this.NonConsumableFormArray.clear()
        if (typeof response != "string") {
          response.forEach(x => {
            if (x.is_consumeable) this.ConsumableFormArray.push(this.ConsumableNonConsumable(x))
            else this.NonConsumableFormArray.push(this.ConsumableNonConsumable(x))
          })
        }
        return response
      })
    )
  }

  SaveEquipment(userId: number, sportId: number, year: number, roleId: number, category: string, formData: any) {
    this._actcDO.Save_Equipment(userId, sportId, year, roleId, category, formData).pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (response) => {
        if (response) this._alert.ShowSuccess("Data saved successfully.")
      },
      error: (response:HttpErrorResponse) => {
        this._alert.ShowWarning("Error",0,response.message,true)
      }
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(1)
    this.unsubscribe.complete()
  }

  get SelectionAndPreparationCampFormArray() {
    return this.proposedActcForm.controls['nationalCoachingCampsSection'] as FormArray
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

  get CoachAndSupportStaffFormArray() {
    return this.proposedActcForm.controls['coachandsupportstafflist'] as FormArray
  }

  get CoachAndSupportStaffFormControls() {
    return this.CoachAndSupportStaffFormArray.controls
  }

  get AdministrativeFormArray() {
    return this.proposedActcForm.controls['administrativeList'] as FormArray
  }

  get AdministrativeFormControls() {
    return this.AdministrativeFormArray.controls
  }

  get ConsumableFormArray() {
    return this.proposedActcForm.controls['consumable'] as FormArray
  }

  get NonConsumableFormArray() {
    return this.proposedActcForm.controls['nonConsumable'] as FormArray
  }

  //EquipmentInputFields
  get ConsumableFormControls() {
    return this.ConsumableFormArray.controls
  }

  get NonConsumableFormControls() {
    return this.NonConsumableFormArray.controls
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
      Category: [data?.Category || 'KL_Senior'],
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
      Category: [(data?.Category) || 'Senior'],
      NoOfPlayersExpected: [data?.NoOfPlayersExpected || 0, Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])],
      Sai_Comments: [data?.Sai_Comments],
      Final_Decision: [data?.Final_Decision],
      Action: [data?.Action],
      Purpose: [data?.Purpose]
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
      Tournament_Id: [data?.Tournament_Id || 0],
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

  private CoachAndSupportStaffInputfields(data: Coachandsupportstafflist) {
    return this._fb.group({
      Currency_Name: [data.Currency_Name],
      Sai_Comments: [data.Sai_Comments],
      Final_Decision: [data.Final_Decision],
      Action: [data.Action],
      ID: [data.ID],
      Designation_Id: [data.Designation_Id],
      Designation: [data.Designation],
      Stafftype: [data.Stafftype],
      team_composition: [data.team_composition],
      tournament_Id: [data.tournament_Id],
      tournament_name: [data.tournament_name],
      TenureType: [data.TenureType],
      TenureTime: [data.TenureTime],
      Salary: [data.Salary],
      CurrencyType: [data.CurrencyType],
      CurrencyRate: [data.CurrencyRate],
      Remarks: [data.Remarks],
      Category: [data.Category],
      Level: [data.Level],
      venue: [data.venue]
    })
  }

  private AdministrativeInputfields(data: RequirementAdministrativeList) {
    return this._fb.group({
      Sai_Comments: [data.Sai_Comments],
      Final_Decision: [data.Final_Decision],
      Action: [data.Action],
      ID: [data.ID],
      Designation: [data.Designation],
      TenureType: [data.TenureType],
      Date_of_Joining: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Date_of_Joining)],
      Contract_Expiry_Date: [this._actcCommon.ConvertStringToCalendarDateFormat(data?.Contract_Expiry_Date)],
      Total_Days: [data.Total_Days],
      Salary: [data.Salary],
      Remarks: [data.Remarks],
      Category: [data.Category],
    })
  }

  private ConsumableNonConsumable(data: IGetEquipment) {
    return this._fb.group({
      Id: [data?.Id || 0, Validators.compose([])],
      Equipment_Id: [data?.Equipment_Id || 0, Validators.compose([])],
      Equipment_Name: [data?.Equipment_Name || '', Validators.compose([])],
      is_consumeable: [data?.is_consumeable, Validators.compose([])],
      SportId: [data.SportId || this.userData.sportId, Validators.compose([])],
      Year: [data?.Year || this.presentYear, Validators.compose([])],
      Quantity: [data?.Quantity || 0, Validators.compose([])],
      Price: [data?.Price || 0, Validators.compose([])],
      Currency_Id: [data?.Currency_Id || 0, Validators.compose([])],
      Currency_Name: [data?.Currency_Name || "", Validators.compose([])],
      Conversion_Rate: [data?.Conversion_Rate || 0, Validators.compose([])],
      Expected_Price: [data?.Expected_Price || 0, Validators.compose([])],
      Remarks: [data?.Remarks || "", Validators.compose([])],
      Category: [data?.Category || "", Validators.compose([])],
      SAI_Comments: [data?.SAI_Comments, Validators.compose([])],
      Final_Decision: [data?.Final_Decision, Validators.compose([])],
      Action: [data?.Action || "", Validators.compose([])],
    })
  }

  protected MinMaxDate(formArrayName: FormArray, formControlName: string, index: number) {
    return this._actcCommon.MinMaxDate(formArrayName, formControlName, index)
  }

}


