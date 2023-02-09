import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../core-services/http.service';

@Injectable({
  providedIn: 'root'
})
export class DoActcService {

  constructor(private _api: HttpService) { }

  GetKRA_Milestones(year:number,sportId:number,category:number):Observable<any>{
    return this._api.getACTC("KRA_Milestones/GetKRA_Milestones_Senior?year=" + year+"&sportId=" + sportId+"&category=" + category);
  }

  GetNSFProposedSummary(year:number,sportId:number):Observable<INSFProposedSummary[]>{
    return this._api.getACTC("DO_SDO/Get_NSFProposedSummary?year=" + year + "&sportId=" + sportId)
  }

  GetFundingPattern(year:number,sportId:number):Observable<IFundingPattern[]>{
    return this._api.getACTC("DO_SDO/Get_FundingPattern?year=" + year + "&sportId=" + sportId)
  }

  SaveFundingPattern(user_id:number,year:number,sportId:number,formData:any){
    return this._api.postACTC("DO_SDO/Save_FundingPattern?user_id=" + user_id + "&year=" + year + "&sportId=" + sportId,[
      ...formData
    ])
  }

  GetPresentPerformance(year:number,sportId:number):Observable<IPresentPerformance[]>{
    return this._api.getACTC("DO_SDO/Get_PresentPerformance?year=" + year + "&sportId=" + sportId)
  }

  SavePresentPerformance(user_id:number,year:number,sportId:number,body:any){
    return this._api.postACTC("DO_SDO/Save_PresentPerformance?user_id=" + user_id + "&year=" + year + "&sportId=" + sportId,[
      ...body
    ])
  }

  Get_NationalCoachingCamp(year:number,sportId:number,role_id:number,category:string):Observable<INationalCoachingCamp[]>{
    return this._api.getACTC("DO_SDO/Get_NationalCoachingCamp?year=" + year + "&sportId=" + sportId + "&role_id=" + role_id + "&category=" + category)
  }

  SaveNationalCoachingCamp(user_id:number,sportID:number,year:number,role_id:number,category:string,formData:Array<unknown>){
    return this._api.postACTC("DO_SDO/Save_NationalCoachingCamp?user_id=" + 
    user_id + "&sport=" + sportID + "&year=" + year + "&role_id=" + role_id + "&category=" + category,[
      ...formData
    ])
  }
 
  Get_InternationalExposure(year:number,sportId:number,role_id:number,category:string):Observable<IInternationalExposure[]>{
    return this._api.getACTC("DO_SDO/Get_InternationalExposure?year=" + year + "&sportId=" + sportId + "&role_id=" + role_id + "&category=" + category)
  }

  SaveInternationalExposure(user_id:number,sportId:number,year:number, roleId:number,category:string,formData:Array<unknown>){
    return this._api.postACTC("DO_SDO/Save_InternationalExposure?user_id=" + user_id + "&sport=" + sportId + "&year=" + year + "&role_id=" + roleId + "&category=" + category,[
      ...formData
    ])
  }

  Get_NationalChampionship(year:number,sportId:number,role_id:number,category:string):Observable<INationalChampionship[]>{
    return this._api.getACTC("DO_SDO/Get_NationalChampionship?year=" + year + "&sportId=" + sportId + "&role_id=" + role_id + "&category=" + category)
  }

  SaveNationalChampionship(user_id:number,sportId:number,year:number, roleId:number,category:string,formData:Array<unknown>){
    return this._api.postACTC("DO_SDO/Save_NationalChampionship?user_id=" + user_id + "&sport=" + sportId + "&year=" + year + "&role_id=" + roleId + "&category=" + category,[
      ...formData
    ])
  }

  Get_International_Compt_India(year:number,sportId:number,role_id:number,category:string):Observable<IGetInternationalComptIndia[]>{
    return this._api.getACTC("DO_SDO/Get_International_Compt_India?year=" + year + "&sportId=" + sportId + "&role_id=" + role_id + "&category=" + category)
  }

  SaveInternationalComptetionIndia(user_id:number,sportId:number,year:number, roleId:number,category:string,formData:Array<unknown>){
    return this._api.postACTC("DO_SDO/Save_International_Comptetion_India?user_id=" + user_id + "&sport=" + sportId + "&year=" + year + "&role_id=" + roleId + "&category=" + category,[
      ...formData
    ])
  }

