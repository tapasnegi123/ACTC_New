import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { map, Observable, tap , takeUntil, Subject } from 'rxjs';
import { DoActcService } from 'src/app/_common/services/manage-actc/do-actc.service';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';
import { INSFInfo } from '../../manage-actc-list/manage-actc-list.component';

@Component({
  selector: 'kra-milestones',
  templateUrl: './kra-milestones.component.html',
  styleUrls: ['./kra-milestones.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KraMilestonesComponent implements OnDestroy{
  
  @Input() userData!: IUserCredentials<any>;
  @Input() year:any;
  @Input() routeData!:INSFInfo

  presentYear:number = new Date().getFullYear();

  btns = [
    {
      name:"SENIOR",
      id:1
    },
    {
      name:"JUNIOR",
      id:2
    },
  ]

  constructor(private _actcDO:DoActcService,private _localStorage: StorageService) { } 

  ngOnInit(){
    this.presentYear = this.year
    this.userData = this._localStorage.GetUserAllCredentials();
    this.GetData(this.kraType);
  }

  ngOnDestroy(): void {
    this.unsubscribe.unsubscribe
  }

  kraType = 1
  Toggle(category:number){
    this.kraType = category
    this.GetData(this.kraType)
  }

  kraMilestonesList$:Observable<any> = new Observable();
  completeData$:Observable<any> = new Observable();
  formData:any
  unsubscribe:Subject<any> = new Subject()
  GetData(category:number){
    this.kraMilestonesList$ = this._actcDO.GetKRA_Milestones(this.year,this.routeData.sport_detail_id,category).pipe(
      map(response => {
        this.formData = [...response]
        return response
      }),
      tap( (res:any) => {console.log(res)}),
      takeUntil(this.unsubscribe)
    )
  }

  GoToPreviousSection(section:number){
    this.dataFromChild.emit(section)
  }

  @Output() dataFromChild:EventEmitter<any> = new EventEmitter()
  GoToNextSection(){
    console.log("btn is clicked")
    this.dataFromChild.emit(4)
  }



}
