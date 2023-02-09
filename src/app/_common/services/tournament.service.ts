import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from '../core-services/http.service';

@Injectable({
  providedIn: 'any'
})
export class TournamentService {
  url: string = environment.apiEndPoint;

  constructor(private _api: HttpService, public http: HttpClient) { }

  GetTournamentList(appId: number, userId: number) {
    return this._api.get("StakeHolder/GetTournamentList?appId=" + appId + "&userId=" + userId);
  }

  deleteTournament(item: number) {
    return this._api.put("StakeHolder/DeleteTournament?tournament_detail_id=" + item)
  }

  getTournamentCategoryData() {
    return this._api.get("Master/TournamentCategoryList")
  }

  getAgeCategoryData() {
    return this._api.get("Master/AgeCategoryMaster")
  }

  getDisciplineData() {
    return this._api.get("Master/SportList")
  }

  getCountryData() {
    return this._api.get("Master/CountryMasterList")
  }
  getStateData(id: any) {
    return this._api.get("Master/StateMasterList?countryId=" + id)
  }
  getCityData(id: any) {
    return this._api.get("Master/CityMasterList?state_id=" + id)
  }
  SaveTournament(data: any) {
    return this._api.post("StakeHolder/SaveTournament", data)
  }
  getTournamnetSportMapData(id: any) {
    return this._api.get("StakeHolder/GetTournamentSportMapping?tournament_detail_id=" + id)
  }
  getEventDetailSportWise(sport_id: number) {
    return this._api.get("Master/GetEventdetailSportwise?sport_id=" + sport_id)
  }
  getEventView(tournamentId: any, sportId: any) {
    return this._api.get("StakeHolder/GetEventList?tournamentId=" + tournamentId + "&sportId" + sportId)
  }
  saveEvent(tournament_detail_id: any,event_id:any) {
    return this._api.post("StakeHolder/SaveEvent",{tournament_detail_id,event_id} )
  }
  deleteEventMaster(eventId: any, userId: any) {
    return this._api.post(`Master/DeleteTournamentEvent?eventId=${eventId}&userId=${userId}`, {})
  }
  getSportList() {
    return this._api.get("Master/SportList")
  }
  createTournamentEvent(data: any) {
    return this._api.post("Master/CreateTournamentEvent", data)
  }
}

export interface ItournamendData {
  tournament_Detail_Id: number;
  tournament_Name: string;
  tournament_Edition: number;
  tournament_Year: number;
  tournament_Category_Id: number;
  sport_detail_id: number;
  tournament_Category_Name: string;
  tournament_Level: string;
  category: string;
  age_group: number;
  from_Date: Date;
  to_date: Date;
  venue: string;
  venue_country: number;
  venue_state: number;
  venue_city: number;
  venue_place: string;
}

