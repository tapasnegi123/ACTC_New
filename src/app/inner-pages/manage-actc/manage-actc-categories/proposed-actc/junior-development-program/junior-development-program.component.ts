import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';
import {DoActcService} from 'src/app/_common/services/manage-actc/do-actc.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { INSFInfo } from '../../../manage-actc-list/manage-actc-list.component';

@Component({
  selector: 'junior-development-program',
  templateUrl: './junior-development-program.component.html',
  styleUrls: ['./junior-development-program.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JuniorDevelopmentProgramComponent implements OnInit, OnDestroy {

  @Input() year: any;
  @Input() routeData!:INSFInfo
  unsubscribeSubject:Subject<any> = new Subject();
  userDetail!:IUserCredentials<any>;

  sportId:any;
  role_id:any;
  sectionFirstData$:Observable<any> = new Observable() 
  sectionSecondData$:Observable<any> = new Observable() 
  sectionThirdData$:Observable<any> = new Observable() 
  navLinkBtns = [
    { name: "SECTION 1" , id:1 },
    { name: "SECTION 2" , id:2 },
    { name: "SECTION 3" , id:3 },
  ]
  section:number = 1
  category:string = "Ki_junior"
  // category2:string = "junior"
  @ViewChild('ACTCcontent') ACTCcontent:any

  constructor(private _localStorage:StorageService,private _doActcService:DoActcService,private modalService:NgbModal){
    this.getUserDetail();
  }


ngOnInit(){
  this.GetSectionFirst();
}
getUserDetail(){
  this.userDetail = this._localStorage.GetUserAllCredentials();
  this.sportId = this.userDetail.sportId;
  this.role_id = this.userDetail.role_id;
}
toggleTabContent(data:any){
  if(data !== this.section){
    this.section = data
    this.unsubscribeSubject.unsubscribe
    if(data == 1)this.GetSectionFirst()
    if(data == 2)this.GetSectionSecond()
    if(data == 3)this.GetSectionThird()
  }
}
GetSectionFirst(){
  this.sectionFirstData$ = this._doActcService.Get_Status_of_NCOE(this.year,this.routeData.sport_detail_id,this.role_id).pipe(
    map(res=>{
      console.log(res)
      return res
    })
  )
}
GetSectionSecond(){
  this.sectionSecondData$ = this._doActcService.Get_CoachAndSupportStaff(this.year,this.routeData.sport_detail_id,this.role_id,this.category).pipe(
    map(res=>{
      console.log(res)
      return res
    }),
    takeUntil(this.unsubscribeSubject)
  )
}
GetSectionThird(){
  this.sectionThirdData$ = this._doActcService.Get_Equipment(this.year,this.routeData.sport_detail_id,this.role_id,this.category).pipe(
    map(res=>{
      console.log(res)
      return res
    }),
    takeUntil(this.unsubscribeSubject)
  )
}
  ngOnDestroy(): void {
    this.unsubscribeSubject.unsubscribe();
  }

}
