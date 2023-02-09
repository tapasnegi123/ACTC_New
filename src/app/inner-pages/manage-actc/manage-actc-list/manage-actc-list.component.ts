import { EncryptionService } from 'src/app/_common/services/encryption.service';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, map, Observable } from 'rxjs';
import { CommonFormsService, IGetACTCList } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { StorageService } from 'src/app/_common/services/storage.service';
import { environment2 } from 'src/environments/environment';
import { ManageActcState } from 'src/app/_common/services/manage-actc/manage-actc.state';

@Component({
  selector: 'manage-actc-list',
  templateUrl: './manage-actc-list.component.html',
  styleUrls: ['./manage-actc-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActcListComponent implements OnInit {
  dateArrays: Array<any> = []
  url = environment2.apiEndPoint;
  ActcStatus = ['Approved', 'Reject', 'Pending', 'Back to NSF'];
  SportsDiscpline = ['Hockey']
  ListData: any;
  @Output() dataFromChild: EventEmitter<any> = new EventEmitter()
  @Input() toggleView: unknown;
  userData: any;
  ACTCList: any;
  FilteredListData: Array<any> = [];
  tableHeadings:Array<string> = ["NAME OF FEDERATION","FINANCIAL YEARS","SPORTS DISCIPLINE","PROPOSED BUDGET","APPROVED BUDGET","STATUS","ACTION","RELEASE MOM"]

  constructor(private _commonApi: CommonFormsService, private _router: Router, private encrypt: EncryptionService,
    private _localStorage: StorageService, private manageActcState: ManageActcState) { }

  ngOnInit(): void {
    this.userData = this._localStorage.getUserData();
    this.GetData();
    this.GetPreviousYears()
  }

  GetPreviousYears() {
    for (let i = 0; i < 11; i++) {
      this.dateArrays.push(new Date().getFullYear() - i + " - " + ((new Date().getFullYear() - i + 1) % 100))
    }
  }

  checkForRole(data: INSFInfo) {
    if (this.userData.role_id == 1002) this.RouteToACTCForms(data.financialYear)
    else this.ToggleManageActcCategories(data);
  }

  RouteToACTCForms(year: string) {
    let actionYear = parseInt(year.split('-')[0])
    this._router.navigate(['/actc-forms', actionYear])
  }
  
  ToggleManageActcCategories(nsfCredential: INSFInfo) {
    // console.log(nsfCredential)
    this._router.navigate(['manage-actc/categories'], {
      queryParams: {
        data: this.encrypt.encryptionAES(JSON.stringify(nsfCredential))
      }
    })
  }

  completeData$: Observable<any> = new Observable();
  roleId: any
  GetData() {
    this.roleId = this.userData.role_id
    if (this.roleId == 47 ||this.roleId == 106 ||this.roleId == 1002) {
      let GetActcList$ = this._commonApi.GetACTCList(this.roleId, this.userData.user_id)
      this.completeData$ = forkJoin([GetActcList$]).pipe(
        map((response) => {
          console.log(response)
          this.ListData = response[0];
          this.FilteredListData = this.ListData
          return true
        })
      )
    } else {
      let GetActcList$ = this._commonApi.GetACTCList_for_Management()
      this.completeData$ = forkJoin([GetActcList$]).pipe(
        map((response) => {
          console.log(response)
          this.ListData = response[0];
          this.FilteredListData = this.ListData
          return true
        })
      )
    }
  }

  filterStatus(statusVal: any) {
    if (statusVal != '') {
      this.FilteredListData = this.ListData.filter((x: any) => {
        if (x.final_status == statusVal) return x
      })
    }
    else { this.FilteredListData = this.ListData }
  }

  navigation(value: any) {
    console.log(this.ListData)
    if (value && value.releaseMom === 'Release MOM') {
      sessionStorage.setItem('releaseMom', JSON.stringify(value))
      this._router.navigate(['/release-mom'])
    } else {
      window.open(`${this.url}SDO/View_Mom?FedrationId=${value.federation_Id}&FinYr=${value.financialYear}&FileType=Draft`);
    }
  }

}


export interface INSFInfo extends IGetACTCList {
  toggleStatus: number
}