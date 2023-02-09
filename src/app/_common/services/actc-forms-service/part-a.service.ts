import { NumberSymbol } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../core-services/http.service';

@Injectable({
  providedIn: 'any'
})
export class ACTCFormsPartAService {

constructor(private _api:HttpService) { }



GetPartAIntroductionData(sportId:number){
  return this._api.getACTC("PartA/GetPartASectionOfficials?sportId=" + sportId)
}

SavePartAIntroductionData(userId:string,formData:any){
  return this._api.postACTC("PartA/SavePartASectionOfficials?user_id=" + userId,{
    OfficialDetailsList:[
      ...formData
    ]
  })
}

/**
 *  Part A API 
 */
 GetFormListForPartA(id:number, Fin_Yr:number, SportId:number){
  return this._api.getACTC('Common/FormList?id='+id+'&Fin_Yr='+Fin_Yr+'&SportId='+SportId)
}

/**
 * 
 * @param year 
 * @param sportId 
 * @returns 
 */
GetPartASectionOneData(year:number,sportId:number):Observable<IPartASection_1>{
  return this._api.getACTC("PartA/GetPartASection1?year=" + year + '&sportId=' + sportId)
}

SavePartASectionOneData(year:number,sportId:number,sporthistorydata:any,CompetionListList:any){
  return this._api.postACTC("PartA/SavePartASection1?year=" + year + '&user_id=' + sportId,{
    sporthistorydata,
    CompetionListList: CompetionListList
    // CompetionListList: [
    //   ...CompetionListList
    // ]
  })
}

GetPartASectionThreeData(year:number,sportId:number):Observable<IGetPartASectionTwo>{
  return this._api.getACTC("PartA/GetPartASection2?year=" + year + "&sportId=" + sportId)
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
    ]
  })
}

GetPartASection4(year:number, sportId:number, category:string):Observable<IGetPartASection4[]>{
  return this._api.getACTC("PartA/GetPartASection4?year=" + year + "&sportId=" + sportId + "&Category=" + category)
};

SavePartASection4(user_id:number, year:number, sport_id:number, Competitions_organized:any){
  console.log(Competitions_organized)
  return this._api.postACTC("PartA/SavePartASection4?user_id="+user_id+"&year="+year+"&sportId="+sport_id,[
    ...Competitions_organized
  ])
}

GetPartASectionFiveData(year:number,sportId:number):Observable<IGetPartASectionFiveData>{
  return this._api.getACTC("PartA/GetPartASection5?year=" + year + "&sportId=" + sportId)
}

SavePartASection5(user_id:number,sport:number,year:number , Selection_And_Preparation_Camp:any,International_Exposure:any,International_Competions_In_India:any,National_Championship:any){
  return this._api.postACTC('PartA/SavePartASection5?user_id='+user_id+'&sport='+sport+'&year='+year,{
    Selection_And_Preparation_Camp,
    International_Exposure,
    International_Competions_In_India,
    National_Championship
  })
}

GetPartASectionSixData(year:number, sportId:number):Observable<IGetPartASectionSix>{
  return this._api.getACTC("PartA/GetPartASection6?year=" + year + "&sportId=" + sportId)
}

SavePartASection6(user_id:number,sportId:number,year:number,category:string,coachArr:any,adminArr:any):Observable<any>{
  return this._api.postACTC("PartA/SavePartASection6?user_id=" + user_id + "&sport=" + sportId + "&year=" + year + "&category=" + category,{
    coachandsupportstafflist:[
      ...coachArr
    ],
    RequirementAdministrativeList: [
      ...adminArr
    ]
  })
}

GetSectionSevenData(sportId: any, year: any) {
  return this._api.getACTC('PartA/GetPartASection7?year=' + year + '&sportId=' + sportId)
}


GetUserDetail(userId:any,roleId:any){
  return this._api.getACTC('Common/GetUserDetails?id='+ userId + '&role='+ roleId)
}

}


export interface IPartASection_1 {
  sporthistorydata: Sporthistorydata
  CompetionListList: CompetionListList[]
  DDCompetion: DDCompetion[]
}

export interface Sporthistorydata {
  isOG: boolean
  OGYear: number
  isAG: boolean
  AGYear: number
}

