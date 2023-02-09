import { Component, EventEmitter, OnInit, Output, QueryList, ViewChildren, Renderer2, ElementRef, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { concatMap, forkJoin, map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { CommonFormsService, ICompetetionDD, IFormList, IGetCompetitionList } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { ACTCFormsPartAService, ICompetetionPerformanceList, IGoalsAndMilestonesList, ITargetStrategyList } from 'src/app/_common/services/actc-forms-service/part-a.service';
import { ActcFormsService } from 'src/app/_common/services/actc-forms.service';
import { AlertService } from 'src/app/_common/services/alert.service';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';
import { NsfCommonBL } from 'src/app/_common/BL/nsf-common'

@Component({
  selector: 'app-actc-forms-part-A-section-three',
  templateUrl: './actc-forms-part-A-section-three.component.html',
  styleUrls: ['./actc-forms-part-A-section-three.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActcFormsPartASectionThreeComponent implements OnInit {

  @Input() userDetail!: IUserCredentials<any>
  @Output() dataFromChild: EventEmitter<any> = new EventEmitter<any>()
  @Input() presentYear: any
  @Input() formListData!: IFormList

  sectionTwoForm: FormGroup;
  unsubscribe: Subject<any> = new Subject();
  athleteArr = ["Athlete", "Team"];
  isDisabled: boolean = false;
  dateArr: Array<number> = []

  constructor(private _fb: FormBuilder, private _alert: AlertService, private _renderer: Renderer2, private _actcPartA: ACTCFormsPartAService,
   private _actc: ActcFormsService, private _actcCommon: CommonFormsService) {
    this.sectionTwoForm = this.AddSectionTwoFormControl()
  }

  medalsArr: Array<string> = ["Gold", "Silver", "Bronze"]

  AddSectionTwoFormControl() {
    return this._fb.group({
      firstStep: this._fb.array([]),
      secondStep: this._fb.array([]),
      thirdStep: this._fb.array([]),
      fourthStep: this._fb.array([]),
      fifthStep: this._fb.array([]),
    })
  }

  ngOnInit() {
    this.GetData();
    this.dateArr = [...this.GetLastFourYears(this.presentYear)]
  }
  
  ngOnDestroy(){
    this.unsubscribe.next(1)
    this.unsubscribe.complete()
  }

  GetLastFourYears(presentYear:number){
    let year = presentYear
    let response:Array<number> = []
    for(let i =0 ; i < 4 ;  i++ )response.push(--year)
    return response
  }

  thirdFieldArray: Array<any> = []
  fourthFieldArray: Array<any> = []
  eventList:Array<any>  = []
  masterCompetitionArr:Array<IGetCompetitionList> = []
  getCompleteData$: Observable<any> = new Observable()
  GetData() {
    let eventList$ = this._actcCommon.GetEvent(this.userDetail.sportId)
    let sectionThreeData$ = this._actcPartA.GetPartASectionThreeData(this.presentYear, this.userDetail?.sportId)
    let competitionList$ = this._actcCommon.GetCompetitionList(this.userDetail.sportId,"senior","international",0) 
    this.getCompleteData$ = this._actcCommon.FormSubmitFlowStatus(this.userDetail.user_id, this.presentYear, this.userDetail.sportId, this.userDetail.role_id).pipe(
      tap(response => {
        this.isDisabled = !response.IsEditable
      }),
      concatMap(() => forkJoin([sectionThreeData$,eventList$,competitionList$]).pipe(
        map(([sectionThreeData,eventList,competitionList]) => {
          this.masterCompetitionArr = [...competitionList]
          this.eventList = [...eventList]
          let national: ICompetetionPerformanceList[] = [], international: ICompetetionPerformanceList[] = []
          let GoalsAndMilestonesListSenior: ICompetetionPerformanceList[] = [], GoalsAndMilestonesListJunior: ICompetetionPerformanceList[] = []
          let fifthFieldArray = [...sectionThreeData?.Target_StrategyList]
          fifthFieldArray.forEach( response => this.FifthStepFormArray.push(this.AddFifthSectionFields(response)) )
          sectionThreeData.CompetetionPerformanceList.map((list) => {
            if (list.Level.toLowerCase() == "national") national.push(list)
            else international.push(list)
          })
          if (international.length == 0) this.AddFieldsForFirstStep()
          else {
            international.forEach((response, index) => {
              this.FirstStepFormArray.push(this.AddFirstSectionFields(response, 'firstStep', index,this.FirstStepFormArray))
              this.CompositionOptions(this._actcCommon.CapitalizeFirstLetterOfString(response.configuration), 'firstStep', index)
              this.PopulateCompetitionDD(this.AgOgCompetionDD,index,response.year,true)
            })
          }
          if (national.length == 0) this.AddFieldsForSecondStep();
          else {
            national.forEach((response, index) => {
              this.SecondStepFormArray.push(this.AddFirstSectionFields(response, 'secondStep', index,this.SecondStepFormArray))
              this.CompositionOptions(this._actcCommon.CapitalizeFirstLetterOfString(response.configuration), 'secondStep', index)
              this.PopulateCompetitionDD(this.otherInternationalCompetionDD,index,response.year,false)
            })
          }
          sectionThreeData?.GoalsAndMilestonesList.map((element: any) => {
            if (element.Category == "Senior") GoalsAndMilestonesListSenior.push(element)
            else GoalsAndMilestonesListJunior.push(element)
          })
          // this.AutoAddFields(GoalsAndMilestonesListSenior,this.ThirdStepFormArray,this.AddThirdSectionFields)
          // this.AutoAddFields(GoalsAndMilestonesListJunior,this.FourthStepFormArray,this.AddFourthSectionFields)
          this.AutoAddFieldsForThirdStep(GoalsAndMilestonesListSenior)
          this.AutoAddFieldsForFourthStep(GoalsAndMilestonesListJunior)

          if(this.isDisabled)this.sectionTwoForm.disable({ onlySelf:true })
          return true
        })
      )),
    )
  }

  GoToPreviousForm() {
    this.dataFromChild.emit("Form_PartA_02")
  }

  GoToNextForm() {
    this.dataFromChild.emit("Form_PartA_04")
  }

  AgOgCompetionDD:Array<IGetCompetitionList[]>  = []
  otherInternationalCompetionDD:Array<IGetCompetitionList[]> = []


  InputTeamKID(kitIdValue: any, index: number, formArrayname?: FormArray) {
    let configuration = formArrayname?.controls[index].get('configuration')?.value
    let genderVal = formArrayname?.controls[index].get('GenderComposition')?.value
    if (configuration == 'Athlete') {
      if (genderVal != (null || undefined || '')) {
        this._actcCommon.GetAthletebyNSRSId(kitIdValue, this.userDetail?.sportId, genderVal).pipe(takeUntil(this.unsubscribe)).subscribe({
          next: (response: any) => {
            if (response?.length == 0) {
              this._alert.ShowWarning("No user Found", 0, "Please Enter A Valid NSRS ID", true, "OK")
              formArrayname?.controls[index].get('Name')?.reset();
            }
          }
        })
      }
    }
    if (configuration == '' || genderVal == '') {
      this._alert.ShowWarning("Please select required options", 0, "Please select team composition/gender and configuration both", true, "OK")
      formArrayname?.controls[index].get('Name')?.reset();
    }
  }



  AddFieldsForFirstStep() {
    this.FirstStepFormArray.push(this.AddFirstSectionFields(undefined, 'firstStep'))
  }

  AddFieldsForSecondStep() {
    this.SecondStepFormArray.push(this.AddFirstSectionFields(undefined, 'secondStep'))
  }

  // AutoAddFields(array:Array<any>,formArray:FormArray,fn:(data?:any) => FormGroup){
  //   if(array.length != 0){
  //     array.forEach( data => formArray.push(fn(data)) )
  //   }else{
  //     formArray.push(fn())
  //   }
  // }

  AutoAddFieldsForThirdStep(array?: any) {
    if (array.length != 0) {
      array.forEach((data: any) => {
        this.ThirdStepFormArray.push(this.AddThirdSectionFields(data))
      })
    } else this.ThirdStepFormArray.push(this.AddThirdSectionFields())
  }

  AutoAddFieldsForFourthStep(array?: any) {
    if (array.length != 0) {
      array.forEach((data: any) => {
        this.FourthStepFormArray?.push(this.AddFourthSectionFields(data))
      })
    } else this.FourthStepFormArray?.push(this.AddFourthSectionFields())
  }


  AddFieldsForThirdStep(array?: any) {
    this.ThirdStepFormArray.push(this.AddThirdSectionFields())
  }

  AddFieldsForFourthStep(array?: any) {
    this.FourthStepFormArray?.push(this.AddFourthSectionFields())
  }

  NextButton(editableStatus:boolean,form:any){
    if(editableStatus) this.dataFromChild.emit(this.formListData)
    else this.SaveForm(form)
  }

  SaveForm(form: any) {
    let formData: any = this.sectionTwoForm.getRawValue()
    let GoalsAndMilestonesList = [...formData.thirdStep, ...formData.fourthStep]
    let Target_StrategyList = [...formData.fifthStep]
    let CompetetionPerformanceList = [...formData.firstStep, ...formData.secondStep].map((element: ICompetetionPerformanceList) => {
      element.year = parseInt(this.presentYear)
      return element
    })
    if (!form.valid) {
      this.sectionTwoForm.markAllAsTouched();
      this._alert.ShowWarning('Invalid data input', 0, "Please enter valid information.", true, "OK");
    }
    else {
      this._actc.SavePartASectionThreeData(this.userDetail.user_id, this.userDetail.sportId, this.presentYear,
        GoalsAndMilestonesList, Target_StrategyList, CompetetionPerformanceList).pipe(takeUntil(this.unsubscribe)).subscribe({
          next: (response) => {
            console.log(response)
            this._alert.ShowSuccess("Data Saved Successfully")
            this.dataFromChild.emit(this.formListData)
          }
        })
    }
  }

  ChangeCompetition(competitionId: any, index?: any, formArrayName?:FormArray) {
    if (competitionId != undefined || '' || null) {
      this._actcCommon.GetComptetionDetails(competitionId).pipe(takeUntil(this.unsubscribe)).subscribe({
        next: (response) => {
          formArrayName?.controls[index].get("Place")?.setValue(response.place + ', ' + response.city + ', ' + response.state + ', ' + response.country)
        }
      })
    }
  }

  ChangeAtheleteOrTeam(value: any, index: number,section?:string,formArrayName?: any, formControlName?:string) {
    formArrayName.controls[index].get(formControlName).setValue("");
    this.CompositionOptions(value,section, index);
  }

  changeTeamComposition(index: number, formArrayName:FormArray,formControlName:string) {
    formArrayName.controls[index].get(formControlName)?.setValue("")
  }

  compositionArr: Array<any> = []
  secondPhaseCompositionArr: Array<any> = []
  CompositionOptions(athleteOrTeam: any, formArray: any, index: number) {

    if (formArray == 'firstStep') {
      if (athleteOrTeam == "Athlete") this.compositionArr[index] = ["Male", "Female"]
      if (athleteOrTeam == "Team") this.compositionArr[index] = ["Male", "Female", "Mixed"]
    }

    if (formArray == 'secondStep') {
      if (athleteOrTeam == "Athlete") this.secondPhaseCompositionArr[index] = ["Male", "Female"]
      if (athleteOrTeam == "Team") this.secondPhaseCompositionArr[index] = ["Male", "Female", "Mixed"]
    }
  }

  PopulateCompetitionDD(arrayToBePopulate:Array<any>,index:number,year:any,isAgOg:boolean){
    let nsfCommon = new NsfCommonBL()
    arrayToBePopulate[index] = [...nsfCommon.GetCompetitionListAgOg(this.masterCompetitionArr,year,isAgOg)] 
  }

  RemoveField(index:number,formArray:FormArray){
    formArray.removeAt(index)
  }

  get FirstStepFormArray() {
    return this.sectionTwoForm.controls['firstStep'] as FormArray;
  }

  get SecondStepFormArray() {
    return this.sectionTwoForm.controls['secondStep'] as FormArray;
  }

  get ThirdStepFormArray() {
    return this.sectionTwoForm.controls['thirdStep'] as FormArray;
  }

  get FourthStepFormArray() {
    return this.sectionTwoForm?.controls['fourthStep'] as FormArray;
  }

  get FifthStepFormArray() {
    return this.sectionTwoForm.controls['fifthStep'] as FormArray;
  }

  get FieldMandatoryError() {
    return "This Field Is Mandatory"
  }

  DisableAddButton(form: any) {
    return this._actcCommon.DisableWhenFormIsInvalid(form)
  }

  private AddFirstSectionFields(data?: ICompetetionPerformanceList, section?: string, index?: number, formArrayName?:FormArray) {
    return this._fb.nonNullable.group({
      ID: [data?.ID || 0],
      Tournament_Id: [data?.Tournament_Id || 0, [Validators.required]],
      tournament_name: [data?.tournament_name || '0'],
      Category: [data?.Category || "Senior"],
      Level: [data?.Level || this.checkForLevel(section)],
      Place: [{value: this.ChangeCompetition(data?.Tournament_Id, index, formArrayName), disabled:true}],
      Country: [data?.Country || '0'],
      State: [data?.State || '0'],
      City: [data?.City || '0'],
      year: [data?.year || 0, [Validators.required]],
      configuration: [this._actcCommon.CapitalizeFirstLetterOfString(data?.configuration) || "", [Validators.required]],
      GenderComposition: [this._actcCommon.CapitalizeFirstLetterOfString(data?.GenderComposition) || "", [Validators.required]],
      Name: [data?.Name || "", [Validators.required]],
      Medal_Won: [data?.Medal_Won || "", Validators.compose([Validators.required])],
      Final_Rank: [data?.Final_Rank || "", Validators.compose([Validators.required, Validators.pattern(/^[0-9]{0,2}$/),])],
      World_Rank: [data?.World_Rank || "", Validators.compose([Validators.required, Validators.pattern(/^[0-9]{0,2}$/),])],
      AsOn_Date: [data?.AsOn_Date || "", [Validators.required]],
      Remarks: [data?.Remarks || ""],
    })
  }

  checkForLevel(section?: string) {
    return (section == 'firstStep') ? "International" : "National"
  }

  private AddThirdSectionFields(data?: IGoalsAndMilestonesList, section?: any): FormGroup {
    return this._fb.group({
      Id: [data?.Id || 0],
      CompetetionId: [data?.CompetetionId || "", [Validators.required]],
      tournament_name: [data?.tournament_name || ""],
      Category: [data?.Category || "Senior"],
      year: [data?.year || this.presentYear],
      SportId: [data?.SportId || this.userDetail?.sportId],
      partcipation: [data?.partcipation || '', Validators.compose([Validators.required, Validators.pattern(/^[0-9]{0,2}$/)])],
      top16: [data?.top16 || '', Validators.compose([Validators.required, Validators.pattern(/^[0-9]{0,2}$/)])],
      top8: [data?.top8 || '', Validators.compose([Validators.required, Validators.pattern(/^[0-9]{0,2}$/)])],
      Medals: [data?.Medals || '', Validators.compose([Validators.required, Validators.pattern(/^[0-9]{0,2}$/)])],
      Medals_At_Stake: [data?.Medals_At_Stake || "", Validators.compose([Validators.required, Validators.pattern(/^[0-9]{0,2}$/)])]
    })
  }

  private AddFourthSectionFields(data?: IGoalsAndMilestonesList, section?: any): FormGroup {
    return this._fb.nonNullable.group({
      Id: [data?.Id || 0,],
      CompetetionId: [data?.CompetetionId || "", [Validators.required]],
      tournament_name: [data?.tournament_name || ""],
      Category: [data?.Category || 'Junior',],
      year: [data?.year || this.presentYear,],
      SportId: [data?.SportId || this.userDetail?.sportId,],
      partcipation: [data?.partcipation || '', Validators.compose([Validators.required, Validators.pattern(/^[0-9]{0,2}$/),])], //int
      top16: [data?.top16 || '', Validators.compose([Validators.required, Validators.pattern(/^[0-9]{0,2}$/),])], //int
      top8: [data?.top8 || '', Validators.compose([Validators.required, Validators.pattern(/^[0-9]{0,2}$/),])], //int 
      Medals: [data?.Medals || '', Validators.compose([Validators.required, Validators.pattern(/^[0-9]{0,2}$/),])], //int
      Medals_At_Stake: [data?.Medals_At_Stake || "", Validators.compose([Validators.required, Validators.pattern(/^[0-9]{0,2}$/)])]
    })
  }

  private AddFifthSectionFields(data?: ITargetStrategyList): FormGroup {
    return this._fb.group({
      ID: [data?.ID],
      TS_Id: [data?.TS_Id],
      TS_Name: [data?.TS_Name],
      year: [this.presentYear],
      SportId: [this.userDetail?.sportId],
      Remark: [data?.Remark, Validators.compose([Validators.required, Validators.pattern(/^[ A-Za-z0-9_@./#&+-/s]{0,100}$/)])]
    })
  }


}






