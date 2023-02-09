
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { concatMap, concatMapTo, concatWith, Subject, takeUntil } from 'rxjs';
import { CommonFormsService, IFormList } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { PartBService } from 'src/app/_common/services/actc-forms-service/part-b.services';
import { AlertService } from 'src/app/_common/services/alert.service';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';

@Component({
  selector: 'app-actc-forms-part-B-section-two',
  templateUrl: './actc-forms-part-B-section-two.component.html',
  styleUrls: ['./actc-forms-part-B-section-two.component.scss']
})

export class ActcFormsPartBSectionTwoComponent implements OnInit {
  @Output() dataFromChild: EventEmitter<any> = new EventEmitter<any>()
  @Input() year: any;
  @Input() formListData!: IFormList
  unsubscribe: Subject<any> = new Subject();
  AsOn_DateYear!: number;
  AsOn_DateMonth: any;
  MonthName = [{ month: 'January', Id: "1" }, { month: 'February', Id: "2" }, { month: 'March', Id: "3" }, { month: 'April', Id: "4" }, { month: 'May', Id: "5" }, { month: 'June', Id: "6" }, { month: 'July', Id: "7" }, { month: 'August', Id: "8" }, { month: 'September', Id: "9" }, { month: 'October', Id: "10" }, { month: 'November', Id: "11" }, { month: 'December', Id: "12" }];
  SectionTwoForm: any;
  medalsArr: Array<string> = ["Gold", "Silver", "Bronze"];
  athleteArrys = ["Athlete", "Team"];
  Category: string = "Junior";
  presentYear = new Date().getFullYear();
  userDetail!: IUserCredentials<any>;
  CompetetionPerformanceList: any;
  AgeGroup: any;
  competionDDArray: any;
  isDisabled: boolean = false;

  constructor(private fb: FormBuilder, private _actc: PartBService, private localstorage: StorageService,
    private _alert: AlertService, private _commonApi: CommonFormsService) {
    this.SectionTwoForm = this.AddFormGroup()
  }

  ngOnInit() {
    this.getdetails();
    this.getpartBsectionTwoData()
  }

  ngOnDestroy(){
    this.unsubscribe.next(1)
    this.unsubscribe.complete()
  }

  getpartBsectionTwoData() {
    this.presentYear = this.year;
    this._commonApi.GetAgeGroupDD().pipe(
      takeUntil(this.unsubscribe)
    ).subscribe((agegrp: any) => {
      this.AgeGroup = agegrp
    })
    this._commonApi.GetCompetitionList(this.userDetail.sportId, 'junior', "international",0).pipe(
      takeUntil(this.unsubscribe)
    ).subscribe((res: any) => {
      this.competionDDArray = res
      console.log(this.competionDDArray)
    })
    this.GetFlowStatus();
    this._actc.GetPartBSectionTwoData(this.presentYear, this.userDetail.sportId).pipe(takeUntil(this.unsubscribe)).subscribe(({
      next: (response: any) => {
        this.CompetetionPerformanceList = response.CompetetionPerformanceList;
        this.AddNewData(response);
        if (this.isDisabled) this.SectionTwoForm.disable({ onlySelf: true });
      }
    }))
  }

  GetFlowStatus() {
    this._commonApi.FormSubmitFlowStatus(this.userDetail?.user_id, this.year, this.userDetail?.sportId, this.userDetail?.role_id).subscribe(flowStatus => {
      this.isDisabled = !flowStatus.IsEditable;
    })
  }

  getdetails() {
    this.userDetail = this.localstorage.GetUserAllCredentials()
  }
  get FormArrayOne() {
    return this.SectionTwoForm.controls['SectionOne'] as FormArray
  }

  get FormArrayTwo() {
    return this.SectionTwoForm.controls['SectionTwo'] as FormArray
  }

  AddFormGroup() {
    return this.fb.group({
      SectionOne: this.fb.array([]),
      SectionTwo: this.fb.array([])
    })
  }

  RemoveField(index: number, type: any) {
    if (type == 'firstDelete') this.FormArrayOne.removeAt(index)
    if (type == 'secondDelete') this.FormArrayTwo.removeAt(index)
  }

