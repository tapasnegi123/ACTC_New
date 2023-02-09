import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../core-services/http.service';

@Injectable({
  providedIn: 'any',
})
export class ModalwindowService {

  constructor(private _api: HttpService,public http: HttpClient) {}

  GetApprovedACTCList(){
    // return this.http.get(`${environment2.apiEndPoint}Common/Get`)
    return this._api.getACTC(`Common/Get`)
  }

  saveFedration(Federation_Id:number, financialYear:string, sportId:number, enable:boolean){
    return this._api.postACTC('DO/Save_Enable_ACTC_Submission_for_NSF?Federation_Id='+Federation_Id+'&FinancialYear='+financialYear+'&sport_detail_id='+sportId+'&is_active='+enable,{})
  }
}