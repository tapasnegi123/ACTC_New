import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpService } from "../../core-services/http.service";

@Injectable({
    providedIn:'any'
})

export class ACTCFormsPartDService{

    constructor(private _api:HttpService){

    }

    //#region PartDSectionOne api's

    /**
     * @param year 
     * @param sportId 
     * @returns array of type @interface IPartDSectionOne
     */
    GetPartDSection1(year:number,sportId:number):Observable<any>{
        return this._api.getACTC("PartD/GetPartDSection1?year=" + year + "&sportId=" + sportId)
    }

    SavePartDSectionOne(user_id:number,year:number,sportId:number,formData?:any):Observable<any>{
        return this._api.postACTC("PartD/SavePartDSection1?user_id=" + user_id + "&year=" + year + "&sport=" + sportId,[...formData])
    }

    //#endregion PartDSectionOne api's

    //#region PartDSectionTwo api's

    GetPartDSection2(year:number,sportId:number):Observable<IPartDSectionTwo>{
        return this._api.getACTC("PartD/GetPartDSection2?year=" + year + "&sportId=" + sportId)
    }

    SavePartDSection2(userId:number,sportId:number,year:number,category:string,coachArr:any,adminArr:any):Observable<any>{
        return this._api.postACTC("PartD/SavePartDSection2?user_id=" + userId + "&sport=" + sportId + "&year=" + year + "&category=" + category,{
            coachandsupportstafflist:[
                ...coachArr
            ],
            RequirementAdministrativeList:[
                ...adminArr
            ]
        })
    }

    //#endregion PartDSectionTwo api's

    /**
     * @param year 
     * @param sportId 
     * @returns array of type @interface IPartDSectionThree
     */
    GetPartDSection3(year:number,sportId:number, category:string){
        return this._api.getACTC("PartD/GetPartDSection3?year=" + year + "&sportId=" + sportId + '&Category='+ category)
    }

    SavePartDSection3(user_id:number,year:number,sportId:number, category:string,formData?:any){
        return this._api.postACTC("PartD/SavePartDSection3?user_id=" + user_id +"&year=" + year +"&sportId=" + sportId + '&Category='+ category,[
            ...formData
        ])
    }    
}



export interface IPartDSectionTwo {
    coachandsupportstafflist: ICoachandsupportstafflist[]
    RequirementAdministrativeList: IRequirementAdministrativeList[]
  }
  
  export interface ICoachandsupportstafflist {
    ID: number
    Designation_Id: number
    Designation: string
    Stafftype: string
    tournament_Id: number
    tournament_name: string
    TenureType: string
    team_composition:string
    TenureTime: number
    Salary: number
    CurrencyType: number
    CurrencyRate: number
    Remarks: string
    Category: string
    Level: string
    venue: string
    Total_Expenditure:number
  }
  
  export interface IRequirementAdministrativeList {
    ID: number
    Designation: string
    TenureType: string
    Date_of_Joining: string
    Contract_Expiry_Date: string
    Total_Days: number
    Salary: number
    Remarks: string
    Category: string
    Total_Expenditure:number
  }