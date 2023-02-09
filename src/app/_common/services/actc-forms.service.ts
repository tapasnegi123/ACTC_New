import { FormArray } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../core-services/http.service';

@Injectable({
  providedIn: 'any'
})
export class ActcFormsService {
  
  DisableWhenFormIsInvalid(NewFirstStepFormArray: FormArray<any>) {
    throw new Error("Method not implemented.");
  }

constructor(private _api:HttpService) { }

/**
 *  Part A API 
 */
GetFormListForPartA(id:number, Fin_Yr:number, SportId:number){
  return this._api.getACTC('Common/FormList?id='+id+'&Fin_Yr='+Fin_Yr+'&SportId='+SportId)
}

GetPartASectionOneData(year:number,sportId:number){
  return this._api.getACTC("PartA/GetPartASection1?year=" + year + '&sportId=' + sportId)
}

SavePartASectionOneData(year:number,sportId:number,formData:any, sporthistorydata:any){
  return this._api.postACTC("PartA/SavePartASection1?year=" + year + '&sportId=' + sportId,{
    sporthistorydata,
    CompetionListList: [
      ...formData
    ]
  })
}

GetPartASectionThreeData(year:number,sportId:number){
return this._api.getACTC("PartA/GetPartASection2?year=" + year + "&sportId=" + sportId)
}

GetComptetionDDByFilter(sportsId:number,year:number,category:string, level?:string){
  return this._api.getACTC("Common/GetComptetionByFilter?sport=" + sportsId + "&year=" + year + "&category=" + category + "&level=" + level)
}

GetComptetionDetails(competetionId:number){
  return this._api.getACTC("Common/GetComptetionDetails?Id=" + competetionId)
}

//Tournament_Id is competetionId. That's why competetionId is used
GetEventDD(sportId:number,competetionId:number){
  return this._api.getACTC("Common/GetEventDD?sport=" + sportId + "&Tournament_Id=" + competetionId)
}

SavePartASectionThreeData(userId:number,sportId:number,year:number, GoalsAndMilestonesList:any ,Target_StrategyList:any, CompetetionPerformanceList:any){

  return this._api.postACTC("PartA/SavePartASection2?user_id=" + userId + "&sport=" + sportId + "&year=" + year,{
    GoalsAndMilestonesList: [
      ...GoalsAndMilestonesList
    ],
    Target_StrategyList: [
     ...Target_StrategyList
    ],
    CompetetionPerformanceList: [
      ...CompetetionPerformanceList
    ]
  })
}

GetPartAIntroductionData(sportId:number,year:number):any{
  return this._api.getACTC("PartA/GetPartASectionOfficials?sportId=" + sportId + "&Year=" + year)
}

SavePartAIntroductionData(userId:number,formData:any){  
  return this._api.postACTC("PartA/SavePartASectionOfficials?user_id=" + userId,{
    OfficialDetailsList:[
      ...formData
    ]
  })
}

GetUserDetail(userId:any,roleId:any):Observable<any>{
  return this._api.getACTC('Common/GetUserDetails?id='+ userId + '&role='+ roleId)
}

  //#region Part A Summary
  
  //#endregion

  //#region Part A Section 7
  GetCurrencyList() {
    return this._api.getACTC('Common/GetCurrencytDD')
  }
  GetEquipmentList(sportId: any) {
    return this._api.getACTC('Common/GetEquipmentDD?sport=' + sportId)
  }
  GetSectionSevenData(sportId: any, year: any, category:string) {
    return this._api.getACTC('PartA/GetPartASection7?year=' + year + '&sportId=' + sportId +'&Category='+category)
  }

  SavePartASection7(user_id:number,year:number,sportId:any,category:string ,formData:any){
    console.log(formData)
    return this._api.postACTC('PartA/SavePartASection7?user_id=' + user_id + '&year=' + year + '&sportId=' + sportId + '&Category='+ category,[...formData])
  }
  //#endregion

  GetPartC(year:number,sportId:number):Observable<ISummaryType>{
    return this._api.getACTC("PartA/GetPartC?year=" + 2022 + "&sportId=" + sportId)
  }

  


GetStateDD():Observable<any>{
  return this._api.getACTC("Common/GetStateDD")
}

}

export interface ISummaryType{
  Seniorsummary:IPartC,
  juniorsummary:IPartC
}

export interface IPartC {
  National_coaching_Camps: number
  IE_Comp: number
  IE_Training: number
  IE_Other: number
  ICI: number
  National_Championships: number
  F_coach: number
  F_SupportStaff: number
  N_coach: number
  N_SupportStaff: number
  Equipment_c: number
  Equipment_NC: number
  Total: number
}
