import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()

export class MockDataService{
    private messageSource = new BehaviorSubject('')
    getMessage = this.messageSource.asObservable()

    ChangeData(data:any){
        this.messageSource.next(data)
    }
}