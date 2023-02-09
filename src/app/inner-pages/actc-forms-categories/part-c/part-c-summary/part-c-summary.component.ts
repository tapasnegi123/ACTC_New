import { Component, Input, OnInit } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { DoActcService } from 'src/app/_common/services/manage-actc/do-actc.service';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';

@Component({
  selector: 'app-part-c-summary',
  templateUrl: './part-c-summary.component.html',
  styleUrls: ['./part-c-summary.component.scss']
})
export class PartCSummaryComponent implements OnInit {
  @Input() year:any
  presentYear:any 
  constructor(private _localStorage:StorageService,private _actcDO:DoActcService,) { 
    this.presentYear = new Date().getFullYear()
    this.GetUserDetail()
  }

  ngOnInit(): void {
    this.GetData()
  }

  userData!:IUserCredentials<any>
  GetUserDetail() {
    this.userData = this._localStorage.GetUserAllCredentials()
  }

  getFormData$:Observable<any> = new Observable()
  seniorTotalSum:any
  juniorTotalSum:any
  GetData(){
    this.presentYear = this.year;
    console.log(" part c section 1  this.presentYear",this.presentYear);
    this.getFormData$ = this._actcDO.GetNSFProposedSummary(this.presentYear,this.userData?.sportId).pipe(
      map( (response) => {
        this.seniorTotalSum = response.map( res => res.senior).reduce((accumulator,currentvalue) => {
          return accumulator + currentvalue
        })
        this.juniorTotalSum = response.map( res => res.junior).reduce( (accumulator ,currentvalue) => {
          return accumulator + currentvalue
        })
        console.log(response);
        return response
      })
    )
  }

}
