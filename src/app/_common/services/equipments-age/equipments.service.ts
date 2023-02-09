import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpService } from "../../core-services/http.service";

@Injectable({
    providedIn: 'any'
})

export class EquipmentAgeCategoryService {

    constructor(private _api: HttpService) {

    }

    getACTCMasterData(sportId: any, mode: string): Observable<any> {
        return this._api.getACTC(`Common/ACTCGetMasterData?sport_detail_id=${sportId}&mode=${mode}`)
    }

    getSportsDetails(): Observable<any> {
        return this._api.getACTC("Common/getsportdetail");
    }

    saveSportsEquipments(mode: string, obj: Object): Observable<any> {
        return this._api.postACTC(`Common/ACTCSAVEEquipmentmasterData?mode=${mode}`, obj)
    }

    deleteSportId(obj: any): Observable<any> {
        return this._api.postACTC(`Common/ACTCSAVEEquipmentmasterData?mode=delete`, obj)
    }


    // Age Category API
    getAgeCateogory(sportId: number, mode: string): Observable<any> {
        return this._api.getACTC(`Common/GetAgeCategoryData?sport_detail_id=${sportId}&mode=${mode}`)
    }

    saveAgeCategory(mode: string, obj: Object) {
        return this._api.postACTC(`Common/ACTCSAVEAgeCategoryData?mode=${mode}`, obj)
    }
    deleteAgeCategory(obj: any): Observable<any> {
        return this._api.postACTC(`Common/ACTCSAVEAgeCategoryData?mode=delete`, obj)
    }
}

export interface Iequipment {
    equipment_Id: number;
    equipment_Name: string;
    is_consumeable: string;
    sport_detail_id: number;
    sport_name: string;
}