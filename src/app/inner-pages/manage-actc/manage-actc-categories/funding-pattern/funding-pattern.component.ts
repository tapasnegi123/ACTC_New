import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { catchError, map, Observable, Subject, takeUntil } from 'rxjs';
import { CommonFormsService } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { AlertService } from 'src/app/_common/services/alert.service';
import { EditableStatus } from 'src/app/_common/services/manage-actc/common.service';
import { DoActcService, IFundingPattern } from 'src/app/_common/services/manage-actc/do-actc.service';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';
import { INSFInfo } from '../../manage-actc-list/manage-actc-list.component';

@Component({
  selector: 'funding-pattern',
  templateUrl: './funding-pattern.component.html',
  styleUrls: ['./funding-pattern.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FundingPatternComponent implements OnInit {

  fundingPatternForm:FormGroup

  @Input() userData!:IUserCredentials<any>
  @Input() year:any
  @Input() routeData!:INSFInfo
  isEditable:boolean = false

  constructor(private _localstorage:StorageService,private _actcCommon:CommonFormsService, 
    private _actcDO:DoActcService,private _fb:FormBuilder,private _alert:AlertService){
    this.fundingPatternForm = this.AddFormGroup()
  }

  AddFormGroup(){
    return  this._fb.group({
      fundingPattern: this._fb.array([])
    })
  }

  presentYear = new Date().getFullYear()
  previousYears:Array<any> = []
  ngOnInit(): void {
    this.presentYear = this.year
    this.userData = this._localstorage.GetUserAllCredentials()
    this.previousYears = this._actcCommon.GetPreviousYears(5)
    this.GetRangeYears(this.previousYears)
    this.GetData()
  }

  get CheckEditableStatus(){
    return EditableStatus(this.userData.role_id,this.routeData.currentUser)
  }

  fundingPattern$:Observable<any> = new Observable()
  GetData(){
    this.fundingPattern$ = this._actcDO.GetFundingPattern(this.year,this.routeData.sport_detail_id).pipe(
      map( ( result => {
        console.log(result)
        if(result.length != 0){
          result.forEach( (result) => {
            this.FundingPatternFormArray.push(this.AddFundingPatternInputFields(result))
          })
        }
        if(!EditableStatus(this.userData.role_id,this.routeData.currentUser) || this.userData.role_id == 47)this.fundingPatternForm.disable({onlySelf:true})
        return result
      }))
    )
  }

  unsubscribe:Subject<any> = new Subject()
  @Output() dataFromChild:EventEmitter<any> = new EventEmitter()
  SaveData(formData:any){
    let rawData = this.fundingPatternForm.getRawValue()
    let data = [...rawData.fundingPattern]
    console.log(data);
    this._actcDO.SaveFundingPattern(this.userData.user_id,this.presentYear,this.userData.sportId,data).pipe(
      takeUntil(this.unsubscribe)
    ).subscribe({
      next: (response) => {
        if(response)this.GoToNextSection(3)
        this._alert.ShowSuccess("Data Saved Successfully.")
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  get FundingPatternFormArray(){
    return this.fundingPatternForm?.controls['fundingPattern'] as FormArray
  }

  AddFundingPatternInputFields(data?:IFundingPattern,year?:any){
    return this._fb.group({
      Id:[data?.Id || 0],
      Financialyear: [ {value: data?.Financialyear, disabled:true} ],
      FundAlloted: [  data?.FundAlloted || ""],
      ActualSpend: [ data?.ActualSpend || ""],
    })
  }

  private GetRangeYears(yearArray:any){
    console.log(yearArray)
  }

  GoToNextSection(section:number){
    this.dataFromChild.emit(section)
  }

  GoToPreviousSection(section:number){
    this.dataFromChild.emit(section)
  }

}
