import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ActcFormsService } from 'src/app/_common/services/actc-forms.service';
import { DoActcService } from 'src/app/_common/services/manage-actc/do-actc.service';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';
import { INSFInfo } from '../../manage-actc-list/manage-actc-list.component';

@Component({
  selector: 'budget-synopsis',
  templateUrl: './budget-synopsis.component.html',
  styleUrls: ['./budget-synopsis.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetSynopsisComponent implements OnInit{
  
  @Input() userData!: IUserCredentials<any>
  @Input() routeData!:INSFInfo
  @Input() year: any

  constructor(private _actcDO:DoActcService,private _localStorage: StorageService, private _actc:ActcFormsService){
  }

  presentYear = new Date().getFullYear()
  
  ngOnInit(): void {
    this.presentYear = this.year
    this.GetData()
  }
  
  getFormData$:Observable<any> = new Observable()
  seniorTotalSum:any
  DO_SeniorTotalSum:any
  juniorTotalSum:any
  DO_JuniorTotalSum:any
  GetData(){
    this.getFormData$ = this._actcDO.GetNSFProposedSummary(this.year,this.routeData.sport_detail_id).pipe(
      map( (response) => {
        console.log(response)
        if(response.length != 0){
          this.seniorTotalSum = response.map( res => res.senior).reduce((accumulator,currentvalue) => {
            return accumulator + currentvalue
          })
          this.juniorTotalSum = response.map( res => res.junior).reduce( (accumulator ,currentvalue) => {
            return accumulator + currentvalue
          })
          this.DO_SeniorTotalSum = response.map( res => res.DO_senior).reduce( (accumulator ,currentvalue) => {
            return accumulator + currentvalue
          })
          this.DO_JuniorTotalSum = response.map( res => res.DO_junior).reduce( (accumulator ,currentvalue) => {
            return accumulator + currentvalue
          })
          return response
        }else{
          return false
        }
      })
    )
  }

  @Output() dataFromChild:EventEmitter<any> = new EventEmitter()
  GoToNextSection(){
    this.dataFromChild.emit(5)
  }

  GoToPreviousSection(section:number){
    this.dataFromChild.emit(section)
  }
  
}
