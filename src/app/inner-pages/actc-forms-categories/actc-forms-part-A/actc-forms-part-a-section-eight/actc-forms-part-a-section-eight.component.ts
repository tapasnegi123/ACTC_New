import { Component, OnInit } from '@angular/core';
import { ActcFormsService } from '../../../../_common/services/actc-forms.service';


@Component({
  selector: 'app-actc-forms-part-a-section-eight',
  templateUrl: './actc-forms-part-a-section-eight.component.html',
  styleUrls: ['./actc-forms-part-a-section-eight.component.scss']
})
export class ActcFormsPartASectionEightComponent implements OnInit {

  constructor(private _actc: ActcFormsService) { }

  userDetail: any;
  userData: any;
  presentYear: any;

  // GetUserDetail() {
  //   this.userDetail = this._localStorage.GetUserDetailAfterLogin();
  //   this.userData = this._localStorage.getUserData()
  // }

  ngOnInit(): void {
    // this.GetUserDetail();
    // this.getPartABudget();
  }

  // dataToBeShown: any
  // getPartABudget() {
  //   this.presentYear = new Date().getFullYear()
  //   this._actc
  //     .GetPartABudget(
  //       this.userDetail.sportId,
  //       this.presentYear
  //     )
  //     .subscribe({
  //       next: (response: any) => {
  //         console.log(response);
  //         this.dataToBeShown = response
  //       },
  //       error: (error) => {
  //         this._alert.ShowWarning(error.statusText);
  //       },
  //     });
  // }


}
