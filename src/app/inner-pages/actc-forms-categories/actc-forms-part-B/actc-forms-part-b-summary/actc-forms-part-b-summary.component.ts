import { Component, Input, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DoActcService } from 'src/app/_common/services/manage-actc/do-actc.service';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';

@Component({
  selector: 'app-actc-forms-part-b-summary',
  templateUrl: './actc-forms-part-b-summary.component.html',
  styleUrls: ['./actc-forms-part-b-summary.component.scss']
})
export class ActcFormsPartBSummaryComponent implements OnInit {

  constructor(private _doActcService:DoActcService,
    private _localStorage:StorageService) { }
  
  @Input() year: any
  userData!:IUserCredentials<any>;
  presentYear:any
  summaryData:any
  totalJuniorCount:any=0

  ngOnInit(): void {
    this.userData=this.GetUserDetail()
    this.presentYear=new Date().getFullYear()
    this.Get_NSFSummary_Data()
  }

  GetUserDetail(){
    return this._localStorage.GetUserAllCredentials()
  }

  nsf_SummaryData$:Observable<any> =new Observable()
  Get_NSFSummary_Data(){
    this.nsf_SummaryData$=this._doActcService.Get_NSFProposedSummary(this.userData.sportId,this.year).pipe(tap(x=>{
      this.summaryData=x
      this.summaryData=this.summaryData.forEach((element:any)=>{
        this.totalJuniorCount=this.totalJuniorCount+element.junior
      })
    }))
  }

}