  Get_Remuneration_Coach_SuppportStaff(year:number,sportId:number,role_id:number):Observable<any>{
    return this._api.getACTC("DO_SDO/Get_Remuneration_Coach_SuppportStaff?year=" + year + "&sportId=" + sportId + "&role_id=" + role_id)
  }

  Save_Remuneration_Coach_SuppportStaff(user_id:number,sportId:number,year:number, roleId:number,category:string,coachandsupportstafflist:any,RequirementAdministrativeList:any){
    return this._api.postACTC("DO_SDO/Save_Remuneration_Coach_SuppportStaff?user_id=" + user_id + "&sport=" + sportId + "&year=" + year + "&role_id=" + roleId + "&category=" + category,{
      coachandsupportstafflist:[
        ...coachandsupportstafflist
      ],
      RequirementAdministrativeList:[
        ...RequirementAdministrativeList
      ]
    })
  }

  Get_Equipment(year:number,sportId:number,role_id:number,Category:string):Observable<IGetEquipment[]>{
    return this._api.getACTC("DO_SDO/Get_Equipment?year=" + year + "&sportId=" + sportId + "&role_id=" + role_id + "&Category=" + Category)
  }

  Save_Equipment(user_id:number,sportId:number,year:number, roleId:number,category:string,formData:Array<unknown>){
    return this._api.postACTC("DO_SDO/Save_Equipment?user_id=" + user_id + "&sport=" + sportId + "&year=" + year + "&role_id=" + roleId + "&category=" + category,[
      ...formData
    ])
  }

  Get_Status_of_NCOE(year:number,sportId:number,role_id:number){
    return this._api.getACTC("DO_SDO/Get_Status_of_NCOE?year=" + year + "&sportId=" + sportId + "&role_id=" + role_id)
  }

  Get_NSFProposedSummary(sportId: any, year: any) {
    return this._api.getACTC('DO_SDO/Get_NSFProposedSummary?year=' + year + '&sportId='+ sportId)     
  }

  Get_CoachAndSupportStaff(year:any,sportId:any,role_id:any,category:string){
    return this._api.getACTC("DO_SDO/Get_CoachAndSupportStaff?year="+year+"&sportId=" + sportId + "&role_id=" + role_id + "&Category=" + category)
  }

  // forword from
  ForwardForm(user_id:number,year:number,sportId:number,From_role_Id:number,To_role_Id:any,Comment:string){
    return this._api.postACTC("FormSubmit/ForwardForm?user_id="+user_id+"&year="+year+"&sportId="+sportId+"&From_role_Id="+From_role_Id+"&To_role_Id="+To_role_Id+"&Comment="+Comment,{})
  }

  // submit Form
  SubmitForm(user_id:number,year:number,sportId:number,role_id:number,Comment:string){
    return this._api.postACTC("FormSubmit/SubmitForm?user_id="+user_id+"&year=+"+year+"&sportId="+sportId+"&role_id="+role_id+"&Comment="+Comment,{})
  } 

  // reject by SDO
  RejectFormBySDO(user_id:number,year:number,sportId:number,role_id:number,Comment:string){
    return this._api.postACTC("FormSubmit/RejectForm?user_id="+user_id+"&year="+year+"&sportId="+sportId+"&role_id="+role_id+"&Comment="+Comment,{})
  }
  
  Get_Development_Plan(year:number,sportId:number,planFor:string){
    return this._api.getACTC("DO_SDO/Get_Development_Plan?fin_year="+year+"&sportId="+sportId+"&planFor="+planFor)
  }
}


export interface IGetKRA_Milestones {
  event_name: string
  Partcipation: number
  Top16: number
  Top8: number
  Medals: number
  medals_stake: number
}

export interface INSFProposedSummary {
  DO_senior: any;
  DO_junior: any;
  item: string
  category: string
  senior: number
  junior: number
  total: number
}

export interface IFundingPattern {
  Id: number
  Financialyear: string
  FundAlloted: number
  ActualSpend: number
}

