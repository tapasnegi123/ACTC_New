import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../core-services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ReleaseMomServiceService {
constructor(private _api: HttpService){}

getReleaseMom(sportId:number , mode:string){ 
  return this._api.getACTC(`SDO/ACTC_Get_MOM_Data?Federation_Id=${sportId}&FinancialYear=${mode}`)
}


saveAsDraft(userId:any,federationId:number,financialYear:string,sportId:any,roleId:any ,obj:any):Observable<any>{
  return this._api.postACTC(`SDO/MOM_Draft?user_id=${userId}&Fedration_Id=${federationId}&FinancialYear=${financialYear}&SportId=${sportId}&Role_Id=${roleId}`,obj);
}

viewPdf(federation_Id:number , financialYear:string){
  return this._api.getACTC(`SDO/View_Mom?FedrationId=${federation_Id}&FinYr=${financialYear}&FileType=Draft`)
}
}