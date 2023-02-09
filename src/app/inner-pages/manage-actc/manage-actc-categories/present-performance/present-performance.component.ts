import { IUserCredentials } from 'src/app/_common/services/storage.service';
import { DoActcService, IPresentPerformance } from 'src/app/_common/services/manage-actc/do-actc.service';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { AlertService } from 'src/app/_common/services/alert.service';
import { INSFInfo } from '../../manage-actc-list/manage-actc-list.component';
import { EditableStatus } from 'src/app/_common/services/manage-actc/common.service';

@Component({
  selector: 'present-performance',
  templateUrl: './present-performance.component.html',
  styleUrls: ['./present-performance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PresentPerformanceComponent {

  presentPerformanceForm:FormGroup
  presentYear = new Date().getFullYear()
  @Input() userData!:IUserCredentials<any>
  @Input() year:any
  @Input() routeData!:INSFInfo
  isEditable:boolean = false
  constructor( 
    private _actcDO:DoActcService,private _fb:FormBuilder,private _alert:AlertService){
      this.presentPerformanceForm = this.AddFormGroup()
  }

  ngOnInit(){
    console.log(this.routeData)
    if(this.year != null) this.presentYear = this.year
    this.GetData()
  }

  get CheckEditableStatus(){
    return EditableStatus(this.userData.role_id,this.routeData.currentUser)
  }

  AddFormGroup(){
    return  this._fb.group({
      presentPerformance: this._fb.array([])
    })
  }

  presentPerformance$:Observable<any> = new Observable()
  GetData(){
    this.presentPerformance$ = this._actcDO.GetPresentPerformance(this.year,this.routeData.sport_detail_id).pipe(
      map( (response) => {
        response.forEach( (element) => {
          this.PresentPerformanceFormArray.push(this.AddPresentPerformanceInputFields(element))
        })
        if(!EditableStatus(this.userData.role_id,this.routeData.currentUser) || this.userData.role_id == 47)this.presentPerformanceForm.disable({onlySelf:true})
        return response
      })
    )
  }

  unsubscribe:Subject<any> = new Subject()
  @Output() dataFromChild:EventEmitter<any> = new EventEmitter()
  SaveData(formData:any){
    let data = [...formData.presentPerformance]
    console.log(data)
    this._actcDO.SavePresentPerformance(this.userData.user_id,this.presentYear,this.userData.sportId,data).pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (response:any) => {
        if(response)this.GoToNextSection()        
        this._alert.ShowSuccess("Data Saved Successfully.")
      },
      error: (err) => {

      }
    })
  }

  GoToNextSection(){
    this.dataFromChild.emit(2)
  }

  get PresentPerformanceFormArray(){
    return this.presentPerformanceForm?.controls['presentPerformance'] as FormArray
  }

  AddPresentPerformanceInputFields(data?:IPresentPerformance,year?:any){
    return this._fb.group({
      ID:[data?.ID || 0],
      tournament_name:[data?.tournament_name],
      previous_participation:[data?.previous_participation || 0,Validators.compose([Validators.pattern(/^\d+$/)])],
      previous_medal_won:[data?.previous_medal_won || 0,Validators.compose([Validators.pattern(/^\d+$/)])],
      participation:[data?.participation],
      medal_won:[data?.medal_won]
    })
  }

}