  ChangeCompetition(competitionId: any, index?: any, formArrayName?: string) {
    if (competitionId != undefined || '' || null) {
      this._commonApi.GetComptetionDetails(competitionId).pipe(takeUntil(this.unsubscribe)).subscribe({
        next: (response) => {
          console.log(response)
          let date = new Date(response?.from_date);
          let month = date.getMonth() + 1;
          let year = date.getFullYear();
          if (formArrayName == "SectionOne" && index >= 0) {
            this.FormArrayOne.controls[index].get("Venue")?.setValue(response.place);
            this.FormArrayOne.controls[index].get("Comp_Month")?.setValue(month);
            this.FormArrayOne.controls[index].get("Comp_Year")?.setValue(year);
          }
          if (formArrayName == "SectionTwo" && index >= 0) {
            this.FormArrayTwo.controls[index].get("Comp_Month")?.setValue(month);
            this.FormArrayTwo.controls[index].get("Comp_Year")?.setValue(year);
          }
        }
      })
    }
  }

  ChangeAtheleteOrTeam(event: any, index: number, formArrayName?: any, formName?: any) {
    formName.controls[index].get('Name')?.reset();
    this.CompositionOptions(event.target.value, formArrayName, index);
  }

  changeTeamComposition(index: number, formArrayName: any) {
    formArrayName.controls[index].get('Name').reset();
  }

  compositionArr: Array<any> = []
  secondPhaseCompositionArr: Array<any> = []
  obj: any
  CompositionOptions(athleteOrTeam: any, formArray: any, index: number) {
    if (formArray == 'SectionOne') {
      if (athleteOrTeam == "Athlete") this.compositionArr[index] = ["Male", "Female"]
      if (athleteOrTeam == "Team") this.compositionArr[index] = ["Male", "Female", "Mixed"]
    }
    if (formArray == 'SectionTwo') {
      if (athleteOrTeam == "Athlete") this.secondPhaseCompositionArr[index] = ["Male", "Female"]
      if (athleteOrTeam == "Team") this.secondPhaseCompositionArr[index] = ["Male", "Female", "Mixed"]
    }
  }
  InputTeamKID(kitIdValue: any, index: number, formArrayname?: FormArray) {
    let configuration = formArrayname?.controls[index].get('configuration')?.value
    let genderVal = formArrayname?.controls[index].get('GenderComposition')?.value
    if (configuration == 'Athlete') {
      if (genderVal != (null || undefined || '')) {
        this._commonApi.GetAthletebyNSRSId(kitIdValue, this.userDetail?.sportId, genderVal).pipe(takeUntil(this.unsubscribe)).subscribe({
          next: (response: any) => {
            console.log(response)
            if (response?.length == 0) {
              this._alert.ShowWarning("No user Found", 0, "Please Enter A Valid NSRS Id", true, "OK")
              formArrayname?.controls[index].get('Name')?.reset();
            }
          }
        })
      }
    }
    if (configuration == '' || genderVal == '') {
      this._alert.ShowWarning("Please select team composition/ gender and configuration both")
      formArrayname?.controls[index].get('Name')?.setValue('')
      formArrayname?.controls[index].get('configuration')?.markAsTouched({ onlySelf: true })
      formArrayname?.controls[index].get('GenderComposition')?.markAsTouched({ onlySelf: true })
    }
  }

  AddNewData(response: any) {
    let national: Array<any> = [], international: Array<any> = []

    if (response.CompetetionPerformanceList.length == 0) {
      this.AddNewField("firstStep");
      this.AddNewField("secondStep");
    }
    response.CompetetionPerformanceList.map((list: any) => {
      if (list.Level.toLowerCase() == "national") national.push(list)
      else international.push(list)
    });
    international.forEach((data, index) => {
      this.FormArrayOne.push(this.AddFirstSectionInputFields(data, 'SectionOne', index));
      console.log(this.FormArrayOne)
      this.CompositionOptions(this._commonApi.CapitalizeFirstLetterOfString(data.configuration), 'SectionOne', index)
    })

    national.forEach((data, index) => {
      this.FormArrayTwo.push(this.AddSecondSectionInputFields(data, 'SectionTwo', index));
      this.CompositionOptions(this._commonApi.CapitalizeFirstLetterOfString(data.configuration), 'SectionTwo', index)
    })
  }

  AddNewField(type: any) {
    if (type == 'firstStep') this.FormArrayOne.push(this.AddFirstSectionInputFields(undefined, "SectionOne", undefined));
    if (type == 'secondStep') this.FormArrayTwo.push(this.AddSecondSectionInputFields(undefined, "SectionTwo", undefined))
  }

  DisableAddButton(form: any) {
    return this._commonApi.DisableWhenFormIsInvalid(form)
  }

  NextButton(editableStatus: boolean, formData: any) {
    if (editableStatus) this.dataFromChild.emit(this.formListData)
    else this.SaveForm(formData)
  }

