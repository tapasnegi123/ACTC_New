import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../core-services/http.service';
@Injectable({
  providedIn: 'any',
})
export class PartEService {
  
  constructor(private _api: HttpService) {}

  getPartEData(year:number, sportId:number,planFor:string):Observable<IGetPartESectionOneAndTwo>{
    return this._api.getACTC('PartE/GetPartE?year='+year+'&sportId='+sportId+'&planfor='+planFor)
  }

  SavePartE(user_id:number,year:number,planfor:string,developmentList:any,
    initiativePlannedList:any,upskillExposureList:any,):Observable<any>{
    return this._api.postACTC('PartE/SavePartE?user_id='+user_id+'&year='+year+'&sportId='+10+'&planfor='+planfor,{
      Development_Status_list:[...developmentList],
      Initiatives_Planned_list:[...initiativePlannedList],
      Upskilling_Exposurel_list:[...upskillExposureList]
    })
  }
}

/**
 * Interface for Part E-1
 */
export interface IGetPartESectionOneAndTwo {
  Upskilling_Exposurel_list: IUpskillingExposurelList[]
  Initiatives_Planned_list: IInitiativesPlannedList[]
  Development_Status_list: IDevelopmentStatusList[]
}

export interface IUpskillingExposurelList {
  ID: number
  year: number
  sportId: number
  WorldLevel: number
  Asian: number
  Invitational: number
  National: number
  University: number
  State: number
  District: number
  PlanFor: string
  Fin_Yr:number
}

export interface IInitiativesPlannedList {
  ID: number
  year: number
  sportId: number
  LEVEL_7: number
  LEVEL_6: number
  LEVEL_5: number
  LEVEL_4: number
  LEVEL_3: number
  LEVEL_2: number
  LEVEL_1: number
  ByForeignCoaches: number
  CoursesbyNSF: number
  LEVEL_A: number
  LEVEL_B: number
  LEVEL_C: number
  LEVEL_D: number
  LEVEL_E: number
  PlanFor: string
  Fin_Yr:number
}

export interface IDevelopmentStatusList {
  ID: number
  year: number
  sportId: number
  DevelopmentLevel: string
  Detail: number
  Level: string
  PlanFor: string
  Fin_Yr : number
}
