import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { CommonFormsService, IFormList } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { StorageService } from 'src/app/_common/services/storage.service';

@Component({
  selector: 'app-actc-forms-part-B',
  templateUrl: './actc-forms-part-B.component.html',
  styleUrls: ['./actc-forms-part-B.component.scss']
})
export class ActcFormsPartBComponent implements OnInit {

  @Input() year:any;
  formId = 2
  newSection:string = 'Form_PartB_home'   // Form_PartB_00

  constructor(private _actcCommon:CommonFormsService, private _localStorage: StorageService) {

  }
  userDetail:any
  ngOnInit() {
    this.userDetail = this._localStorage.GetUserDetailAfterLogin();
    this.GetFormList()
  }

  actcFormList$:Observable<any> = new Observable()
  formList:Array<any> = [];
  unsubscribe:Subject<any> = new Subject();
  GetFormList(){
    this.actcFormList$ = this._actcCommon.GetFormList(this.formId, this.year, this.userDetail.sportId).pipe(
      map(response => {
        this.formList = [...response.formList]
        return response.formList
      }),
      takeUntil(this.unsubscribe)
    )
  }
  
  formListData:any
  ToggleSectionTemplate(data:IFormList){
    
    if(this.newSection !== data.formName){
      let status = this._actcCommon.ToggleSectionTemplate(data,this.formList)
      this.formListData = data
      if(status != (null || '')){
        this.newSection = status
      }else{
        return 
      }
    }
  }

  FormHome(){
    this.newSection = 'Form_PartB_home'
  }

  @Output() dataFromPartB:EventEmitter<any> = new EventEmitter()
  DataFromChildComponent(data:any){
    if(typeof data == "string"){
      let res = this.formList.find( obj => obj.formName === data)
      this.formListData = res
      this.newSection = data
      return  
    }
    let formIndex = this.formList.indexOf(data)
    this.formList[formIndex].isfilledby_nsf = true

    if((this.formList.length - 1) == formIndex){
      this.dataFromPartB.emit(2)
      this.formListData = this.formList[0] 
      this.newSection = this.formList[0].formName  
    }else{
      this.formListData = this.formList[formIndex + 1] 
      this.newSection = this.formList[formIndex + 1].formName
    }
    // if(data == "Form_PartB_00"){
    //   this.dataFromPartB.emit(2)
    // }
    // this.formList.map( obj => {
    //   if(obj.formName == data){
    //     obj.isfilledby_nsf = true
    //   }
    //   return obj
    // })
    // this.newSection = data

  }

  GoToSectionOne(formName:any){
    let formListObj = this.formList.find( (obj) => obj.formName === formName)
    this.formListData = formListObj
    this.newSection = formListObj?.formName
  }


}
