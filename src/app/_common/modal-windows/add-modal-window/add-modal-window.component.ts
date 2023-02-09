import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, Subject, takeLast, takeUntil } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { ModalwindowService } from '../../services/modalwindow.service';
import Swal from 'sweetalert2';
import { IUserCredentials, StorageService } from '../../services/storage.service';
@Component({
  selector: 'app-add-modal-window',
  templateUrl: './add-modal-window.component.html',
  styleUrls: ['./add-modal-window.component.scss']
})
export class AddModalWindowComponent {
  userData: Array<any> = [];
  fedrationId: any;
  federationName: any;
  fedration: any = {};
  financialYear: string = '';
  enable: boolean = false;
  userDetail?:IUserCredentials<any>
  sportsId:any;
  userData$:Observable<any> = new Observable();
  unsubscribe: Subject<any> = new Subject
  constructor(public activeModal: NgbActiveModal, private _modalWindowService: ModalwindowService, private _alert: AlertService,private _localStorage:StorageService) {
    this.GetFederationList();
    this.userDetail = this._localStorage.GetUserAllCredentials();
  }


  GetFederationList() {
    this.userData$ = this._modalWindowService.GetApprovedACTCList().pipe(
      map((response:any) =>{
        this.userData = response;
        return response.filter((res:any) => res.sportsID === this.userDetail?.sportId)
      })
    )
  }


  changeFedrationName(event: any) {
    this.fedrationId = event.target.value;
    if (this.fedrationId != '')
      this.getCurrentFinancialYear()
    for (let fed = 0; fed <= this.userData.length; fed++) {
      if (this.fedrationId == this.userData[fed].fdrid) {
        this.fedration = this.userData[fed];
        this.federationName = this.userData[fed].federationName;
      }
    }
  }

  getCurrentFinancialYear() {
    var today = new Date();
    var curMonth = today.getMonth();
    var fiscalYr = "";
    if (curMonth > 3) { //
      var nextYr1 = (today.getFullYear() + 1).toString();
      fiscalYr = today.getFullYear().toString() + "-" + nextYr1;
    } else {
      var nextYr2 = today.getFullYear().toString();
      fiscalYr = (today.getFullYear() - 1).toString() + "-" + nextYr2;
    }
    this.financialYear = fiscalYr;
  }

  enableDisable(value: any) {
    this.ConfirmationDialog(value);
  }

  enableDisableApiCall(value: any) {
    if (this.fedrationId != undefined && value != null) {
      this.enable = value;
      this._modalWindowService.saveFedration(this.fedration.fdrid, this.financialYear.substring(0, 4), this.fedration.sportsID, this.enable).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => { console.log(res) })
      this._alert.ShowSuccess(`Annual Form ${this.enable ? 'Enabled' : 'Disabled'} Successfully`);
      this.activeModal.close();
    }
  }


  ConfirmationDialog(value: boolean) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to ${value ? 'enable' : 'disable'} Annual ACTC form for ${this.federationName} for the ${this.financialYear.substring(0, 4)}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          `Annual Form ${value ? 'Enabled' : 'Disabled'} Successfully`
        )
        this.enableDisableApiCall(this.enable);
      }
      if (result.dismiss) {
        this.enable = !this.enable;
      }
    })
  }
}
