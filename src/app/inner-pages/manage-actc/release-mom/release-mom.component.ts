import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { AlertService } from 'src/app/_common/services/alert.service';
import { ReleaseMomServiceService } from 'src/app/_common/services/manage-actc/release-mom-service.service';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';
import { environment, environment2 } from "src/environments/environment";
@Component({
  selector: 'release-mom',
  templateUrl: './release-mom.component.html',
  styleUrls: ['./release-mom.component.scss']
})
export class ReleaseMomComponent implements OnInit {
  meetingForm!: FormGroup;
  presentYear: any = new Date().getFullYear();
  submitted: boolean = false;
  loading = false;
  federationId!: number;
  financialYear!: string;
  fedrationData: Array<any> = [];
  url = environment2.apiEndPoint;
  userData$: Observable<any> = new Observable();
  //unsubscribe: Subject<any> = new Subject
  userData: any = JSON.parse(sessionStorage.getItem('releaseMom')!);
  userDetail?: IUserCredentials<any>
  constructor(private fb: FormBuilder, private _localStorage: StorageService, private releaseMomService: ReleaseMomServiceService, private _alert: AlertService) {}
  ngOnInit(): void {
    this.getActcSubmission();
    this.userDetail = this._localStorage.GetUserAllCredentials();
    this.meetingForm = this.fb.group({
      date_of_Meeting: ['', Validators.compose([Validators.required])],
      venue_of_Meeting: ['', Validators.compose([Validators.required])],
      time_of_Meeting: ['', Validators.compose([Validators.required])],
      projected_Targets_For: ['', Validators.compose([Validators.required])],
      special_Terms_And_Condition: [''],
      nsF_Participants:['', Validators.compose([Validators.required])],
      sai_Participants:['', Validators.compose([Validators.required])]
    })

  }


  get DatesOfCompetetionDFMin() {
    return `${this.presentYear}-01-01`
  }

  get DatesOfCompetetionDFMax() {
    return `${+this.presentYear + 1}-12-31`
  }

  ngOnDestroy() {
    sessionStorage.removeItem('releaseMom')
  }

  getActcSubmission() {
    this.federationId = this.userData.federation_Id;
    this.financialYear = this.userData.financialYear;
    this.userData$ = this.releaseMomService.getReleaseMom(this.federationId, this.financialYear).pipe(
      map((response: any) => {
        this.fedrationData = response;
        this.patchValue(response[0]);
        return response[0];
      })
    )
  }

  convertToInt(value: any) {
    return Number(value) + 1;
  }

  patchValue(value: any) {
    this.meetingForm.controls['venue_of_Meeting'].patchValue(value.venue_of_Meeting);
    this.meetingForm.controls['date_of_Meeting'].patchValue(value.date_of_Meeting.substring(0, 10));
    this.meetingForm.controls['time_of_Meeting'].patchValue(value.time_of_Meeting.substring(0, 5));
    this.meetingForm.controls['projected_Targets_For'].patchValue(value.projected_Targets_For);
    this.meetingForm.controls['special_Terms_And_Condition'].patchValue(value.special_Terms_And_Condition);
  }

  get f() {
    return this.meetingForm.controls
  }

  saveDraft() {
    return new Promise(resolve => {
      try {
        if (this.meetingForm.valid) {
          this.loading = true
          let obj = this.meetingForm.getRawValue();
          let mergeObj = {
            id: this.fedrationData[0].id,
            fedrationName: this.fedrationData[0].federationsName
            , sportName: this.fedrationData[0].sportName
          }
          let object = Object.assign(obj, mergeObj);
          this.releaseMomService.saveAsDraft(this.userDetail?.user_id, this.federationId, this.financialYear, this.userData.sport_detail_id, this.userDetail?.role_id, object).subscribe((res: any) => {
            if (res) {
              this.loading = false;
              resolve(true);
              this.submitted = true;
              this._alert.ShowSuccess("success")
            }
            else{
              this._alert.ShowWarning("An unexpected error occured.", 0,"Please contact your admin" , true, "OK")
            }

          })
        }
      } catch (e) {
        resolve(false);
        this.loading = false;
      }
    });
  }

  viewPdf(fileType: string) {
    window.open(`${this.url}SDO/View_Mom?FedrationId=${this.federationId}&FinYr=${this.financialYear}&FileType=${fileType}`);
  }


}