export interface IPresentPerformance {
  ID: number
  tournament_Id: number
  tournament_name: string
  previous_participation: number
  previous_medal_won: number
  participation: number
  medal_won: number
}

export interface INationalCoachingCamp {
  Id: number
  PurposeOfCoachingCamp: string
  Tournament_Id: number
  Tournament_Name: string
  TeamComposition: string
  AgeCategory: number
  AgeCategory_Name: string
  year: number
  SportId: number
  NoOfPlayer: number
  NoOfCoaches: number
  NoOfSupportStaff: number
  NameOfCenter: string
  State: string
  City: string
  Dates_From: string
  Dates_To: string
  TotalNoOfParticipants: number
  EstimatedExpenditure: number
  Category: string
  Sai_Comments: string
  Final_Decision: string
  Action: string
}

export interface IInternationalExposure {
  Id: number
  Category: string
  TeamComposition: string
  AgeCategory: number
  AgeCategory_Name: string
  Tournament_Id: number
  Tournament_Name: string
  NoOfCountries: number
  NoOfPlayersExpected: number
  NameOfTopRankedCountries: string
  year: number
  SportId: number
  NoOfPlayers: number
  NoOfCoaches: number
  NoOfSupportStaff: number
  NameOfCenter: string
  Country: string
  City: string
  Dates_From: string
  Dates_To: string
  TotalParticipants: number
  EstimatedExpenditure: number
  Remarks: string
  Sai_Comments: string
  Final_Decision: string
  Action: string
  Purpose:string
}

export interface INationalChampionship {
  AgeCategory: number
  AgeCategory_Name: string
  Sai_Comments: string
  Final_Decision: string
  Action: string
  Id: number
  year: number
  SportId: number
  NameOfStatesAndUTs: string
  NameOfCenter: string
  State: string
  City: string
  City_Id: number
  State_Id: number
  Dates_From: string
  Dates_To: string
  EsimatedExpenditure: number
  Remarks: string
  Category: string
}

export interface IGetInternationalComptIndia {
  AgeCategory_Name: string
  Tournament_Id:number
  Tournament_Name: string
  Sai_Comments: string
  Final_Decision: string
  Action: string
  Id: number
  NameOfCompetition: number
  AgeCategory: number
  year: number
  SportId: number
  NoOfCountries: number
  NoOfAthletes: number
  NoOfPlayers: number
  NoOfCoaches: number
  NoOfSupportStaff: number
  NameOfCenter: string
  State: string
  City: string
  Dates_From: string
  Dates_To: string
  TotalDays: number
  IndianTeamTotal: number
  ProposedLastDateOfSubmission: number
  EstimatedExpenditure: number
  Remarks: string
  Category: string
  City_Id: number
  State_Id: number
}

// export interface IGetRemunerationCoachSuppportStaff{

// }

export interface IGetEquipment {
  Id: number
  Equipment_Id: number
  Equipment_Name: string
  is_consumeable: boolean
  SportId: number
  Year: number
  Quantity: number
  Price: number
  Currency_Id: number
  Currency_Name: string
  Conversion_Rate: number
  Expected_Price: number
  Remarks: string
  Category: string
  SAI_Comments: string
  Final_Decision: string
  Action: string
}


export interface IRemuneration {
  coachandsupportstafflist: Coachandsupportstafflist[]
  RequirementAdministrativeList: RequirementAdministrativeList[]
}

export interface Coachandsupportstafflist {
  Currency_Name:string
  Sai_Comments: any
  Final_Decision: any
  Action: any
  ID: number
  Designation_Id: number
  Designation: string
  Stafftype: string
  team_composition: string
  tournament_Id: number
  tournament_name: string
  TenureType: string
  TenureTime: number
  Salary: number
  CurrencyType: number
  CurrencyRate: number
  Remarks: string
  Category: string
  Level: string
  venue: string
}

export interface RequirementAdministrativeList {
  Sai_Comments: any
  Final_Decision: any
  Action: any
  ID: number
  Designation: string
  TenureType: string
  Date_of_Joining: string
  Contract_Expiry_Date: string
  Total_Days: number
  Salary: number
  Remarks: string
  Category: string
}
