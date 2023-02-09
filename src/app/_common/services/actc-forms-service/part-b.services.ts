import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpService } from '../../core-services/http.service';

@Injectable({
  providedIn: 'any'
})
export class PartBService {

  constructor(private api: HttpService) { }

  GetPartBSectionOneData(year: number, sportId: number) {
    return this.api.getACTC("partB/GetPartBSection1?year=" + year + "&sportId=" + sportId)
  }
  getcommondata(year: number, sportId: number) {
    return this.api.getACTC("Common/GetComptetionDDByFilter?sport=" + sportId + "&year=" + year)
  }
  SavePartBectionOne(user_id: number, year: number, sportId: number, sporthistorydata:any,CompetionListList:any) {
    return this.api.postACTC("PartB/SavePartBSection1?user_id=" + user_id + "&year=" + year + "&sportId=" + sportId, {
      sporthistorydata,
      CompetionListList: CompetionListList
      // sporthistorydata: { ...formData.sporthistorydata[0] },
      // CompetionListList: [
      //   ...formData.CompetionListList
      // ]
    })
  }


  GetPartBSectionTwoData(year: number, sportId: number) {
    return this.api.getACTC("partB/GetPartBSection2?year=" + year + "&sportId=" + sportId)
  }

  SavePartBSectionTwo(user_id: number, year: number, sportId: number, formData: any) {
    return this.api.postACTC('PartB/SavePartBSection2?user_id=' + user_id + "&year=" + year + "&sportId=" + sportId,
      { CompetetionPerformanceList: formData }
    )
  }

  GetPartBSectionThreeData(year: number, sportId: number, category:string):Observable<IGetPartBSectionThreeData[]> {
    return this.api.getACTC("partB/GetPartBSection3?year=" + year + "&sportId=" + sportId + '&Category=' + category)
  }

  SavePartBSectionThree(user_id: number, year: number, sportId: number, formData: any,) {
    // JSON.parse(formData[0].State_Id) as number
    return this.api.postACTC('PartB/SavePartBSection3?user_id=' + user_id + "&year=" + year + "&sportId=" + sportId, [
      ...formData
    ])
  }

  GetPartBSectionFourData(year: number, sportId: number): Observable<IGetPartBSectionFourData> {
    return this.api.getACTC("PartB/GetPartBSection4?year=" + year + "&sportId=" + sportId)
  }
  SavePartBSectionFour(user_id: number, year: number, sportId: number, formData: any,) {
    console.log(formData);
    return this.api.postACTC('PartB/SavePartBSection4?user_id=' + user_id + "&year=" + year + "&sport=" + sportId,
      formData )
  }
}

export interface IGetPartBSectionFourData {
  International_Exposure: IInternationalExposure[]
  Selection_And_Preparation_Camp: ISelectionAndPreparationCamp[]
  International_Competions_In_India: IInternationalCompetionsInIndia[]
  National_Championship: INationalChampionship[]
}

export interface IInternationalExposure {
  Id: number
  Category: string
  TeamComposition: string
  AgeCategory: number
  Tournament_Id: number
  NoOfCountries: number
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
  NoOfPlayersExpected: number
  Purpose:string
}

export interface ISelectionAndPreparationCamp {
  Id: number
  PurposeOfCoachingCamp: string
  Tournament_Id: number
  TeamComposition: string
  AgeCategory: number
  year: number
  SportId: number
  NoOfPlayer: number
  NoOfCoaches: number
  NoOfSupportStaff: number
  NameOfCenter: string
  State: string
  State_Id: number
  City: string
  Dates_From: string
  Dates_To: string
  TotalNoOfParticipants: number
  EstimatedExpenditure: number
  Category: string
}

export interface IInternationalCompetionsInIndia {
  Id: number
  Tournament_Id: number
  AgeCategory: number
  year: number
  SportId: number
  NoOfCountries: number
  NoOfAthletes: number
  NoOfPlayers: number
  NoOfCoaches: number
  NoOfSupportStaff: number
  NameOfCenter: string
  // NameOfCompetition:string
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
}

export interface INationalChampionship {
  Id: number
  AgeCategory: number
  year: number
  SportId: number
  NameOfStatesAndUTs: string
  NameOfCenter: string
  State: string
  City: string
  Dates_From: string
  Dates_To: string
  EsimatedExpenditure: number
  Remarks: string
  Category: string,
  City_Id: number
  State_Id: number
}

export interface IGetPartBSectionThreeData{
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
  State_Id: number
  State: string
  City: string
  City_Id: number
  From_Date: string
  To_Date: string
}
