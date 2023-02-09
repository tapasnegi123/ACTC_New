import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { INSFInfo } from "src/app/inner-pages/manage-actc/manage-actc-list/manage-actc-list.component";
import { StorageService } from "../storage.service";

@Injectable({
    providedIn:'any'
})

export class ManageActcState{

    private storage = inject(StorageService)
    private obj:INSFInfo = {
        approved_budget: 0,
        currentUser: 0,
        federation_Id: 0,
        toggleStatus: 0,
        federationName: "",
        sport_name: "",
        financialYear: "",
        proposed_budget: 0,
        final_status: "",
        sport_detail_id: 0
    }

    private listData$ = new BehaviorSubject<INSFInfo>(this.obj)

    SetNsfInfo(data:any){
        this.storage.SetNsfInfo(data)
        this.listData$.next(data)
    }

    GetNsfInfo(){
        return this.listData$.asObservable()
    }

    // get getNsfInfo(){
    //     return this.listData$.asObservable() 
    // }
}