  SaveForm(formData?: any) {
    let formDataRowValue = this.SectionTwoForm.getRawValue()
    let apipostData = [...formDataRowValue.SectionOne, ...formDataRowValue.SectionTwo];
    console.log(apipostData);
    if (!this.SectionTwoForm.valid) {
      this.SectionTwoForm.markAllAsTouched();
      this._alert.ShowWarning('Invalid data input', 0, "Please enter valid information.", true, "OK")
    }
    else {
      this._actc.SavePartBSectionTwo(this.userDetail.user_id, this.presentYear, this.userDetail.sportId, apipostData).pipe(
        concatMap(data => this._commonApi.SaveFormStatus(this.formListData.form_Id, this.presentYear, this.userDetail.sportId)),
        takeUntil(this.unsubscribe)
      )
        .subscribe({
          next: (response) => {
            if (response) {
              this.dataFromChild.emit(this.formListData)
              this._alert.ShowSuccess('Data Saved Successfully ')
            } else {
              this._alert.ShowWarning("Form is not saved !! Please try again")
            }
          }
        })
    }
  }

  GoToSectionThree() {
    console.log('save btn is');
    this.dataFromChild.emit('Form_PartB_03');
  }
  GoToPreviousForm() {
    this.dataFromChild.emit('Form_PartB_01');
  }

  dataCapitalLetter(data: any) {
    const str2 = data.charAt(0).toLowerCase() + data.slice(1);
    return str2
  }

  get DateOfJoiningMin(){
    return `${this.presentYear}-04-01`
  }

  get DateOfJoiningMax(){
    return `${+this.presentYear + 1}-03-31`
  }

  get ContractExpiryDateMin(){
    return `${this.presentYear}-04-01`
  }

  get ContractExpiryDateMax(){
    return `${+this.presentYear + 1}-03-31`
  }

  private CheckForLevelType(sectionName?: string) {
    return (sectionName == "SectionOne") ? "International" : "National"
  }

  private AddFirstSectionInputFields(data?: any, section?: string, index?: number) {
    return this.fb.group({
      AsOn_Date: [(data?.AsOn_Date) || '0'],
      Age_Category: [data?.Age_Category || '', Validators.required],
      Category: [data?.Category || this.Category],
      Country: [data?.Country || '0'],
      Final_Rank: [data?.Final_Rank || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])],
      GenderComposition: [data?.GenderComposition || "", Validators.required],
      ID: [data?.ID || 0],
      Level: [data?.Level || this.CheckForLevelType(section)],
      Medal_Won: [data?.Medal_Won || '', Validators.compose([Validators.required])],
      Name: [data?.Name || '', Validators.compose([Validators.required, Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      Venue: [{ value: this.ChangeCompetition(data?.Tournament_Id, index, section), disabled: true }],
      Remarks: [data?.Remarks || '', Validators.compose([Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      SportId: [this.userDetail?.sportId],
      State: [data?.State || '0'],
      Tournament_Id: [data?.Tournament_Id||0, [Validators.required]],
      World_Rank: [data?.World_Rank || '0'],
      configuration: [data?.configuration || "", Validators.required],
      tournament_name: [data?.tournament_name || '0'],
      year: [data?.year || this.presentYear],
      Comp_Month: [{ value: '', disabled: true }],
      Comp_Year: [{ value: '', disabled: true }]
    })
  }

  private AddSecondSectionInputFields(data?: any, section?: string, index?: number) {
    return this.fb.group({
      AsOn_Date: [(data?.AsOn_Date) || "0"],
      Category: [data?.Category || this.Category],
      Age_Category: [data?.Age_Category || '', Validators.required],
      Country: [data?.Country || '0'],
      Final_Rank: [data?.Final_Rank || '0'],
      GenderComposition: [data?.GenderComposition || '', Validators.required],
      ID: [data?.ID || 0],
      Level: [data?.Level || this.CheckForLevelType(section)],
      Medal_Won: [data?.Medal_Won || '0'],
      Name: [data?.Name || '', Validators.compose([Validators.required, Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      Venue: [{ value: '', disabled: true }],
      Remarks: [data?.Remarks || '', Validators.compose([Validators.pattern(/^[ A-Za-z0-9-(),]{0,100}$/)])],
      SportId: [this.userDetail?.sportId],
      State: [data?.State || '0'],
      Tournament_Id: [data?.Tournament_Id||0, [Validators.required]],
      World_Rank: [data?.World_Rank || '', Validators.compose([Validators.required, Validators.pattern(/^(?!(0))[0-9]{1,3}$/)])],
      configuration: [data?.configuration || "", [Validators.required]],
      tournament_name: [data?.tournament_name || '0'],
      year: [data?.year || this.presentYear],
      Comp_Month: [{ value: this.ChangeCompetition(data?.Tournament_Id, index, section), disabled: true }],
      Comp_Year: [{ value: '', disabled: true }]
    })
  }

}