export interface CompetionListList {
  Id: number
  CompetitionId: number
  Competition: string
  sport_id: number
  sport_name: string
  Event: number
  Medal: number
  Remarks: string
}

export interface DDCompetion {
  CompetitionId: number
  Competition: string
}

export interface IGetPartASectionTwo {
  GoalsAndMilestonesList: IGoalsAndMilestonesList[]
  Target_StrategyList: ITargetStrategyList[]
  CompetetionPerformanceList: ICompetetionPerformanceList[]
  CompetionDD: DDCompetion[]
}

export interface IGoalsAndMilestonesList {
  Id: number
  CompetetionId: number
  tournament_name: string
  Category: string
  year: number
  SportId: number
  partcipation: number
  top16: number
  top8: number
  Medals: number
  Medals_At_Stake:number
}

export interface ITargetStrategyList {
  ID: number
  TS_Id: number
  TS_Name: string
  year: number
  SportId: number
  Remark: string
}

export interface ICompetetionPerformanceList {
  ID: number
  Tournament_Id: number
  tournament_name: string
  Category: string
  Level: string
  Place: string
  Country: string
  State: string
  City: string
  year: number
  SportId: number
  configuration: string
  GenderComposition: string
  Name: string
  Medal_Won: number
  Final_Rank: number
  World_Rank: number
  AsOn_Date: string
  Remarks: string
}


export interface IGetPartASectionSix {
  coachandsupportstafflist: Coachandsupportstafflist[]
  RequirementAdministrativeList: RequirementAdministrativeList[]
}

export interface Coachandsupportstafflist {
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
  Total_Expenditure:number
}

export interface RequirementAdministrativeList {
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



/**
 * @interface GetPartASectionFiveData 
 */

 export interface IGetPartASectionFiveData {
   Selection_And_Preparation_Camp: ISelectionAndPreparationCamp[]
  International_Exposure: IInternationalExposure[]
  International_Competions_In_India: IInternationalCompetionsInIndum[]
  National_Championship: INationalChampionship[]
}

export interface IInternationalExposure {
  Id: number
  Category: string
  TeamComposition: string
  AgeCategory: number
  Tournament_Id: number
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
}

export interface ISelectionAndPreparationCamp {
  Id: number
  PurposeOfCoachingCamp: string//
  Tournament_Id: number//
  TeamComposition: string//
  AgeCategory: number//
  year: number
  SportId: number
  NoOfPlayer: number//
  NoOfCoaches: number//
  NoOfSupportStaff: number//
  NameOfCenter: string//
  State: string//
  City: string//
  Dates_From: string//
  Dates_To: string//
  TotalNoOfParticipants: number//
  EstimatedExpenditure: number//
  Category: string
  
}

export interface IInternationalCompetionsInIndum {
  Id: number//
  NameOfCompetition: number//
  AgeCategory: number
  year: number
  SportId: number
  NoOfCountries: number
  NoOfAthletes: number
  NoOfPlayers: number
  NoOfCoaches: number
  NoOfSupportStaff: number
  NameOfCenter: string
  Dates_From: string
  Dates_To: string
  TotalDays: number
  IndianTeamTotal: number
  ProposedLastDateOfSubmission: number
  EstimatedExpenditure: number
  Remarks: string
  Category: string
  City:string
  State:string
  City_Id: number
  State_Id: number
  Tournament_Id:number
  // TotalNoOfParticipants: number not getting from back
}

export interface INationalChampionship {
  Id: number//
  AgeCategory: number//
  year: number
  SportId: number//
  NameOfStatesAndUTs: string//
  NameOfCenter: string//
  State: string//
  City: string//
  City_Id:number
  Dates_From: string//
  Dates_To: string//
  EsimatedExpenditure: number//
  Remarks: string//
  Category: string//
  State_Id:number
}


export interface IGetPartASection4 {
  ID: number
  TournamentId: number
  TournamentName: string
  Category: string
  Level: string
  year: number
  SportId: number
  State_participate: number
  Athlete_participate: number
  Best5: string
  Remarks: string
  Age_Category: string
  Center_Name: string
  State: number
  City: number
  From_Date: string
  To_Date: string
}
