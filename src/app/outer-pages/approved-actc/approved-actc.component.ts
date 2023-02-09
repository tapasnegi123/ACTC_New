import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, Subject } from 'rxjs';
import { IApprovedACTC } from 'src/app/_common/interface/approved-actc.interface';
import { AuthenticationService } from 'src/app/_common/services/authentication.service';
import { ToastService } from 'src/app/_common/services/toast.service';
@Component({
  selector: 'app-approved-actc',
  templateUrl: './approved-actc.component.html',
  styleUrls: ['./approved-actc.component.scss']
})
export class ApprovedActcComponent implements OnInit  {

  constructor(private _auth:AuthenticationService,private _toast:ToastService,private _fb:FormBuilder) {
  }

  unsubscribe:Subject<any> = new Subject();
  approvedACTCList:Array<any> = []
  mockACTCArr:Array<any> = []

  ngOnInit() {
    this.GetApprovedACTCList()
  }

  @ViewChild('typeahead') typeahead!:any
  ngAfterViewInit(){

  }

  DataFromTypeahead(event:any){
    console.log(event)
    let mockData = this.approvedACTCList.find((element:IApprovedACTC) => {
      return element.federationName = event

    })
    console.log(mockData)
    if(event == ""){
      console.log("This is empty")
    }
    this.mockACTCArr = []
    this.mockACTCArr.push(mockData)
  }

  CheckForEmptyData(data:any){
    console.log("CheckForEmptyData method is called")
    console.log(data)
    this.mockACTCArr = this.approvedACTCList
  }


  GetApprovedACTCList(){
    this._auth.GetApprovedACTCList().subscribe({
      next: (response:any) => {
        this.approvedACTCList = response
        this.mockACTCArr = response
      }
    })
  }
 
  title:string='APPROVED ACTC CALENDAR AND BUDGET'
   
  ngOnDestroy(){
    this.unsubscribe.unsubscribe()
  }
}
