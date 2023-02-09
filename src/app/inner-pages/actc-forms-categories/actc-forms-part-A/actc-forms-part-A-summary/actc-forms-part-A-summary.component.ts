import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';
import { map, Observable, tap } from 'rxjs';
import { DoActcService } from 'src/app/_common/services/manage-actc/do-actc.service';

@Component({
  selector: 'app-actc-forms-part-A-summary',
  templateUrl: './actc-forms-part-A-summary.component.html',
  styleUrls: ['./actc-forms-part-A-summary.component.scss']
})
export class ActcFormsPartASummaryComponent implements OnInit, OnDestroy {

  constructor(private _doActcService: DoActcService,
    private _localStorage: StorageService) { }

  userData!: IUserCredentials<any>;
  presentYear: any;
  summaryData: any
  totalSeniorCount: any = 0
  @Input() year: any

  ngOnInit(): void {
    this.userData = this.GetUserDetail();
    this.presentYear = new Date().getFullYear()
    this.Get_NSFSummary_Data()
  }


  GetUserDetail() {
    return this._localStorage.GetUserAllCredentials()
  }


  nsf_SummaryData$: Observable<any> = new Observable()
  Get_NSFSummary_Data() {
    this.nsf_SummaryData$ = this._doActcService.Get_NSFProposedSummary(this.userData.sportId, this.year).pipe(tap(x => {
      this.summaryData = x
      this.summaryData.forEach((element: any) => {
        this.totalSeniorCount = this.totalSeniorCount + element.senior
      })
    })
    )
  }

  ngOnDestroy(): void {

  }

}
