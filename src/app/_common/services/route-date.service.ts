import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { StorageService } from "./storage.service";

@Injectable({
    providedIn:'any'
})

export class RouteDateService {
    
    constructor(private _localStorage:StorageService){

    }

    private _data = new BehaviorSubject('default')
    getData = this._data.asObservable()

    SetData(data:any){
        this._data.next(data)
    }
    
}